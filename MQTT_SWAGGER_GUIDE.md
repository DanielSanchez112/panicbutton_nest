# Guía de Endpoints MQTT para Swagger

## 🚀 Endpoints Disponibles

### 1. **GET /mqtt/status**
Verificar el estado de conexión del cliente MQTT.

**Respuesta esperada:**
```json
{
  "connected": true,
  "brokerUrl": "mqtt://localhost:1883",
  "clientId": "panicbutton-nest-client",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 2. **POST /mqtt/publish**
Publicar un mensaje de texto plano en cualquier tópico.

**Body de ejemplo:**
```json
{
  "topic": "panicbutton/1/alerts/test",
  "payload": "Mensaje de prueba simple",
  "qos": 1,
  "retain": false
}
```

---

### 3. **POST /mqtt/publish-location-json** ⭐ **NUEVO**
Publicar un mensaje JSON con latitud y longitud.

**Body de ejemplo:**
```json
{
  "topic": "panicbutton/1/alerts/test",
  "latitude": -34.6037,
  "longitude": -58.3816,
  "message": "Ubicación de prueba desde Swagger",
  "accuracy": 10,
  "qos": 1,
  "retain": false
}
```

**Payload JSON generado automáticamente:**
```json
{
  "latitude": -34.6037,
  "longitude": -58.3816,
  "message": "Ubicación de prueba desde Swagger",
  "accuracy": 10,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "swagger_json_test"
}
```

---

### 4. **POST /mqtt/subscribe**
Suscribirse a un tópico específico.

**Body de ejemplo:**
```json
{
  "topic": "panicbutton/+/alerts/+",
  "qos": 1
}
```

**Ejemplos de tópicos útiles:**
- `panicbutton/1/alerts/test` - Alertas de prueba del usuario 1
- `panicbutton/+/alerts/+` - Todas las alertas de todos los usuarios
- `panicbutton/+/location` - Ubicaciones de todos los usuarios
- `panicbutton/1/+` - Todos los mensajes del usuario 1

---

### 5. **POST /mqtt/unsubscribe/{topic}**
Desuscribirse de un tópico.

**Ejemplo:** `POST /mqtt/unsubscribe/panicbutton/1/alerts/test`

---

### 6. **POST /mqtt/test/publish-alert**
Publicar una alerta completa con estructura predefinida.

**Body de ejemplo:**
```json
{
  "user_id": 1,
  "latitude": -34.6037,
  "longitude": -58.3816,
  "accuracy": 10,
  "alert_type": "panic_button",
  "priority": "HIGH"
}
```

**Tópico generado:** `panicbutton/{user_id}/alerts/test`

---

### 7. **POST /mqtt/test/subscribe-alerts**
Suscribirse automáticamente a todos los tópicos de alertas importantes.

**Tópicos incluidos:**
- `panicbutton/+/alerts/+`
- `panicbutton/+/alerts/test`
- `panicbutton/system/+`
- `panicbutton/devices/+/status`

---

### 8. **POST /mqtt/test/subscribe-user-alerts/{user_id}**
Suscribirse a todos los tópicos de un usuario específico.

**Ejemplo:** `POST /mqtt/test/subscribe-user-alerts/1`

**Tópicos incluidos:**
- `panicbutton/1/alerts/+`
- `panicbutton/1/alerts/test`
- `panicbutton/1/location`
- `panicbutton/1/status`

---

### 9. **POST /mqtt/test/publish-location**
Publicar solo la ubicación de un usuario.

**Body de ejemplo:**
```json
{
  "user_id": 1,
  "latitude": -34.6037,
  "longitude": -58.3816,
  "accuracy": 10
}
```

**Tópico generado:** `panicbutton/{user_id}/location`

---

## 🧪 Flujo de Prueba Recomendado

### 1. **Verificar Conexión**
```
GET /mqtt/status
```

### 2. **Suscribirse a Alertas**
```
POST /mqtt/test/subscribe-alerts
```

### 3. **Publicar Mensaje JSON con Ubicación**
```
POST /mqtt/publish-location-json
Body:
{
  "topic": "panicbutton/1/alerts/test",
  "latitude": -34.6037,
  "longitude": -58.3816,
  "message": "Prueba desde Swagger",
  "qos": 1
}
```

### 4. **Verificar en Logs**
Revisa los logs de NestJS para ver:
- ✅ Conexión exitosa al broker
- 📡 Suscripción a tópicos
- 📨 Mensajes recibidos
- 🚨 Procesamiento de alertas

---

## 📋 Estructura de Tópicos

```
panicbutton/
├── {user_id}/
│   ├── alerts/
│   │   ├── test        # Alertas de prueba
│   │   ├── panic       # Alertas reales de pánico
│   │   └── resolved    # Alertas resueltas
│   ├── location        # Ubicación en tiempo real
│   └── status          # Estado del usuario
├── system/
│   ├── status          # Estado del sistema
│   └── maintenance     # Mantenimiento
└── devices/
    └── {device_id}/
        └── status      # Estado de dispositivos IoT
```

---

## 🔍 Monitoreo Externo

Para ver todos los mensajes desde terminal:

```bash
# Suscribirse a todos los mensajes
mosquitto_sub -h localhost -p 1883 -t "panicbutton/#" -v

# Solo alertas de prueba
mosquitto_sub -h localhost -p 1883 -t "panicbutton/+/alerts/test" -v

# Solo ubicaciones
mosquitto_sub -h localhost -p 1883 -t "panicbutton/+/location" -v
```

**Publicar desde terminal:**
```bash
# Publicar mensaje JSON
mosquitto_pub -h localhost -p 1883 -t "panicbutton/1/alerts/test" -m '{"latitude":-34.6037,"longitude":-58.3816,"message":"Desde terminal"}'
```
