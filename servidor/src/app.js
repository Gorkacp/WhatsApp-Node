const express = require('express'); // Importa el módulo express
const http = require('http'); // Importa el módulo http
const socketIo = require('socket.io'); // Importa el módulo socket.io
const cors = require('cors'); // Importa el módulo cors

const app = express(); // Crea una instancia de express
const server = http.createServer(app); // Crea un servidor HTTP usando la instancia de express

// Configura dinámicamente el origen de CORS según el entorno
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001"; // Si CLIENT_URL no está en las variables de entorno, usa localhost

// Configura Socket.io con CORS
const io = socketIo(server, {
    cors: {
        origin: CLIENT_URL, // Permite solicitudes solo desde el frontend
        methods: ["GET", "POST"] // Permite estos métodos HTTP
    }
});

const port = process.env.PORT || 3000; // Usa el puerto de la variable de entorno o 3000 como predeterminado

// Configura CORS en Express
app.use(cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
}));

app.use(express.json()); // Middleware para manejar JSON

let users = []; // Lista de usuarios conectados

// Manejar conexiones de sockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('join', (user) => {
        user.id = socket.id;
        users.push(user);
        io.emit('updateUserList', users);
        socket.broadcast.emit('userJoined', user);
        console.log(`Usuario se unió: ${user.name}`);
    });

    socket.on('disconnect', () => {
        const user = users.find(user => user.id === socket.id);
        if (user) {
            users = users.filter(user => user.id !== socket.id);
            io.emit('updateUserList', users);
            socket.broadcast.emit('userLeft', user);
            console.log(`Usuario se fue: ${user.name}`);
        }
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message);
    });
});

// Inicia el servidor en el puerto especificado
server.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});
