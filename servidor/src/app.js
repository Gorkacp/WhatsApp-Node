const express = require('express'); // Importa el módulo express
const http = require('http'); // Importa el módulo http
const socketIo = require('socket.io'); // Importa el módulo socket.io
const cors = require('cors'); // Importa el módulo cors
const path = require('path'); // Importa el módulo path

const app = express(); // Crea una instancia de express
const server = http.createServer(app); // Crea un servidor HTTP usando la instancia de express
const io = socketIo(server, {
    cors: {
        origin: "https://whatsapp-node-3.onrender.com", // Permite solicitudes desde este origen
        methods: ["GET", "POST"] // Permite estos métodos HTTP
    }
});

const port = process.env.PORT || 3000; // Define el puerto en el que el servidor escuchará

app.use(cors()); // Usa el middleware cors para permitir solicitudes de diferentes orígenes
app.use(express.json()); // Usa el middleware para parsear JSON

let users = []; // Array para almacenar los usuarios conectados

// Agregar una ruta para la raíz para evitar "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Servidor está funcionando correctamente');
});

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public'))); // Cambié el path para servir archivos desde 'public/'

// Maneja el evento de conexión de socket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Maneja el evento 'join' cuando un usuario se une al chat
    socket.on('join', (user) => {
        user.id = socket.id; // Asigna el ID del socket al usuario
        users.push(user); // Agrega el usuario al array de usuarios
        io.emit('updateUserList', users); // Emite la lista actualizada de usuarios a todos los clientes
        socket.broadcast.emit('userJoined', user); // Emite un mensaje a todos los clientes excepto al que se unió
        console.log(`Usuario se unió: ${user.name}`);
    });

    // Maneja el evento de desconexión de socket
    socket.on('disconnect', () => {
        const user = users.find(user => user.id === socket.id); // Encuentra el usuario que se desconectó
        if (user) {
            users = users.filter(user => user.id !== socket.id); // Elimina el usuario del array de usuarios
            io.emit('updateUserList', users); // Emite la lista actualizada de usuarios a todos los clientes
            socket.broadcast.emit('userLeft', user); // Emite un mensaje a todos los clientes excepto al que se desconectó
            console.log(`Usuario se fue: ${user.name}`);
        }
    });

    // Maneja el evento 'typing' cuando un usuario está escribiendo
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); // Emite un mensaje a todos los clientes excepto al que está escribiendo
    });

    // Maneja el evento 'stopTyping' cuando un usuario deja de escribir
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping'); // Emite un mensaje a todos los clientes excepto al que dejó de escribir
    });

    // Maneja el evento 'sendMessage' cuando un usuario envía un mensaje
    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message); // Emite el mensaje a todos los clientes
    });
});

// Inicia el servidor y escucha en el puerto definido
server.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});
