# Guía de Pruebas MQTT

## Preparación

1. **Instalar y ejecutar Mosquitto** (si no lo tienes):

### Windows:
```bash
# Descargar desde: https://mosquitto.org/download/
# O usar chocolatey:
choco install mosquitto

# Ejecutar el broker
mosquitto -v
```

### Linux/macOS:
```bash
# Ubuntu/Debian
sudo apt-get install mosquitto mosquitto-clients

# macOS
brew install mosquitto

# Ejecutar el broker
mosquitto -v
```

## Probar la Aplicación

1. **Ejecutar la aplicación NestJS**:
```bash
npm run start:dev
```

2. **Verificar conexión MQTT** (desde otra terminal):
```bash
# Verificar estado en el navegador o con curl
curl http://localhost:3000/mqtt/status
```

## Pruebas Manuales con Mosquitto

### 1. Suscribirse a todos los tópicos (Terminal 1):
```bash
mosquitto_sub -h localhost -p 1883 -t "panicbutton/#" -v
```

### 2. Publicar mensaje de prueba (Terminal 2):
```bash
mosquitto_pub -h localhost -p 1883 -t "panicbutton/test" -m "Hola desde mosquitto!"
```

### 3. Probar con la API REST:

#### Verificar estado:
```bash
curl http://localhost:3000/mqtt/status
```

#### Publicar mensaje:
```bash
curl -X POST http://localhost:3000/mqtt/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "panicbutton/test/nestjs",
    "payload": "Mensaje desde NestJS!",
    "qos": 1,
    "retain": false
  }'
```

#### Suscribirse a un tópico:
```bash
curl -X POST http://localhost:3000/mqtt/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "panicbutton/test/+",
    "qos": 1
  }'
```

#### Publicar alerta de prueba:
```bash
curl -X POST http://localhost:3000/mqtt/test/publish-alert
```

#### Suscribirse a alertas:
```bash
curl -X POST http://localhost:3000/mqtt/test/subscribe-alerts
```

## Estructura de Tópicos de Prueba

```
panicbutton/
├── test/
│   ├── nestjs              # Mensajes de prueba desde NestJS
│   └── mosquitto           # Mensajes de prueba desde mosquitto
├── alerts/
│   ├── created             # Nuevas alertas
│   ├── test                # Alertas de prueba
│   └── resolved            # Alertas resueltas
├── user/
│   └── {userId}/alerts     # Alertas específicas por usuario
├── devices/
│   └── {deviceId}/status   # Estado de dispositivos
└── system/
    └── status              # Estado del sistema
```

## Comandos de Prueba Completa

1. **Terminal 1** - Suscriptor general:
```bash
mosquitto_sub -h localhost -p 1883 -t "panicbutton/#" -v
```

2. **Terminal 2** - Publicador de pruebas:
```bash
# Publicar mensaje simple
mosquitto_pub -h localhost -p 1883 -t "panicbutton/test/simple" -m "Test message"

# Publicar alerta simulada
mosquitto_pub -h localhost -p 1883 -t "panicbutton/alerts/test" -m '{"alertId":"test-123","userId":1,"priority":"HIGH","timestamp":"2025-01-15T10:30:00Z"}'

# Publicar estado de dispositivo
mosquitto_pub -h localhost -p 1883 -t "panicbutton/devices/device-001/status" -m '{"deviceId":"device-001","battery":85,"signal":"strong","online":true}'
```

3. **Terminal 3** - API Tests:
```bash
# Verificar conexión
curl http://localhost:3000/mqtt/status

# Publicar desde API
curl -X POST http://localhost:3000/mqtt/publish \
  -H "Content-Type: application/json" \
  -d '{"topic":"panicbutton/api/test","payload":"Hello from API","qos":1}'

# Publicar alerta de prueba
curl -X POST http://localhost:3000/mqtt/test/publish-alert
```

## Logs Esperados

En los logs de NestJS deberías ver:
```
[MqttService] ✅ Conectado exitosamente al broker MQTT: mqtt://localhost:1883
[MqttService] Suscrito automáticamente a tópicos del sistema
[MqttService] 📨 Mensaje recibido en panicbutton/test: Mensaje de prueba
[MqttController] Mensaje publicado exitosamente en panicbutton/api/test
```

## Troubleshooting

### Error de conexión:
- Verificar que Mosquitto esté ejecutándose en puerto 1883
- Verificar firewall/antivirus
- Revisar logs de Mosquitto con `mosquitto -v`

### No se reciben mensajes:
- Verificar suscripciones activas
- Revisar logs de NestJS
- Probar con mosquitto_sub directamente
