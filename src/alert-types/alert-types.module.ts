import { Module } from '@nestjs/common';
import { AlertTypesService } from './alert-types.service';
import { AlertTypesController } from './alert-types.controller';
import { PrismaModule } from '../prisma-module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertTypesController],
  providers: [AlertTypesService],
  exports: [AlertTypesService],
})
export class AlertTypesModule {}
