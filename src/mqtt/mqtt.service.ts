import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

export interface MqttMessage {
  topic: string;
  payload: string;
  qos: 0 | 1 | 2;
  retain: boolean;
}

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
    // Suscribirse automáticamente a tópicos importantes
    await this.subscribeToSystemTopics();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async subscribeToSystemTopics(): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('No se puede suscribir a tópicos del sistema: cliente no conectado');
      return;
    }

    try {
      // Suscribirse a tópicos del sistema
      const systemTopics = [
        'panicbutton/system/+',          // Mensajes del sistema
        'panicbutton/+/alerts/+',        // Todas las alertas de todos los usuarios
        'panicbutton/+/location',        // Ubicaciones de todos los usuarios
        'panicbutton/+/status',          // Estado de todos los usuarios
        'panicbutton/devices/+/status'   // Estado de dispositivos
      ];

      for (const topic of systemTopics) {
        await this.subscribe(topic, { qos: 1 });
      }

      this.logger.log('Suscrito automáticamente a tópicos del sistema');
    } catch (error) {
      this.logger.error(`Error al suscribirse a tópicos del sistema: ${error.message}`);
    }
  }

  private async connect(): Promise<void> {
    try {
      const brokerUrl = this.configService.get<string>('MQTT_BROKER_URL', 'mqtt://localhost:1883');
      const clientId = this.configService.get<string>('MQTT_CLIENT_ID', `panicbutton-nest-${Math.random().toString(16).substring(2, 8)}`);
      const username = this.configService.get<string>('MQTT_USERNAME');
      const password = this.configService.get<string>('MQTT_PASSWORD');

      this.logger.log(`Intentando conectar al broker MQTT: ${brokerUrl}`);

      const options: mqtt.IClientOptions = {
        clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        keepalive: 60,
        reschedulePings: true,
      };

      if (username && password) {
        options.username = username;
        options.password = password;
        this.logger.log('Usando autenticación con usuario y contraseña');
      } else {
        this.logger.log('Conectando sin autenticación');
      }

      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`✅ Conectado exitosamente al broker MQTT: ${brokerUrl} con ID: ${clientId}`);
      });

      this.client.on('error', (error) => {
        this.isConnected = false;
        this.logger.error(`❌ Error en la conexión MQTT: ${error.message}`);
      });

      this.client.on('offline', () => {
        this.isConnected = false;
        this.logger.warn('⚠️ Cliente MQTT desconectado (offline)');
      });

      this.client.on('reconnect', () => {
        this.logger.log('🔄 Reintentando conexión MQTT...');
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.logger.warn('🔒 Conexión MQTT cerrada');
      });

      this.client.on('message', (topic, payload, packet) => {
        this.handleMessage({
          topic,
          payload: payload.toString(),
          qos: packet.qos,
          retain: packet.retain,
        });
      });

      // Esperar a que se establezca la conexión
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout al conectar con el broker MQTT'));
        }, 5000);

        this.client.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.client.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

    } catch (error) {
      this.logger.error(`Error al conectar con el broker MQTT: ${error.message}`);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await new Promise<void>((resolve) => {
        this.client.end(false, {}, () => {
          this.isConnected = false;
          this.logger.log('Desconectado del broker MQTT');
          resolve();
        });
      });
    }
  }

  private handleMessage(message: MqttMessage): void {
    this.logger.debug(`📨 Mensaje recibido en ${message.topic}: ${message.payload}`);
    
    try {
      // Intentar parsear como JSON para logging detallado
      const parsedPayload = JSON.parse(message.payload);
      this.logger.log(`📨 Mensaje JSON recibido en ${message.topic}:`, parsedPayload);
    } catch (error) {
      // Si no es JSON válido, loggear como texto plano
      this.logger.log(`📨 Mensaje de texto recibido en ${message.topic}: ${message.payload}`);
    }

    // Manejar diferentes tipos de mensajes según el tópico
    if (message.topic.includes('/alerts/')) {
      this.handleAlertMessage(message);
    } else if (message.topic.includes('/location')) {
      this.handleLocationMessage(message);
    } else if (message.topic.includes('/status')) {
      this.handleStatusMessage(message);
    } else if (message.topic.startsWith('panicbutton/devices/')) {
      this.handleDeviceMessage(message);
    } else if (message.topic.startsWith('panicbutton/system/')) {
      this.handleSystemMessage(message);
    }
  }

  private handleAlertMessage(message: MqttMessage): void {
    this.logger.log(`🚨 Procesando alerta desde tópico: ${message.topic}`);
    
    // Extraer user_id del tópico panicbutton/{user_id}/alerts/test
    const topicParts = message.topic.split('/');
    if (topicParts.length >= 3) {
      const userId = topicParts[1];
      const alertType = topicParts[3] || 'unknown';
      this.logger.log(`🚨 Alerta de tipo '${alertType}' del usuario ${userId}`);
    }
  }

  private handleLocationMessage(message: MqttMessage): void {
    this.logger.log(`📍 Procesando ubicación desde tópico: ${message.topic}`);
    
    // Extraer user_id del tópico panicbutton/{user_id}/location
    const topicParts = message.topic.split('/');
    if (topicParts.length >= 2) {
      const userId = topicParts[1];
      this.logger.log(`📍 Ubicación actualizada para usuario ${userId}`);
    }
  }

  private handleStatusMessage(message: MqttMessage): void {
    this.logger.log(`📊 Procesando estado desde tópico: ${message.topic}`);
    
    // Extraer user_id del tópico panicbutton/{user_id}/status
    const topicParts = message.topic.split('/');
    if (topicParts.length >= 2) {
      const userId = topicParts[1];
      this.logger.log(`📊 Estado actualizado para usuario ${userId}`);
    }
  }

  private handleDeviceMessage(message: MqttMessage): void {
    this.logger.log(`📱 Procesando mensaje de dispositivo desde tópico: ${message.topic}`);
    // Aquí puedes agregar lógica específica para manejar mensajes de dispositivos
  }

  private handleSystemMessage(message: MqttMessage): void {
    this.logger.log(`⚙️ Procesando mensaje del sistema desde tópico: ${message.topic}`);
    // Aquí puedes agregar lógica específica para manejar mensajes del sistema
  }

  /**
   * Publica un mensaje en un tópico específico
   */
  async publish(topic: string, payload: string | Buffer, options: mqtt.IClientPublishOptions = {}): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Cliente MQTT no conectado');
    }

    return new Promise((resolve, reject) => {
      this.client.publish(topic, payload, options, (error) => {
        if (error) {
          this.logger.error(`Error al publicar mensaje en ${topic}: ${error.message}`);
          reject(error);
        } else {
          this.logger.debug(`Mensaje publicado en ${topic}: ${payload}`);
          resolve();
        }
      });
    });
  }

  /**
   * Se suscribe a un tópico específico
   */
  async subscribe(topic: string | string[], options: mqtt.IClientSubscribeOptions = { qos: 1 }): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Cliente MQTT no conectado');
    }

    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, options, (error, grants) => {
        if (error) {
          this.logger.error(`Error al suscribirse a ${topic}: ${error.message}`);
          reject(error);
        } else {
          const topics = Array.isArray(topic) ? topic.join(', ') : topic;
          this.logger.log(`Suscrito a tópico(s): ${topics}`);
          resolve();
        }
      });
    });
  }

  /**
   * Se desuscribe de un tópico específico
   */
  async unsubscribe(topic: string | string[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Cliente MQTT no conectado');
    }

    return new Promise((resolve, reject) => {
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.logger.error(`Error al desuscribirse de ${topic}: ${error.message}`);
          reject(error);
        } else {
          const topics = Array.isArray(topic) ? topic.join(', ') : topic;
          this.logger.log(`Desuscrito de tópico(s): ${topics}`);
          resolve();
        }
      });
    });
  }

  /**
   * Verifica si el cliente está conectado
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Obtiene el cliente MQTT para operaciones avanzadas
   */
  getClient(): mqtt.MqttClient {
    return this.client;
  }
}
