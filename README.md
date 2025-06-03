# 📱 Chat en Tiempo Real con Ionic, Angular y Supabase

Este proyecto es una aplicación de chat en tiempo real desarrollada con **Ionic Framework** y **Angular**, utilizando **Supabase** como backend para la autenticación, base de datos en tiempo real y almacenamiento de archivos.

## 🚀 Funcionalidades Principales

- Autenticación de usuarios con Supabase Auth
- Envío y recepción de mensajes en tiempo real
- Visualización de nombre, correo e imagen de perfil del emisor
- Compartir imágenes directamente desde la cámara del dispositivo (Camera API)
- Subida y descarga de archivos mediante Supabase Storage
- Envío de ubicación geográfica (Geolocation API)
- Integración con una API externa para obtener chistes
- Interfaz tipo WhatsApp: limpia, profesional y responsive
- Generación automática de avatares si el usuario no tiene foto de perfil

## 🧰 Tecnologías Utilizadas

- **Ionic Framework** (UI mobile)
- **Angular** (SPA frontend)
- **Supabase** (Base de datos, Auth y Storage)
- **Capacitor** (Acceso a cámara, ubicación y plugins nativos)
- **TypeScript** (Lógica del frontend)
- **HTML + SCSS** (Diseño responsivo)
- **Official Joke API** (Consumo externo de chistes)

## 🧱 Estructura de Base de Datos (Supabase)

### Tabla: `messages`
| Campo         | Tipo        | Descripción                            |
|---------------|-------------|----------------------------------------|
| id            | UUID        | ID único del mensaje (autogenerado)    |
| user_id       | TEXT        | ID del usuario que envió el mensaje    |
| user_email    | TEXT        | Correo electrónico del emisor          |
| user_photo    | TEXT        | URL de imagen de perfil del emisor     |
| content       | TEXT        | Contenido del mensaje                  |
| type          | TEXT        | Tipo (`text`, `image`, `file`, `location`) |
| timestamp     | TIMESTAMP   | Fecha y hora del mensaje               |

### Bucket en Supabase Storage
- **Nombre:** `chat-media`
- **Reglas:** Público (permite lectura anónima para mostrar imágenes/archivos)



