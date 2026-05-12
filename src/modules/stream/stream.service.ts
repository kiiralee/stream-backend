/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import type { Prisma, User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Injectable()
export class StreamService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async findAll(input: FiltersInput = {}) {
    const { take, skip, searchTerm } = input;

    const whereClause = searchTerm ? this.findBySearchTermFilter(searchTerm) : undefined;

    const streams = await this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return streams;
  }

  public async findRandom() {
    const total = await this.prismaService.stream.count({
      where: {
        user: {
          isDeactivated: false,
        },
      },
    });

    const randomIndexes = new Set<number>();

    while (randomIndexes.size < 4) {
      const randomIndex = Math.floor(Math.random() * total);

      randomIndexes.add(randomIndex);
    }

    const streams = await this.prismaService.stream.findMany({
      where: {
        user: {
          isDeactivated: false,
        },
      },
      include: {
        user: true,
        category: true,
      },
      take: total,
      skip: 0,
    });

    return Array.from(randomIndexes).map((index) => streams[index]);
  }

  public async changeInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input;

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        title,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return true;
  }

  public async generateToken(input: GenerateStreamTokenInput) {
    const { userId, channelId } = input;

    let self: { id: string; username: string };

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      self = { id: user.id, username: user.username };
    } else {
      self = {
        id: userId,
        username: `Зритель ${Math.floor(Math.random() * 100000)}`,
      };
    }

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }

    const isHost = self.id === channel.id;

    const token = new AccessToken(
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
      {
        identity: isHost ? `Host-${self.id}` : self.id.toString(),
        name: self.username,
      },
    );

    token.addGrant({
      room: channel.id,
      roomJoin: true,
      canPublish: false,
    });

    return { token: token.toJwt() };
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId: user.id,
      },
    });

    return stream;
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }
}
