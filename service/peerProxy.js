const { WebSocketServer } = require('ws');

function quizScoreServer(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  let scores = [];

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.send(JSON.stringify({ type: 'update', scores }));
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message.type === 'newScore' && message.score !== undefined) {
          scores.push(message.score); 
          const updateMessage = JSON.stringify({ type: 'update', scores });
          socketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(updateMessage);
            }
          });
        }
      } catch (error) {
        console.error('Invalid message received:', error);
      }
    });
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (!client.isAlive) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}

module.exports = { quizScoreServer };