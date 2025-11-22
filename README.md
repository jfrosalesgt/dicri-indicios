# DICRI Indicios - Frontend

Sistema web para el Ministerio Público de Guatemala - Servicios Administrativos DICRI Indicios.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite 7** - Build tool y dev server ultrarrápido
- **React Router DOM** - Navegación y routing
- **Redux Toolkit** + **React-Redux** - Manejo global de estado (autenticación, sesión)
- **Material UI (MUI)** - Componentes UI y sistema de diseño
- **Axios** - Cliente HTTP para consumir APIs
- **JWT** - Autenticación mediante tokens
- **Docker** - Contenerización
- **Nginx** - Servidor web para producción

## 📁 Arquitectura del Proyecto

El proyecto sigue los principios de **Clean Architecture** con separación de responsabilidades:

```
src/
├── domain/                 # Capa de dominio (entidades e interfaces)
│   ├── entities/          # Modelos de datos
│   └── repositories/      # Interfaces de repositorios
├── application/           # Casos de uso
│   └── use-cases/
├── infrastructure/        # Implementaciones técnicas
│   ├── config/           # Configuración
│   ├── http/             # Cliente HTTP (Axios)
│   └── repositories/     # Implementaciones de repositorios
└── presentation/          # Capa de presentación (UI)
    ├── components/       # Componentes reutilizables
    ├── pages/           # Páginas principales
    ├── layouts/         # Layouts/Plantillas
    ├── context/         # Context API de React
    ├── hooks/           # Custom hooks
    └── routes/          # Configuración de rutas
```

## 🔧 Configuración del Entorno

### Variables de Entorno

Crea los siguientes archivos en la raíz del proyecto:

**`.env.development`** (Para desarrollo):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=development
```

**`.env`** (Para producción):
```env
VITE_API_BASE_URL=http://localhost:3030/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=production
```

## 📦 Instalación

### Desarrollo Local

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## 🐳 Docker

### Construir y ejecutar con Docker Compose

**Desarrollo (Puerto 8080):**
```bash
docker-compose up -d frontend-dev
```

**Producción (Puerto 8081):**
```bash
docker-compose up -d frontend-prod
```

### Construir imagen Docker manualmente

```bash
docker build -t dicri-frontend:latest --build-arg VITE_API_BASE_URL=http://localhost:3030/api .
```

### Ejecutar contenedor

```bash
docker run -d -p 8080:80 --name dicri-frontend dicri-frontend:latest
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

### Endpoints de Autenticación

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin",
  "clave": "admin123"
}
```

#### Verificar Token
```bash
GET /api/auth/verify
Authorization: Bearer {token}
```

#### Cambiar Contraseña
```bash
POST /api/auth/change-password
Authorization: Bearer {token}
```

#### Obtener Usuario Actual
```bash
GET /api/auth/me
Authorization: Bearer {token}
```

## 👥 Gestión de Usuarios

### Endpoints de Usuarios

- `GET /api/users` - Listar usuarios
- `GET /api/users/{id}` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

## 🎨 Características de la UI

### Login Page
- Diseño inspirado en el Ministerio Público de Guatemala
- Campos: CUI y Contraseña
- Enlaces para recuperación de contraseña
- Diseño responsive y moderno

### Dashboard Layout
- Header con logo MP y badges conmemorativos (1974, 1572)
- Sidebar desplegable con navegación
- Menús con submenús expandibles
- Diseño responsive adaptado a móviles

### Páginas Implementadas
- **Login** - Autenticación de usuarios
- **Dashboard Home** - Página principal con servicios
- **Usuarios** - Lista de usuarios del sistema
- **Detalle de Usuario** - Vista detallada de un usuario

## 🔒 Seguridad

- **JWT Authentication** - Tokens seguros con expiración
- **Protected Routes** - Rutas protegidas por autenticación
- **HTTP Interceptors** - Manejo automático de tokens y errores
- **Token Refresh** - Verificación automática de expiración
- **Auto Logout** - Cierre de sesión en caso de token inválido

## 🛠️ Servicios HTTP

El proyecto incluye un cliente HTTP reutilizable (`HttpClient`) con:

- ✅ Interceptores de request/response
- ✅ Manejo automático de tokens JWT
- ✅ Gestión de errores centralizada
- ✅ Métodos HTTP: GET, POST, PUT, PATCH, DELETE
- ✅ Configuración de timeout
- ✅ Headers personalizables

## 📱 Responsive Design

El sistema está optimizado para:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px)
- 📱 Tablet (768px)
- 📱 Mobile (320px+)

## 🌐 Puertos

- **Desarrollo Local**: `5173`
- **Preview Local**: `4173`
- **Docker Dev**: `8080`
- **Docker Prod**: `8081`

## 📝 Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

## 👨‍💻 Desarrollo

Para agregar nuevas páginas:

1. Crear el componente en `src/presentation/pages/`
2. Agregar la ruta en `src/App.tsx`
3. Actualizar el sidebar en `DashboardLayout.tsx` si es necesario

Para agregar nuevos servicios API:

1. Definir interfaces en `src/domain/entities/`
2. Crear repositorio en `src/domain/repositories/`
3. Implementar en `src/infrastructure/repositories/`
4. Usar en componentes a través de los repositorios

## 📄 Licencia

Ministerio Público de Guatemala - Todos los derechos reservados © 2025

## 🆘 Soporte

Para consultas o soporte técnico, contactar a:
- Email: siamp@mp.gob.gt
