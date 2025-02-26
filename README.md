# Mi Proyecto

Este proyecto está dividido en dos partes: **cliente** y **servidor**.

## Estructura del Proyecto

```
mi-proyecto
├── cliente
│   ├── public
│   │   └── images
│   │       ├── avatars      # Carpeta img de los avatares
│   │       └── image        # Resto de imagenes 
│   ├── src
│   │   ├── App.jsx          # Componente principal de la aplicación React
│   │   ├── index.jsx        # Punto de entrada de la aplicación React
│   │   └── components
│   │       ├── ChatRoom.jsx # Componente de la sala de chat
│   │       ├── ChatRoom.css # Estilo página chat
│   │       ├── Login.jsx    # Componente de la sala de chat
│   │       └── Login.css    # Estilo página login
│   ├── package.json         # Configuración de npm para el cliente
│   └── README.md            # Documentación del cliente
├── servidor
│   ├── src
│   │   └── app.js           # Punto de entrada de la aplicación del servidor
│   │ 
│   ├── package.json         # Configuración de npm para el servidor
│   └── README.md            # Documentación del servidor
└── README.md                # Documentación general del proyecto
```

## Descripción

- **Cliente**: Esta parte del proyecto está construida con React y contiene todos los componentes necesarios para la interfaz de usuario. El archivo `App.jsx` es el componente principal que se encarga de renderizar la aplicación, mientras que `ChatRoom.jsx` es el componente de la sala de chat. `Login.jsx` es un componente para iniciar sesion dentro de  `App`.

- **Servidor**: Esta parte del proyecto maneja la lógica del backend. El archivo `app.js` configura el servidor y define las rutas y middleware necesarios.

## Instalación

Para instalar las dependencias del cliente y del servidor, navega a cada carpeta y ejecuta:

```bash
npm install
```

## Ejecución

Para ejecutar el cliente y el servidor, utiliza los siguientes comandos en sus respectivas carpetas:

- Para el cliente:
```bash
npm start
```

- Para el servidor:
```bash
node src/app.js
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request.