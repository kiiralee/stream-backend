/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { parseBoolean } from '../../../shared/utils/parse-boolean.util';
import { getSessionMetadata } from '../../../shared/utils/session-metodata.util';
import { LoginInput } from './inputs/login.input';

/** Сессия connect-redis в JSON + id из ключа Redis после фильтра по userId */
type UserSessionListItem = {
  id: string;
  userId?: string;
  createdAt?: number;
};

type RedisSessionJson = Omit<UserSessionListItem, 'id'>;

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('Пользователь не обнаружен в сессии');
    }

    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const keys = await this.redisService.client.keys(`${prefix}*`);

    const userSessions: UserSessionListItem[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);

      if (sessionData) {
        const session = JSON.parse(sessionData) as RedisSessionJson;

        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1] ?? '',
          });
        }
      }
    }

    userSessions.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    return userSessions.filter((session) => session.id === req.session.id);
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const metadata = getSessionMetadata(req, userAgent);

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;

      req.session.save((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Не удалось сохранить сессию'));
        }

        resolve(user);
      });
    });
  }

  public async logout(req: Request) {
    const userId = typeof req.session?.userId === 'string' ? req.session.userId : undefined;
    const sessionId = req.sessionID;
    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const redisKey = `${prefix}${sessionId}`;

    if (userId === undefined) {
      this.logger.warn(
        `logoutUser: в сессии нет userId (часто нет Cookie в запросе, например Playground без credentials). sessionID=${sessionId}. Старый ключ в Redis от логина не будет затронут.`,
      );
    }

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Не удалось завершить сессию'));
          return;
        }
        resolve();
      });
    });

    try {
      if ((await this.redisService.client.exists(redisKey)) !== 0) {
        await this.redisService.client.del(redisKey);
        this.logger.warn(
          `logoutUser: после destroy ключ ещё был в Redis — выполнен дополнительный DEL, ключ "${redisKey}"`,
        );
      }

      if (userId !== undefined) {
        const removedOthers = await this.removeRedisSessionKeysForUser(userId);
        this.logger.log(
          `logoutUser: удалено прочих сессий этого пользователя в Redis: ${removedOthers} (ключи с тем же userId в теле сессии)`,
        );
      }
    } catch {
      throw new InternalServerErrorException('Не удалось проверить/удалить сессию в Redis');
    }

    const res = req.res;
    if (!res) {
      throw new InternalServerErrorException('Нет объекта ответа для очистки cookie сессии');
    }

    const sessionName = this.configService.getOrThrow<string>('SESSION_NAME');
    const secure = parseBoolean(this.configService.getOrThrow<string>('SESSION_SECURE'));
    const httpOnly = parseBoolean(this.configService.getOrThrow<string>('SESSION_HTTP_ONLY'));
    const domainRaw = this.configService.get<string>('SESSION_DOMAIN');
    const domain = domainRaw?.trim();

    res.clearCookie(sessionName, {
      path: '/',
      httpOnly,
      secure,
      sameSite: 'lax',
      ...(domain ? { domain } : {}),
    });

    return true;
  }

  /**
   * Сканирует ключи connect-redis (prefix + *) и удаляет сессии, в JSON которых тот же userId.
   * Нужен, потому что logout по cookie снимает только одну запись; старые логины оставляют другие session id в Redis.
   */
  private async removeRedisSessionKeysForUser(userId: string): Promise<number> {
    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const pattern = `${prefix}*`;
    const client = this.redisService.client;
    let removed = 0;

    const iter = this.redisService.client.scanIterator({ MATCH: pattern, COUNT: 100 });
    for await (const keyBatch of iter) {
      const keys = Array.isArray(keyBatch) ? keyBatch : [keyBatch];
      for (const key of keys) {
        const keyStr = String(key);
        const raw = await client.get(keyStr);
        if (raw === null || typeof raw !== 'string') {
          continue;
        }
        try {
          const parsed = JSON.parse(raw) as { userId?: string };
          if (parsed.userId === userId) {
            await client.del(keyStr);
            removed++;
          }
        } catch {
          // не JSON сессии connect-redis — пропускаем
        }
      }
    }

    return removed;
  }
}
