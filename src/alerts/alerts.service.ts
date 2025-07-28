import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import e from 'express';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);
  private vonageClient: Vonage;
  private vonageFromNumber?: string;

  constructor(
    private readonly prisma: PrismaService, 
    private readonly configService: ConfigService, 
  ) {
    const apiKey = this.configService.get<string>('VONAGE_API_KEY');
    const apiSecret = this.configService.get<string>('VONAGE_API_SECRET');
    this.vonageFromNumber = this.configService.get<string>('VONAGE_FROM_NUMBER'); // Asegúrate de que esto sea un string

    if (!apiKey || !apiSecret || !this.vonageFromNumber) {
      this.logger.error('Missing Vonage credentials in environment variables. SMS alerts will not be sent.');
    } else {
      try {
        // Correcta inicialización de Vonage con autenticación básica
        this.vonageClient = new Vonage(new Auth({
          apiKey: apiKey,
          apiSecret: apiSecret
        }));
        this.logger.log('Vonage client initialized for sending SMS alerts.');
      } catch (error) {
        this.logger.error('Failed to initialize Vonage client:', error.message);
      }
    }
  }

  private async sendSmsAlert(toPhoneNumber: string, messageBody: string): Promise<any> {
    if (!this.vonageClient || !this.vonageFromNumber) {
      this.logger.warn('Vonage client not initialized or Vonage phone number missing. Skipping SMS message.');
      return;
    }

    try {
      const { 'message-count': messageCount, messages } = await this.vonageClient.sms.send({
        to: toPhoneNumber as string, // Asegura que TypeScript lo vea como string
        from: this.vonageFromNumber as string, // Asegura que TypeScript lo vea como string
        text: messageBody,
      });

      if (messageCount && messageCount > 0 && messages && messages[0].status === '0') {
        this.logger.log(`SMS alert sent successfully to ${toPhoneNumber}. Message ID: ${messages[0]['message-id']}`);
        return messages[0];
      } else {
        const errorText = messages && messages[0]['error-text'] ? messages[0]['error-text'] : 'No error text available.';
        this.logger.error(`Failed to send SMS to ${toPhoneNumber}. Status: ${messages ? messages[0].status : 'Unknown'}. Error: ${errorText}`);
        throw new Error(`Failed to send SMS: ${errorText}`);
      }
    } catch (error) {
      this.logger.error(`Error sending SMS alert to ${toPhoneNumber}:`, error.message);
    }
  }

  private sanitizeAndTruncateForSms(text: string | undefined | null, maxLength: number): string {
    if (!text) {
      return '';
    }
    // 1. Sanear (quitar acentos, ñ, emojis)
    let cleanedText = text
      .normalize("NFD") // Descompone caracteres acentuados en base y acento
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos descompuestos
      .replace(/ñ/g, "n").replace(/Ñ/g, "N") // Reemplaza ñ/Ñ
      .replace(/[^\x20-\x7E]/g, ''); // Elimina cualquier otro carácter no-ASCII (caracteres ASCII imprimibles)

    // 2. Truncar si es necesario
    if (cleanedText.length > maxLength) {
      cleanedText = cleanedText.substring(0, maxLength - 3) + '...'; // Dejar espacio para '...'
    }
    return cleanedText;
  }


  async create(createAlertDto: CreateAlertDto) {
    const data = await this.prisma.alerts.create({data: createAlertDto})
    const alertType = await this.prisma.alert_types.findUnique({ where: { id: createAlertDto.alert_type_id } });
    const deviceType = await this.prisma.device_types.findUnique({ where: { id: createAlertDto.dive_type_id } });
    const emergencyContacts = await this.prisma.emergency_contacts.findMany({where: { user_id: createAlertDto.user_id },});
    const user = await this.prisma.users.findUnique({ where: { id: createAlertDto.user_id } });

    if (!data || !alertType || !user || !deviceType || emergencyContacts.length === 0) {
        this.logger.error('data, alertType, user, deviceType or emergencyContacts not found for alert creation.');
        throw new Error('User or AlertType not found.');
    }

    const sanitizedUserName = this.sanitizeAndTruncateForSms(`${user.name || ''} ${user.last_name || ''}`, 20); // Limita el nombre a 20 caracteres
    const sanitizedAlertType = this.sanitizeAndTruncateForSms(alertType.name, 15); // Limita el tipo de alerta
    const sanitizedDescription = this.sanitizeAndTruncateForSms(alertType.description, 70); // Limita la descripción a 70 caracteres

    // La URL aún no está generada, así que la mantenemos como un placeholder
    const realTimeViewPlaceholder = "(link aqui)"; // Esto contará como 11 caracteres

    const messageContent = `ALERTA!
${sanitizedUserName}
Tipo: ${sanitizedAlertType}
Info: ${sanitizedDescription}
Ubicacion: ${createAlertDto.location_lat},${createAlertDto.location_lng}
Ver: ${realTimeViewPlaceholder}

`;

    this.logger.debug(`SMS message content before sending:\n${messageContent}`);
    this.logger.debug(`Estimated SMS message length: ${messageContent.length} characters.`);

    for (const contact of emergencyContacts) {
      const formattedPhoneNumber = contact.phone_number;

      if (formattedPhoneNumber) {
        this.logger.log(`Attempting to send SMS alert to ${contact.name} (${formattedPhoneNumber})`);
        await this.sendSmsAlert(formattedPhoneNumber, messageContent);
      } else {
        this.logger.warn(`Contact ${contact.name} has an invalid phone number for SMS: ${contact.phone_number}`);
      }
    }

    return data
  }

  async findAll() {
    const data = await this.prisma.alerts.findMany({
      where: { active: true }
    })
    return data
  }

  async findByUserId(id: number) {
    const alerts = await this.prisma.alerts.findMany({
      where: { user_id: BigInt(id), active: true },
      include: {
        users: true,
        emergency_contacts: true,
      }
    })
    if (alerts.length === 0) {
      throw new NotFoundException(`No active alerts found for user ID ${id}`);
    }
    return alerts;
  }

  async findOne(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id), active: true },
      include:{
        users: true,
        emergency_contacts: true
      }
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.update({
      where: { id: BigInt(id) },
      data: updateAlertDto,
    });
  }

  async remove(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.delete({
      where: { id: BigInt(id) },
    });
  }

  async toggleActive(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.update({
      where: { id: BigInt(id) },
      data: { active: !alert.active },
    });
  }
}
