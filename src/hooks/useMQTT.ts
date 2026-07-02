import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

export interface MQTTMessage {
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  dish?: {
    id: string;
    name: string;
    price: number;
    restaurantId: string;
    category?: string;
  };
  dishId?: string;
  restaurantId?: string;
}

export const useMQTT = (topic: string) => {
  const [lastMessage, setLastMessage] = useState<MQTTMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conexión sobre WebSockets. Usamos el puerto seguro de HiveMQ (8884)
    // Es vital usar 'wss' (WebSocket Secure) porque si la web corre bajo HTTPS,
    // el navegador bloquea conexiones no seguras (ws).
    const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';

    console.log('📡 Iniciando conexión MQTT a:', brokerUrl);
    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
      console.log(`📡 Conectado a MQTT. Suscribiéndose al topic: ${topic}`);
      setIsConnected(true);
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('❌ Error de suscripción MQTT:', err);
        }
      });
    });

    client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const data = JSON.parse(message.toString()) as MQTTMessage;
          console.log('📡 Mensaje MQTT recibido:', data);
          setLastMessage(data);
        } catch (e) {
          console.error('❌ Error parseando mensaje MQTT:', e);
        }
      }
    });

    client.on('error', (err) => {
      console.error('❌ Error del cliente MQTT:', err);
    });

    client.on('close', () => {
      console.log('📡 Conexión MQTT cerrada');
      setIsConnected(false);
    });

    return () => {
      console.log('📡 Desconectando cliente MQTT');
      client.end();
    };
  }, [topic]);

  return { lastMessage, isConnected };
};
