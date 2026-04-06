/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';
import { parseBoolean } from '../../shared/utils/parse-boolean.util';
import { redisUrlForNodeRedis } from './redis-options.util';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly client: RedisClientType;

  /** Возвращает строковое значение ключа или null, если ключа нет. */
  public get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public constructor(private readonly configService: ConfigService) {
    const uri = configService.getOrThrow<string>('REDIS_URI');
    const aclRaw = configService.get<string>('REDIS_ACL');
    const useAcl = aclRaw !== undefined && parseBoolean(aclRaw);
    this.client = createClient({
      url: redisUrlForNodeRedis(uri, useAcl),
    });
  }

  public async onModuleInit() {
    await this.client.connect();
  }

  public async onModuleDestroy() {
    await this.client.quit();
  }
}
