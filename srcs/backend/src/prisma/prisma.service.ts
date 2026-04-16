import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Haal de URL op uit je omgeving
    const connectionString = process.env.DATABASE_URL;
    
    // 2. Bouw de nieuwe, supersnelle Prisma 7 Adapter
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    // 3. Geef de adapter door aan Prisma
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect()
  }
}