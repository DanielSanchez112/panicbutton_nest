import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';
import { PublishMessageDto } from './dto/publish-message.dto';
import { SubscribeTopicDto } from './dto/subscribe-topic.dto';
import { PublishAlertDto } from './dto/publish-alert.dto';
import { PublishLocationMessageDto } from './dto/publish-location-message.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('MQTT')
@Controller('mqtt')
@Public() // Hacer todo el controlador público para pruebas
export class MqttController {
  private readonly logger = new Logger(MqttController.name);

  constructor(private readonly mqttService: MqttService) {}

  @Get('status')
  @ApiOperation({ summary: 'Verificar estado de conexión MQTT' })
  @ApiResponse({ status: 200, description: 'Estado de conexión' })
  getConnectionStatus() {
    return {
      connected: this.mqttService.isClientConnected(),
      brokerUrl: 'mqtt://localhost:1883',
      clientId: 'panicbutton-nest-client',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publicar mensaje en un tópico MQTT' })
  @ApiBody({ type: PublishMessageDto })
  @ApiResponse({ status: 200, description: 'Mensaje publicado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al publicar mensaje' })
  async publishMessage(@Body() publishDto: PublishMessageDto) {
    try {
      await this.mqttService.publish(
        publishDto.topic, 
        publishDto.payload, 
        {
          qos: publishDto.qos || 1,
          retain: publishDto.retain || false,
        }
      );

      this.logger.log(`Mensaje publicado exitosamente en ${publishDto.topic}`);
      return {
        success: true,
        message: `Mensaje publicado en tópico: ${publishDto.topic}`,
        topic: publishDto.topic,
        payload: publishDto.payload,
        qos: publishDto.qos || 1,
        retain: publishDto.retain || false,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error al publicar mensaje: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('publish-location')
  @ApiOperation({ summary: 'Publicar mensaje JSON con latitud y longitud' })
  @ApiBody({ type: PublishLocationMessageDto })
  @ApiResponse({ status: 200, description: 'Mensaje JSON con ubicación publicado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al publicar mensaje' })
  async publishLocationMessage(@Body() locationDto: PublishLocationMessageDto) {
    try {
      // Crear el objeto JSON con la ubicación
      const locationData = {
        latitude: locationDto.latitude,
        longitude: locationDto.longitude,
        message: locationDto.message || 'Mensaje de ubicación desde Swagger',
        accuracy: locationDto.accuracy || 0,
        timestamp: new Date().toISOString(),
        source: 'swagger_json_test'
      };

      // Convertir a JSON string
      const jsonPayload = JSON.stringify(locationData);

      await this.mqttService.publish(
        locationDto.topic, 
        jsonPayload, 
        {
          qos: locationDto.qos || 1,
          retain: locationDto.retain || false,
        }
      );

      this.logger.log(`Mensaje JSON con ubicación publicado en ${locationDto.topic}`);
      return {
        success: true,
        message: `Mensaje JSON con ubicación publicado en tópico: ${locationDto.topic}`,
        topic: locationDto.topic,
        payload: locationData,
        payloadString: jsonPayload,
        qos: locationDto.qos || 1,
        retain: locationDto.retain || false,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error al publicar mensaje JSON: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Suscribirse a un tópico MQTT' })
  @ApiBody({ type: SubscribeTopicDto })
  @ApiResponse({ status: 200, description: 'Suscripción exitosa' })
  @ApiResponse({ status: 400, description: 'Error en la suscripción' })
  async subscribeToTopic(@Body() subscribeDto: SubscribeTopicDto) {
    try {
      await this.mqttService.subscribe(subscribeDto.topic, {
        qos: subscribeDto.qos || 1,
      });

      this.logger.log(`Suscripción exitosa al tópico: ${subscribeDto.topic}`);
      return {
        success: true,
        message: `Suscrito al tópico: ${subscribeDto.topic}`,
        topic: subscribeDto.topic,
        qos: subscribeDto.qos || 1,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error en suscripción: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('unsubscribe/:topic')
  @ApiOperation({ summary: 'Desuscribirse de un tópico MQTT' })
  @ApiResponse({ status: 200, description: 'Desuscripción exitosa' })
  @ApiResponse({ status: 400, description: 'Error en la desuscripción' })
  async unsubscribeFromTopic(@Param('topic') topic: string) {
    try {
      await this.mqttService.unsubscribe(topic);

      this.logger.log(`Desuscripción exitosa del tópico: ${topic}`);
      return {
        success: true,
        message: `Desuscrito del tópico: ${topic}`,
        topic: topic,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error en desuscripción: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

//   @Post('test/publish-alert')
//   @ApiOperation({ summary: 'Publicar una alerta de prueba con ubicación' })
//   @ApiBody({ type: PublishAlertDto })
//   @ApiResponse({ status: 200, description: 'Alerta de prueba publicada' })
//   @ApiResponse({ status: 400, description: 'Error al publicar alerta' })
//   async publishTestAlert(@Body() alertDto: PublishAlertDto) {
//     try {
//       const alertData = {
//         alertId: `alert-${Date.now()}`,
//         userId: alertDto.user_id,
//         type: alertDto.alert_type || 'panic_button',
//         location: {
//           latitude: alertDto.latitude,
//           longitude: alertDto.longitude,
//           accuracy: alertDto.accuracy || 0
//         },
//         timestamp: new Date().toISOString(),
//         priority: alertDto.priority || 'HIGH',
//         source: 'swagger_test'
//       };

//       // Publicar en el tópico específico: panicbutton/{user_id}/alerts/test
//       const topic = `panicbutton/${alertDto.user_id}/alerts/test`;
      
//       await this.mqttService.publish(
//         topic,
//         JSON.stringify(alertData),
//         { qos: 1, retain: false }
//       );

//       this.logger.log(`Alerta de prueba publicada en: ${topic}`);
//       return {
//         success: true,
//         message: `Alerta de prueba publicada en tópico: ${topic}`,
//         topic: topic,
//         data: alertData,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       this.logger.error(`Error al publicar alerta de prueba: ${error.message}`);
//       return {
//         success: false,
//         message: error.message,
//         timestamp: new Date().toISOString(),
//       };
//     }
//   }

//   @Post('test/subscribe-alerts')
//   @ApiOperation({ summary: 'Suscribirse a todos los tópicos de alertas' })
//   @ApiResponse({ status: 200, description: 'Suscripción a alertas exitosa' })
//   async subscribeToAlerts() {
//     try {
//       const topics = [
//         'panicbutton/+/alerts/+',    // Todas las alertas de todos los usuarios
//         'panicbutton/+/alerts/test', // Alertas de prueba específicamente
//         'panicbutton/system/+',      // Mensajes del sistema
//         'panicbutton/devices/+/status' // Estado de dispositivos
//       ];

//       for (const topic of topics) {
//         await this.mqttService.subscribe(topic, { qos: 1 });
//       }

//       this.logger.log('Suscrito a todos los tópicos de alertas');
//       return {
//         success: true,
//         message: 'Suscrito a todos los tópicos de alertas',
//         topics: topics,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       this.logger.error(`Error en suscripción a alertas: ${error.message}`);
//       return {
//         success: false,
//         message: error.message,
//         timestamp: new Date().toISOString(),
//       };
//     }
//   }

//   @Post('test/subscribe-user-alerts/:user_id')
//   @ApiOperation({ summary: 'Suscribirse a alertas de un usuario específico' })
//   @ApiResponse({ status: 200, description: 'Suscripción a alertas del usuario exitosa' })
//   @ApiResponse({ status: 400, description: 'Error en la suscripción' })
//   async subscribeToUserAlerts(@Param('user_id') userId: number) {
//     try {
//       const topics = [
//         `panicbutton/${userId}/alerts/+`,    // Todas las alertas del usuario
//         `panicbutton/${userId}/alerts/test`, // Alertas de prueba del usuario
//         `panicbutton/${userId}/location`,    // Ubicación del usuario
//         `panicbutton/${userId}/status`       // Estado del usuario
//       ];

//       for (const topic of topics) {
//         await this.mqttService.subscribe(topic, { qos: 1 });
//       }

//       this.logger.log(`Suscrito a alertas del usuario ${userId}`);
//       return {
//         success: true,
//         message: `Suscrito a alertas del usuario ${userId}`,
//         userId: userId,
//         topics: topics,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       this.logger.error(`Error en suscripción a alertas del usuario: ${error.message}`);
//       return {
//         success: false,
//         message: error.message,
//         timestamp: new Date().toISOString(),
//       };
//     }
//   }

//   @Post('test/publish-location')
//   @ApiOperation({ summary: 'Publicar ubicación de un usuario' })
//   @ApiBody({ 
//     schema: {
//       type: 'object',
//       properties: {
//         user_id: { type: 'number', example: 1 },
//         latitude: { type: 'number', example: -34.6037 },
//         longitude: { type: 'number', example: -58.3816 },
//         accuracy: { type: 'number', example: 10 }
//       }
//     }
//   })
//   @ApiResponse({ status: 200, description: 'Ubicación publicada exitosamente' })
//   @ApiResponse({ status: 400, description: 'Error al publicar ubicación' })
//   async publishLocation(@Body() locationDto: { user_id: number; latitude: number; longitude: number; accuracy?: number }) {
//     try {
//       const locationData = {
//         userId: locationDto.user_id,
//         location: {
//           latitude: locationDto.latitude,
//           longitude: locationDto.longitude,
//           accuracy: locationDto.accuracy || 0
//         },
//         timestamp: new Date().toISOString(),
//         source: 'swagger_test'
//       };

//       const topic = `panicbutton/${locationDto.user_id}/location`;
      
//       await this.mqttService.publish(
//         topic,
//         JSON.stringify(locationData),
//         { qos: 1, retain: true } // retain=true para mantener última ubicación
//       );

//       this.logger.log(`Ubicación publicada para usuario ${locationDto.user_id}`);
//       return {
//         success: true,
//         message: `Ubicación publicada en tópico: ${topic}`,
//         topic: topic,
//         data: locationData,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       this.logger.error(`Error al publicar ubicación: ${error.message}`);
//       return {
//         success: false,
//         message: error.message,
//         timestamp: new Date().toISOString(),
//       };
//     }
//   }
}
