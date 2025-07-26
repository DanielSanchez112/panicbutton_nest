# Cliente MQTT para Mosquitto

Este proyecto incluye un cliente MQTT integrado que se conecta automáticamente a un broker Mosquitto en el puerto 1883.

## Configuración

### Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=panicbutton-nest-client
MQTT_USERNAME=
MQTT_PASSWORD=
```

### Configuración del Broker

- **URL del Broker**: Por defecto se conecta a `mqtt://localhost:1883`
- **Cliente ID**: Se puede personalizar o se genera automáticamente
- **Autenticación**: Opcional (usuario y contraseña)

## Uso del Servicio MQTT

### Inyección del Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class MiServicio {
  constructor(private readonly mqttService: MqttService) {}

  async enviarMensaje() {
    // Publicar un mensaje
    await this.mqttService.publish('mi/topico', 'Hola Mundo!');
    
    // Suscribirse a un tópico
    await this.mqttService.subscribe('mi/topico/respuesta');
  }
}
```

### Métodos Disponibles

#### `publish(topic, payload, options?)`
Publica un mensaje en un tópico específico.

```typescript
await this.mqttService.publish(
  'panicbutton/alerts', 
  JSON.stringify({ alert: 'emergencia' }), 
  { qos: 1, retain: false }
);
```

#### `subscribe(topic, options?)`
Se suscribe a uno o más tópicos.

```typescript
// Suscribirse a un tópico
await this.mqttService.subscribe('panicbutton/commands');

// Suscribirse a múltiples tópicos
await this.mqttService.subscribe(['topic1', 'topic2']);
```

#### `unsubscribe(topic)`
Se desuscribe de un tópico.

```typescript
await this.mqttService.unsubscribe('panicbutton/commands');
```

#### `isClientConnected()`
Verifica si el cliente está conectado.

```typescript
if (this.mqttService.isClientConnected()) {
  console.log('Cliente MQTT conectado');
}
```

## API REST para MQTT

El módulo incluye endpoints REST para probar la funcionalidad MQTT:

### Verificar Estado de Conexión
```http
GET /mqtt/status
```

### Publicar Mensaje
```http
POST /mqtt/publish
Content-Type: application/json

{
  "topic": "test/topic",
  "payload": "Mensaje de prueba",
  "qos": 1,
  "retain": false
}
```

### Suscribirse a un Tópico
```http
POST /mqtt/subscribe
Content-Type: application/json

{
  "topic": "test/topic",
  "qos": 1
}
```

### Desuscribirse de un Tópico
```http
POST /mqtt/unsubscribe/test/topic
```

## Estructura de Tópicos Recomendada

Para el sistema de botón de pánico, se recomienda usar la siguiente estructura:

```
panicbutton/
├── alerts/
│   ├── created          # Nuevas alertas
│   ├── updated          # Alertas actualizadas
│   └── resolved         # Alertas resueltas
├── user/
│   └── {userId}/
│       ├── alerts       # Alertas específicas del usuario
│       ├── commands     # Comandos para el usuario
│       └── status       # Estado del usuario
├── devices/
│   └── {deviceId}/
│       ├── status       # Estado del dispositivo
│       ├── location     # Ubicación del dispositivo
│       └── battery      # Nivel de batería
└── system/
    ├── status           # Estado del sistema
    └── maintenance      # Mensajes de mantenimiento
```

## Ejemplo de Integración con Alertas

```typescript
// En el servicio de alertas
async create(createAlertDto: CreateAlertDto) {
  const alert = await this.prisma.alerts.create({
    data: createAlertDto 
  });

  // Notificar vía MQTT
  const alertMessage = {
    alertId: alert.id,
    userId: alert.user_id,
    timestamp: alert.created_at,
    type: 'panic_button',
    location: alert.location
  };

  await this.mqttService.publish(
    'panicbutton/alerts/created',
    JSON.stringify(alertMessage),
    { qos: 1 }
  );

  return alert;
}
```

## Manejo de Mensajes Entrantes

Para personalizar el manejo de mensajes MQTT, puedes extender el servicio:

```typescript
// En mqtt.service.ts - método handleMessage
private handleMessage(message: MqttMessage): void {
  this.logger.debug(`Mensaje recibido en ${message.topic}: ${message.payload}`);
  
  // Manejar diferentes tipos de mensajes
  if (message.topic.startsWith('panicbutton/commands/')) {
    this.handleCommand(message);
  } else if (message.topic.startsWith('panicbutton/devices/')) {
    this.handleDeviceMessage(message);
  }
}
```

## Troubleshooting

### Problemas de Conexión

1. Verifica que el broker Mosquitto esté ejecutándose
2. Confirma la URL y puerto del broker
3. Revisa las credenciales de autenticación
4. Verifica la conectividad de red

### Logs

El servicio MQTT registra información detallada:
- Conexiones y desconexiones
- Mensajes publicados y recibidos
- Errores de conexión

```bash
# Ver logs en tiempo real
npm run start:dev
```
