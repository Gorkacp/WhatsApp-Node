import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Image, Card } from 'react-bootstrap';
import './Login.css'; // Importa el archivo CSS para estilos personalizados

// Lista de avatares disponibles
const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png'];

const Login = ({ socket, setUser }) => {
    // Estados para almacenar el nombre, estado y avatar del usuario
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [avatar, setAvatar] = useState(avatars[0]);

    // Función que maneja el inicio de sesión
    const handleLogin = () => {
        const user = { id: socket.id, name, status, avatar }; // Crea un objeto de usuario con los datos ingresados
        socket.emit('join', user); // Emite un evento 'join' al servidor con los datos del usuario
        setUser(user); // Establece el usuario en el estado de la aplicación
    };

    return (
        <Container className="login-container">
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)} // Actualiza el estado 'name' cuando el usuario escribe
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu estado"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)} // Actualiza el estado 'status' cuando el usuario escribe
                            />
                        </Form.Group>
                        <Form.Group controlId="formAvatar">
                            <Form.Label>Avatar</Form.Label>
                            <Row>
                                {avatars.map((avatarItem) => (
                                    <Col key={avatarItem} xs={4} className="text-center">
                                        <Image
                                            src={`/avatars/${avatarItem}`} // Muestra la imagen del avatar
                                            roundedCircle
                                            width="60"
                                            height="60"
                                            className={`avatar-image ${avatar === avatarItem ? 'selected' : ''}`} // Aplica la clase 'selected' si el avatar está seleccionado
                                            onClick={() => setAvatar(avatarItem)} // Actualiza el estado 'avatar' cuando el usuario selecciona un avatar
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                        <Button variant="primary" onClick={handleLogin} className="w-100 mt-3">
                            Iniciar Sesión
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;