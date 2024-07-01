const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const genAI = new GoogleGenerativeAI("AIzaSyDj8VyreC4W4F7Jq-Toc8ULD3fhhxRDUYU");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('chat message', async (msg) => {
    const prompt = msg + ". Actua como profesor de programacion";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    io.emit('chat message', text);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(3000, () => {
  console.log('Escuchando en *:3000');
});
