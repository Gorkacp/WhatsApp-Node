import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Image } from 'react-bootstrap';
import './ChatRoom.css'; // Importa el archivo CSS para estilos personalizados

const ChatRoom = ({ socket, user }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState('');
    const [chats, setChats] = useState([]); // Estado para almacenar la lista de chats
    const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios conectados

    useEffect(() => {
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('typing', (data) => {
            setTyping(`${data.user} está escribiendo...`);
        });

        socket.on('stopTyping', () => {
            setTyping('');
        });

        socket.on('updateUserList', (users) => {
            setUsers(users);
        });

        socket.on('userJoined', (user) => {
            console.log('User joined:', user);
        });

        socket.on('userLeft', (user) => {
            console.log('User left:', user);
        });

        // Simulación de carga de chats del usuario
        setChats([
            { id: 1, name: 'Chat 1', lastMessage: 'Último mensaje del Chat 1' },
            { id: 2, name: 'Chat 2', lastMessage: 'Último mensaje del Chat 2' },
            { id: 3, name: 'Chat 3', lastMessage: 'Último mensaje del Chat 3' },
        ]);

        return () => {
            socket.off('newMessage');
            socket.off('typing');
            socket.off('stopTyping');
            socket.off('updateUserList');
            socket.off('userJoined');
            socket.off('userLeft');
        };
    }, [socket]);

    const handleSendMessage = () => {
        const newMessage = { user: user.name, text: message, avatar: user.avatar };
        socket.emit('sendMessage', newMessage);
        setMessage('');
        socket.emit('stopTyping');
    };

    return (
        <Container fluid>
            <Row>
                <Col md={4} className="chat-list">
                    <h4 className="text-center my-4">Chats</h4>
                    <ListGroup>
                        {chats.map((chat) => (
                            <ListGroup.Item key={chat.id}>
                                <strong>{chat.name}</strong>
                                <p>{chat.lastMessage}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <div className="user-profile">
                        <Image src={`/avatars/${user.avatar}`} roundedCircle width="50" height="50" />
                        <p>{user.name}</p>
                    </div>
                </Col>
                <Col md={8}>
                    <h2 className="text-center my-4">Chat General</h2>
                    <ListGroup className="mb-3 chat-messages">
                        {messages.map((msg, index) => (
                            <ListGroup.Item key={index} className={msg.user === user.name ? 'message-sent' : 'message-received'}>
                                <Image src={`/avatars/${msg.avatar}`} roundedCircle width="30" height="30" className="mr-2" />
                                <strong>{msg.user}:</strong> {msg.text}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {typing && <p className="text-muted">{typing}</p>}
                    <Form>
                        <Form.Group controlId="messageInput">
                            <Form.Control
                                type="text"
                                placeholder="Escribe un mensaje..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={() => socket.emit('typing', { user: user.name })}
                                onBlur={() => socket.emit('stopTyping')}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSendMessage} className="w-100">
                            Enviar
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ChatRoom;