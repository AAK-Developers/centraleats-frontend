/**
 * Mock Socket.io Server for testing Centraleats Frontend integration.
 * Run this server locally to simulate backend socket events.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir cualquier origen para desarrollo local
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

io.on('connection', (socket) => {
  console.log(`🔌 [Mock Server] Cliente conectado: ${socket.id}`);

  // Simular un evento de actualización de pedido cada 10 segundos
  const intervalId = setInterval(() => {
    console.log('📡 [Mock Server] Emitiendo evento "orderUpdated" a todos los clientes');
    io.emit('orderUpdated', {
      timestamp: Date.now(),
      message: 'Un pedido ha cambiado de estado'
    });
  }, 10000);

  socket.on('disconnect', () => {
    console.log(`🔌 [Mock Server] Cliente desconectado: ${socket.id}`);
    clearInterval(intervalId);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 [Mock Server] Servidor de Socket.io corriendo en http://localhost:${PORT}`);
  console.log(`💡 Para probar en el frontend, asegúrate de que VITE_API_BASE_URL en el .env apunte a http://localhost:${PORT}`);
});
