import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma-module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { EmergencyContactsModule } from './emergency_contacts/emergency_contacts.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { AlertTypesModule } from './alert-types/alert-types.module';

@Module({
    imports: [
        PrismaModule,
        UsersModule, 
        AlertsModule, 
        EmergencyContactsModule, 
        DeviceTypesModule, 
        AlertTypesModule
    ],
})
export class AppModule {}
