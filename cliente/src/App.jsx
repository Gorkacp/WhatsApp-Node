import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

const socket = io('http://localhost:3000');

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        socket.on('updateUserList', (users) => {
            console.log('Connected users:', users);
        });

        socket.on('userJoined', (user) => {
            console.log(`${user.name} has joined the chat`);
        });

        socket.on('userLeft', (userId) => {
            console.log(`User with ID ${userId} has left the chat`);
        });

        socket.on('typing', (data) => {
            console.log(`${data.user} is typing...`);
        });

        socket.on('stopTyping', () => {
            console.log('User stopped typing');
        });

        socket.on('newMessage', (message) => {
            console.log('New message:', message);
        });
    }, []);

    return (
        <div>
            {user ? (
                <ChatRoom socket={socket} user={user} />
            ) : (
                <Login socket={socket} setUser={setUser} />
            )}
        </div>
    );
};

export default App;