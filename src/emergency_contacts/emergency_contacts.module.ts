import { Module } from '@nestjs/common';
import { EmergencyContactsService } from './emergency_contacts.service';
import { EmergencyContactsController } from './emergency_contacts.controller';
import { PrismaModule } from '../prisma-module';

@Module({
  imports: [PrismaModule],
  controllers: [EmergencyContactsController],
  providers: [EmergencyContactsService],
  exports: [EmergencyContactsService],
})
export class EmergencyContactsModule {}
