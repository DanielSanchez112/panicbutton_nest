import { Module } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';
import { PrismaModule } from '../prisma-module';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService],
  exports: [DeviceTypesService],
})
export class DeviceTypesModule {}
