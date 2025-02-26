const express = require('express'); // Importa el módulo express
const http = require('http'); // Importa el módulo http
const socketIo = require('socket.io'); // Importa el módulo socket.io
const cors = require('cors'); // Importa el módulo cors
const path = require('path'); // Importa el módulo path

const app = express(); // Crea una instancia de express
const server = http.createServer(app); // Crea un servidor HTTP usando la instancia de express
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001", // Cambia esto si el frontend está en otro dominio
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000; // Define el puerto en el que el servidor escuchará

app.use(cors()); // Usa el middleware cors para permitir solicitudes de diferentes orígenes
app.use(express.json()); // Usa el middleware para parsear JSON

let users = []; // Array para almacenar los usuarios conectados

// Sirve los archivos estáticos de React
app.use(express.static(path.join(__dirname, '../cliente/build'))); // Apunta a la carpeta build de React

// Ruta que maneja el acceso al login y otras rutas de tu aplicación React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../cliente/build', 'index.html')); // Sirve index.html para cualquier ruta
});

// Maneja el evento de conexión de socket
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

// Inicia el servidor
server.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});
