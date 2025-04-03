const { WebSocketServer } = require('ws');

function quizScoreServer(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  let scores = []; 

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.send(JSON.stringify({ type: 'update', scores }));
    socketServer.on("connection", (socket) => {
        socket.on("message", (data) => {
          try {
            const message = JSON.parse(data);
            if (message.type === "sharedScore") {
              socketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ type: "sharedScore", score: message.score }));
                }
              });
            }
          } catch (error) {
            console.error("Invalid WebSocket message:", error);
          }
        });
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