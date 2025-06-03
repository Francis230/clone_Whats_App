# 📱 Chat en Tiempo Real con Ionic, Angular y Supabase
---
- **Desarrollador:**
- Francis Aconda

---

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

---
### Instala las dependencias:
- **npm install**
---

### Agrega las variables de entorno (en src/environments/environment.ts):
export const environment = {
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'public-anon-key'
};

---
### Estructura del proyecto:


![image](https://github.com/user-attachments/assets/ba336264-327f-4f6f-8ab1-7a4d71ddbf26)


---

### Inclusión de firebase y Supabse en el archivo “enviroment”:


![image](https://github.com/user-attachments/assets/0769cf7d-123d-4e98-bf7c-ab1f072c67e1)

---
### Generación de la tabla en supabase de los mensajes:

![image](https://github.com/user-attachments/assets/2411267a-030c-4d52-9b93-8ee5b3636bb3)


---

### Generación del bucket para almacenamiento de las imágenes y de los archivos:


![image](https://github.com/user-attachments/assets/1e137bdb-4dc1-4706-bcf5-aedf394203a4)

---

### La autenticación de Firebase de cada correo y del registro que se almacena aquí:


![image](https://github.com/user-attachments/assets/4c9f2a7a-0283-454a-86c9-8b1d9fd499cb)

---

## Verificacion de las pantallas:

- **Parntalla de Login:**

![image](https://github.com/user-attachments/assets/713aec2e-451e-47dc-b5ca-62f93ed193cc)

- **Parntalla de Registro:**

![image](https://github.com/user-attachments/assets/54b3e19e-9df7-42fc-8afc-b5ae7110cef0)


- **Parntalla en general del Chat:**

![image](https://github.com/user-attachments/assets/298ee196-a07c-45d8-91a6-5a1162fb8067)


---






