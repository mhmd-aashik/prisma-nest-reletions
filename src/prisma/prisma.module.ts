import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PRISMA MODULE
 *
 * @Global() decorator makes this module available everywhere
 * without needing to import it in every module.
 * This is useful for database services that are needed everywhere.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so other modules can use it
})
export class PrismaModule {}
