import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>('DATABASE_URL') ?? configService.get<string>('POSTGRES_URI');
    if (!connectionString) {
      throw new Error('Задайте DATABASE_URL или POSTGRES_URI для подключения Prisma к PostgreSQL.');
    }
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
