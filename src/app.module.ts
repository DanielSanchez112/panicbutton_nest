import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma-module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { EmergencyContactsModule } from './emergency_contacts/emergency_contacts.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { AlertTypesModule } from './alert-types/alert-types.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { MqttModule } from './mqtt/mqtt.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        TestModule,
        MqttModule,
        UsersModule, 
        AlertsModule, 
        EmergencyContactsModule, 
        DeviceTypesModule, 
        AlertTypesModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
