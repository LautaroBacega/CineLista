# 🎬 CineLista

<div align="center">
  <img src="client/public/logo.png" alt="CineLista Logo" width="120" height="120">
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://mongodb.com/)
  [![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue.svg)](https://tailwindcss.com/)
</div>

## 📖 Descripción

**CineLista** es una aplicación web full-stack que permite a los usuarios descubrir, organizar y compartir sus películas favoritas. Con una interfaz cinematográfica moderna y funcionalidades avanzadas, los usuarios pueden crear listas personalizadas, explorar un extenso catálogo de películas y compartir sus descubrimientos con la comunidad.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Completo**
- **Registro e inicio de sesión** con validación de formularios
- **Autenticación con Google** usando Firebase Auth
- **Recuperación de contraseña** con envío de emails
- **Tokens JWT** con refresh automático (15 min access + 7 días refresh)
- **Sesiones persistentes** con localStorage
- **Middleware de verificación** para rutas protegidas

### 🎭 **Gestión de Películas**
- **Catálogo extenso** con más de 10,000 películas (TMDB API)
- **Búsqueda inteligente** con autocompletado en tiempo real
- **Detalles completos** de películas (sinopsis, reparto, calificaciones)
- **Películas trending** basadas en búsquedas populares
- **Información técnica** (presupuesto, recaudación, idiomas)

### 📝 **Sistema de Listas Personalizadas**
- **Listas por defecto**: Favoritas, Aún no he visto, Ya vistas
- **Listas personalizadas** con nombre y descripción
- **Listas públicas/privadas** con control de visibilidad
- **Compartir listas** con enlaces únicos
- **Gestión completa** (crear, editar, eliminar, agregar/quitar películas)

### 🎨 **Interfaz de Usuario Cinematográfica**
- **Diseño responsive** optimizado para todos los dispositivos
- **Tema cinematográfico** con paleta de colores profesional
- **Animaciones fluidas** y transiciones suaves
- **Componentes reutilizables** con sistema de diseño consistente
- **Modales interactivos** para detalles y confirmaciones

### 🚀 **Funcionalidades Avanzadas**
- **Acciones rápidas** en tarjetas de películas (hover effects)
- **Búsqueda con debounce** para optimizar requests
- **Notificaciones de éxito** para acciones del usuario
- **Manejo de errores** robusto con mensajes informativos
- **Carga lazy** y optimización de imágenes

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** - Biblioteca de UI con hooks modernos
- **Vite** - Build tool rápido y moderno
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía moderna
- **Firebase Auth** - Autenticación con Google

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Nodemailer** - Envío de emails
- **Bcrypt** - Hashing de contraseñas
- **CORS** - Configuración de políticas de origen

### **APIs Externas**
- **TMDB API** - Base de datos de películas
- **Appwrite** - Backend-as-a-Service para trending
- **Brevo (Sendinblue)** - Servicio de email

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones
- **Render** - Deployment y hosting

## 📁 Estructura del Proyecto

\`\`\`
MovieApp-Login/
├── api/                          # Backend (Node.js + Express)
│   ├── controllers/              # Controladores de rutas
│   │   ├── auth.controller.js    # Autenticación y usuarios
│   │   ├── list.controller.js    # Gestión de listas
│   │   └── user.controller.js    # Perfil de usuario
│   ├── models/                   # Modelos de MongoDB
│   │   ├── user.model.js         # Esquema de usuarios
│   │   └── list.model.js         # Esquema de listas
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.route.js         # Rutas de autenticación
│   │   ├── list.route.js         # Rutas de listas
│   │   └── user.route.js         # Rutas de usuario
│   ├── services/                 # Servicios externos
│   │   └── email.service.js      # Servicio de emails
│   ├── utils/                    # Utilidades
│   │   ├── error.js              # Manejo de errores
│   │   ├── tokenUtils.js         # Utilidades JWT
│   │   └── verifyUser.js         # Middleware de verificación
│   └── index.js                  # Servidor principal
│
├── client/                       # Frontend (React + Vite)
│   ├── public/                   # Archivos estáticos
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── Header.jsx        # Navegación principal
│   │   │   ├── MovieCard.jsx     # Tarjeta de película
│   │   │   ├── MovieModal.jsx    # Modal de detalles
│   │   │   ├── UserLists.jsx     # Gestión de listas
│   │   │   ├── Search.jsx        # Búsqueda con autocompletado
│   │   │   └── ...               # Otros componentes
│   │   ├── pages/                # Páginas principales
│   │   │   ├── Home.jsx          # Página principal
│   │   │   ├── Profile.jsx       # Perfil de usuario
│   │   │   ├── SignIn.jsx        # Inicio de sesión
│   │   │   ├── SignUp.jsx        # Registro
│   │   │   └── SharedList.jsx    # Lista compartida
│   │   ├── context/              # Context API
│   │   │   └── UserContext.jsx   # Estado global de usuario
│   │   ├── hooks/                # Custom hooks
│   │   │   └── useUser.jsx       # Hook de usuario
│   │   ├── utils/                # Utilidades frontend
│   │   │   └── apiInterceptor.js # Interceptor para refresh tokens
│   │   ├── App.jsx               # Componente principal
│   │   └── main.jsx              # Punto de entrada
│   ├── tailwind.config.js        # Configuración de Tailwind
│   └── vite.config.js            # Configuración de Vite
│
├── package.json                  # Dependencias del proyecto
└── README.md                     # Documentación
\`\`\`

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18.x o superior
- MongoDB 6.0 o superior
- Cuenta en TMDB para API key
- Cuenta en Brevo para envío de emails
- Cuenta en Firebase para Google Auth

### **1. Clonar el Repositorio**
\`\`\`bash
git clone https://github.com/tu-usuario/cinelista.git
cd cinelista
\`\`\`

### **2. Configurar Backend**
\`\`\`bash
cd api
npm install
\`\`\`

Crear archivo `.env` en la carpeta `api/`:
\`\`\`env
# Base de datos
MONGO=mongodb://localhost:27017/cinelista

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Email (Brevo)
SMTP_USER=tu_email_brevo
SMTP_PASSWORD=tu_password_brevo
SENDER_EMAIL=tu_email_sender

# URLs
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
\`\`\`

### **3. Configurar Frontend**
\`\`\`bash
cd client
npm install
\`\`\`

Crear archivo `.env` en la carpeta `client/`:
\`\`\`env
# TMDB API
VITE_TMDB_API_KEY=tu_tmdb_api_key

# Firebase
VITE_FIREBASE_API_KEY=tu_firebase_api_key

# Appwrite
VITE_APPWRITE_PROJECT_ID=tu_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=tu_database_id
VITE_APPWRITE_COLLECTION_ID=tu_collection_id
\`\`\`

### **4. Ejecutar la Aplicación**

**Backend:**
\`\`\`bash
cd api
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd client
npm run dev
\`\`\`

La aplicación estará disponible en:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 🔧 APIs y Servicios

### **TMDB API**
- **Búsqueda de películas**: `/search/movie`
- **Detalles de película**: `/movie/{id}`
- **Créditos**: `/movie/{id}/credits`
- **Películas populares**: `/discover/movie`

### **Endpoints Backend**

#### **Autenticación (`/api/auth`)**
\`\`\`javascript
POST /signup              // Registro de usuario
POST /signin              // Inicio de sesión
POST /google              // Autenticación con Google
GET  /signout             // Cerrar sesión
POST /refresh-token       // Renovar access token
POST /request-password-reset  // Solicitar reset de contraseña
POST /reset-password      // Restablecer contraseña
\`\`\`

#### **Listas (`/api/lists`)**
\`\`\`javascript
GET    /                  // Obtener listas del usuario
POST   /                  // Crear nueva lista
GET    /:id               // Obtener detalles de lista
PUT    /:id               // Actualizar lista
DELETE /:id               // Eliminar lista
POST   /:id/movies        // Agregar película a lista
DELETE /:id/movies/:movieId  // Quitar película de lista
POST   /:id/share         // Generar enlace de compartir
GET    /shared/:token     // Obtener lista compartida
\`\`\`

#### **Usuario (`/api/user`)**
\`\`\`javascript
POST /update/:id          // Actualizar perfil
DELETE /delete/:id        // Eliminar cuenta
\`\`\`

## 🎯 Funcionalidades Detalladas

### **Sistema de Autenticación**
1. **Registro**: Validación de email, hash de contraseña, creación de listas por defecto
2. **Login**: Verificación de credenciales, generación de tokens JWT
3. **Google Auth**: Integración con Firebase, creación automática de usuario
4. **Refresh Tokens**: Renovación automática de access tokens
5. **Reset Password**: Envío de email con token seguro, validación temporal

### **Gestión de Listas**
1. **Listas por Defecto**: Creación automática al registrarse
2. **CRUD Completo**: Crear, leer, actualizar, eliminar listas
3. **Gestión de Películas**: Agregar/quitar películas con validación
4. **Compartir**: Generación de tokens únicos para acceso público
5. **Permisos**: Control de acceso basado en usuario propietario

### **Búsqueda y Descubrimiento**
1. **Autocompletado**: Sugerencias en tiempo real con debounce
2. **Trending**: Tracking de búsquedas populares con Appwrite
3. **Filtros**: Búsqueda por título, año, género
4. **Detalles**: Información completa de TMDB API

## 🔒 Seguridad

- **Hashing de contraseñas** con bcrypt (salt rounds: 10)
- **Tokens JWT** con expiración corta (15 minutos)
- **Refresh tokens** seguros con expiración larga (7 días)
- **Validación de entrada** en frontend y backend
- **CORS configurado** para dominios específicos
- **Rate limiting** implícito con debounce
- **Sanitización** de datos de usuario

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid System**: CSS Grid y Flexbox
- **Touch Friendly**: Botones y áreas de toque optimizadas
- **Performance**: Lazy loading y optimización de imágenes

## 🚀 Deployment

### **Backend (Render)**
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Comando de build: `npm install`
4. Comando de start: `npm start`

### **Frontend (Vercel/Netlify)**
1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Output directory: `dist`
4. Variables de entorno de producción

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: https://github.com/LautaroBacega
- LinkedIn: https://www.linkedin.com/in/lautaro-bacega/
- Email: lautibacega@gmail.com
