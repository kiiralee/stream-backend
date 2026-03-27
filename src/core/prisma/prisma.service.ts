import 'dotenv/config'
import { Injectable, 
    type OnModuleInit, 
    type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/prisma/generated/client';


const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

@Injectable()
export class PrismaService 
extends PrismaClient 
implements OnModuleInit, OnModuleDestroy 
{
  constructor() {
    super({adapter});
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}