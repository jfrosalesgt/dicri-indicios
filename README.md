# 🏛️ DICRI Indicios - Frontend

Sistema web de **Prueba Técnica** Dirección de Investigación Criminalística (DICRI).

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev)
[![Material-UI](https://img.shields.io/badge/MUI-5.15-007FFF.svg)](https://mui.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

---

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura-del-proyecto)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Optimizaciones de Performance](#-optimizaciones-de-performance)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### 🔐 Gestión de Autenticación
- Login con JWT tokens
- Persistencia de sesión con Redux Persist
- Auto-logout por token expirado
- Cambio de contraseña obligatorio
- Verificación de roles y permisos
- Gestión de perfiles de usuario
- React Hook Form para validación optimizada

### 📁 Gestión de Expedientes (DICRI)
- **Estados**: `EN_REGISTRO` → `PENDIENTE_REVISION` → `APROBADO/RECHAZADO`
- CRUD completo de expedientes
- Filtros avanzados (estado, fiscalía, usuario, activo)
- Flujo de revisión y aprobación
- Trazabilidad de cambios
- Justificación de rechazos
- Validación en tiempo real

### 🔍 Gestión de Escenas del Crimen
- Registro de múltiples escenas por expediente
- Geolocalización y dirección
- Fecha y hora de inicio/fin de procesamiento
- Estado activo/inactivo
- Relación 1:N con expedientes

### 🧪 Gestión de Indicios
- CRUD completo de indicios
- Clasificación por tipo (arma, huella, documento, etc.)
- Estados: `RECOLECTADO` → `EN_CUSTODIA` → `EN_ANALISIS` → `ANALIZADO` → `DEVUELTO`
- Cadena de custodia
- Ubicación específica y coordenadas
- Fotos y evidencias (próximamente)
- Relación con escenas y expedientes

### 📊 Reportes y Estadísticas
- Dashboard con indicadores clave
- Distribución por fiscalía
- Estados de expedientes en tiempo real
- Total de indicios recolectados
- Gráficas y visualizaciones
- Búsqueda optimizada con debounce

### 🗂️ Catálogos Administrativos
- Fiscalías
- Tipos de Indicio
- Roles y Permisos
- Perfiles de Usuario
- Usuarios del sistema

### 🎨 UI/UX Moderna
- Diseño responsive (móvil, tablet, desktop)
- Material Design (MUI)
- Dark/Light mode (próximamente)
- Lazy loading de componentes
- Hot reload en desarrollo
- Optimización de performance
- React Hook Form en todos los formularios

---

## 🚀 Tecnologías

### Frontend Core
- **React 18.3** - Biblioteca UI con Concurrent Features
- **TypeScript 5.9** - Tipado estático y type safety
- **Vite 7.2** - Build tool ultrarrápido con HMR
- **React Router 7.9** - Routing con Suspense y lazy loading
- **React Hook Form 7.x** - Gestión de formularios optimizada

### Estado y Datos
- **Redux Toolkit 2.2** - Gestión de estado global
- **React Redux 9.1** - Bindings para React
- **Redux Persist 6.0** - Persistencia de estado en localStorage
- **Axios 1.13** - Cliente HTTP con interceptors

### UI y Estilos
- **Material-UI 5.15** - Sistema de diseño y componentes
- **@mui/icons-material** - Iconografía completa
- **@emotion/react & styled** - CSS-in-JS
- **Custom CSS** - Estilos específicos

### Seguridad
- **JWT Decode 4.0** - Decodificación de tokens JWT
- **HTTP Interceptors** - Manejo automático de auth
- **Protected Routes** - Rutas con guards de autenticación

### DevOps y Build
- **Docker & Docker Compose** - Contenerización
- **Nginx Alpine** - Servidor web de producción
- **ESLint 9.39** - Linting y code quality
- **TypeScript ESLint** - Reglas específicas para TS

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue **Clean Architecture** con separación de capas:

```
src/
├── domain/                      # 🎯 Capa de Dominio
│   ├── entities/               # Modelos de negocio
│   │   ├── Auth.ts            # Usuario, Login, JWT
│   │   ├── User.ts            # Usuario, Perfil, Role
│   │   ├── Module.ts          # Módulos del sistema
│   │   ├── Expediente.ts      # Investigación DICRI
│   │   ├── Escena.ts          # Escena del crimen
│   │   ├── Indicio.ts         # Indicio/Evidencia
│   │   ├── Fiscalia.ts        # Fiscalía
│   │   ├── TipoIndicio.ts     # Catálogo tipos
│   │   ├── Reportes.ts        # Estadísticas
│   │   └── ApiResponse.ts     # Respuestas API
│   └── repositories/           # Interfaces de repositorios
│       ├── IAuthRepository.ts
│       ├── IUserRepository.ts
│       ├── IExpedienteRepository.ts
│       ├── IEscenaRepository.ts
│       └── IIndicioRepository.ts
│
├── infrastructure/              # ⚙️ Capa de Infraestructura
│   ├── config/                 # Configuración
│   │   └── config.ts          # Variables de entorno
│   ├── http/                   # Cliente HTTP
│   │   └── HttpClient.ts      # Axios + Interceptors
│   └── repositories/           # Implementaciones
│       ├── AuthRepository.ts
│       ├── UserRepository.ts
│       ├── ExpedienteRepository.ts
│       ├── EscenaRepository.ts
│       ├── IndicioRepository.ts
│       ├── FiscaliaRepository.ts
│       ├── TipoIndicioRepository.ts
│       └── ReportesRepository.ts
│
├── presentation/                # 🎨 Capa de Presentación
│   ├── components/             # Componentes reutilizables
│   │   └── PasswordField.tsx
│   ├── pages/                  # Páginas principales
│   │   ├── LoginPage.tsx
│   │   ├── DashboardHome.tsx
│   │   ├── ExpedientesListPage.tsx
│   │   ├── ExpedienteDetailPage.tsx
│   │   ├── ExpedienteEditPage.tsx
│   │   ├── ExpedienteCreatePage.tsx
│   │   ├── ScenesExpedientePage.tsx
│   │   ├── SceneCreatePage.tsx
│   │   ├── SceneEditPage.tsx
│   │   ├── SceneIndiciosPage.tsx
│   │   ├── IndiciosExpedientePage.tsx
│   │   ├── IndicioCreatePage.tsx
│   │   ├── IndicioEditPage.tsx
│   │   ├── RevisionExpedientesPage.tsx
│   │   ├── RevisionExpedienteDetailPage.tsx
│   │   ├── FiscaliasListPage.tsx
│   │   ├── FiscaliaDetailPage.tsx
│   │   ├── FiscaliaCreatePage.tsx
│   │   ├── TiposIndicioListPage.tsx
│   │   ├── TipoIndicioDetailPage.tsx
│   │   ├── TipoIndicioCreatePage.tsx
│   │   ├── ReportesPage.tsx
│   │   ├── AdminHomePage.tsx
│   │   ├── RolesListPage.tsx
│   │   ├── PerfilesListPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── ChangePasswordPage.tsx
│   ├── layouts/                # Plantillas
│   │   └── DashboardLayout.tsx
│   ├── routes/                 # Rutas protegidas
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── context/                # React Context
│   │   └── AuthContext.tsx
│   ├── theme/                  # Material-UI Theme
│   │   └── theme.ts
│   ├── utils/                  # Utilidades
│   │   └── iconMapper.ts
│   └── store/                  # Redux (legacy, migrado)
│
├── store/                       # 🗄️ Redux Store (actual)
│   ├── store.ts                # Configuración del store
│   └── authSlice.ts            # Slice de autenticación
│
├── App.tsx                      # 🎯 App principal con rutas
├── main.tsx                     # 🚀 Entry point
└── vite-env.d.ts               # Types de Vite
```

---

## ⚡ Instalación Rápida

### Requisitos Previos
- **Node.js** v20 o superior
- **npm** v10 o superior
- **Docker** (opcional, para contenedores)

```bash
# Verificar versiones
node --version  # v20+
npm --version   # v10+
```

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Dicri-indicios

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.development

# 4. Iniciar servidor de desarrollo
npm run dev
```

✅ **Aplicación disponible en:** `http://localhost:5173`

---

## 🔧 Configuración

### Variables de Entorno

#### `.env.development` (Desarrollo)
```env
VITE_API_BASE_URL=http://localhost:3030/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=development
```

#### `.env` (Producción)
```env
VITE_API_BASE_URL=https://api.mp.gob.gt/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=production
```

#### `.env.example` (Template)
```env
VITE_API_BASE_URL=http://localhost:3030/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=development
```

> **Seguridad**: Los archivos `.env*` están en `.gitignore` y no se suben al repositorio.

---

## 📦 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run preview      # Preview del build de producción
```

### Build
```bash
npm run build        # Build optimizado de producción
npm run build:dev    # Build con config de desarrollo
npm run build:prod   # Build con config de producción
```

### Linting
```bash
npm run lint         # Ejecuta ESLint en todo el proyecto
```

### Docker
```bash
npm run docker:build:dev   # Build imagen Docker desarrollo
npm run docker:build:prod  # Build imagen Docker producción
npm run docker:up          # Levanta contenedores
npm run docker:down        # Detiene y limpia contenedores
```

---

## 🐳 Docker

El proyecto incluye dos configuraciones Docker:
- **Desarrollo con Hot Reload** (puerto 8080) - Para desarrollo activo
- **Producción con Nginx** (puerto 8081) - Para deployment optimizado

### 🔧 Desarrollo con Hot Reload

El modo desarrollo mantiene sincronización en tiempo real con tu código fuente.

#### Levantar Contenedor de Desarrollo

```bash
# Iniciar contenedor de desarrollo
docker-compose up -d frontend-dev

# Ver logs en tiempo real
docker logs -f dicri-frontend-dev

# O con docker-compose
docker-compose logs -f frontend-dev
```

#### Reconstruir Contenedor de Desarrollo

```bash
# Detener y eliminar contenedor actual
docker stop dicri-frontend-dev
docker rm dicri-frontend-dev

# Reconstruir imagen (opcional, solo si cambió Dockerfile)
docker-compose build frontend-dev

# Levantar nuevamente
docker-compose up -d frontend-dev
```

#### Atajo: Reconstrucción Completa

```bash
# Detener, eliminar, reconstruir y levantar en un solo comando
docker-compose down frontend-dev && docker-compose build frontend-dev && docker-compose up -d frontend-dev
```

**Características del modo desarrollo:**
- ✅ **Hot Module Replacement (HMR)** - Cambios instantáneos
- ✅ **File Watching** con polling (compatible con Windows/Docker)
- ✅ **Volúmenes sincronizados** - Edita y ve cambios al instante
- ✅ **Logs en consola** - Debug en tiempo real
- ✅ **Source maps** - Debug con código original

**Acceso:** `http://localhost:8080`

**Estructura de volúmenes:**
```yaml
volumes:
  - .:/app              # Código fuente sincronizado
  - /app/node_modules   # node_modules aislado
```

---

### 🚀 Producción con Nginx

El modo producción genera un build optimizado servido por Nginx.

#### Construir y Levantar Producción

```bash
# 1. Construir imagen de producción
docker-compose build frontend-prod

# 2. Levantar contenedor
docker-compose up -d frontend-prod

# 3. Ver logs
docker logs dicri-frontend-prod
```

#### Reconstruir Contenedor de Producción

```bash
# Detener y eliminar contenedor
docker stop dicri-frontend-prod
docker rm dicri-frontend-prod

# Reconstruir imagen (necesario siempre que cambies código)
docker-compose build frontend-prod

# Levantar nuevamente
docker-compose up -d frontend-prod
```

#### Atajo: Publicar Nueva Versión

```bash
# Comando completo para publicar cambios a producción
docker stop dicri-frontend-prod && docker rm dicri-frontend-prod && docker-compose build frontend-prod && docker-compose up -d frontend-prod
```

#### Reconstrucción sin Caché (Problemas de build)

```bash
# Si hay problemas, reconstruir sin caché
docker stop dicri-frontend-prod
docker rm dicri-frontend-prod
docker-compose build --no-cache frontend-prod
docker-compose up -d frontend-prod
```

**Características del modo producción:**
- ✅ **Build optimizado** con code splitting y tree-shaking
- ✅ **Nginx Alpine** (imagen ultra ligera ~40MB)
- ✅ **Compresión gzip** habilitada
- ✅ **Cache de assets estáticos** con headers
- ✅ **SPA routing** configurado (`try_files`)
- ✅ **Security headers** aplicados
- ✅ **Source maps** incluidos para debug

**Acceso:** `http://localhost:8081`

**Configuración de Nginx:** Ver archivo `nginx.conf`

---

### 📦 Gestionar Ambos Contenedores

#### Levantar Ambos Simultáneamente

```bash
# Levantar desarrollo y producción
docker-compose up -d frontend-dev frontend-prod

# Verificar estado
docker ps --filter "name=dicri-frontend"
```

#### Detener Ambos Contenedores

```bash
# Detener todos los contenedores del frontend
docker stop dicri-frontend-dev dicri-frontend-prod

# Detener y eliminar
docker stop dicri-frontend-dev dicri-frontend-prod
docker rm dicri-frontend-dev dicri-frontend-prod
```

#### Ver Logs de Ambos

```bash
# Logs intercalados de ambos contenedores
docker-compose logs -f frontend-dev frontend-prod

# O logs separados
docker logs -f dicri-frontend-dev
docker logs -f dicri-frontend-prod
```

---

### 🔍 Comandos Útiles de Docker

#### Inspeccionar Contenedores

```bash
# Ver estado detallado
docker ps -a --filter "name=dicri-frontend"

# Inspeccionar configuración
docker inspect dicri-frontend-prod

# Ver uso de recursos
docker stats dicri-frontend-dev dicri-frontend-prod
```

#### Acceder al Contenedor

```bash
# Entrar al contenedor de desarrollo
docker exec -it dicri-frontend-dev sh

# Entrar al contenedor de producción
docker exec -it dicri-frontend-prod sh

# Verificar archivos en producción
docker exec dicri-frontend-prod ls -la /usr/share/nginx/html
```

#### Verificar Configuración de Nginx

```bash
# Ver configuración actual de Nginx
docker exec dicri-frontend-prod cat /etc/nginx/conf.d/default.conf

# Ver logs de Nginx
docker exec dicri-frontend-prod cat /var/log/nginx/access.log
docker exec dicri-frontend-prod cat /var/log/nginx/error.log
```

#### Limpiar Recursos Docker

```bash
# Eliminar imágenes no utilizadas
docker image prune -a

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa (cuidado!)
docker system prune -a --volumes
```

---

### 🌐 Crear Red de Docker (Primera vez)

```bash
# Crear red para comunicación entre contenedores
docker network create dicri-network

# Verificar red creada
docker network ls | grep dicri

# Inspeccionar red
docker network inspect dicri-network
```

---

### 🔧 Configuración Avanzada

#### Variables de Entorno en Build

Las variables `VITE_*` se inyectan en **tiempo de build**:

```yaml
# docker-compose.yml
frontend-prod:
  build:
    args:
      VITE_API_BASE_URL: http://localhost:3030/api
```

Para cambiar la API URL, edita `docker-compose.yml` y reconstruye:

```bash
# Editar docker-compose.yml
# Cambiar VITE_API_BASE_URL: https://api.produccion.com/api

# Reconstruir con nueva configuración
docker-compose build --no-cache frontend-prod
docker-compose up -d frontend-prod
```

#### Puertos Personalizados

Para cambiar los puertos expuestos, edita `docker-compose.yml`:

```yaml
frontend-dev:
  ports:
    - "3000:5173"  # Cambiar 8080 por 3000

frontend-prod:
  ports:
    - "9000:80"    # Cambiar 8081 por 9000
```

---

### 🐳 Docker Manual (Sin docker-compose)

Si prefieres usar Docker directamente sin docker-compose:

#### Desarrollo

```bash
# Build
docker build -f Dockerfile.dev -t dicri-frontend:dev .

# Run
docker run -d \
  -p 8080:5173 \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -e VITE_API_BASE_URL=http://localhost:3030/api \
  --name dicri-frontend-dev \
  --network dicri-network \
  dicri-frontend:dev

# Logs
docker logs -f dicri-frontend-dev

# Stop
docker stop dicri-frontend-dev && docker rm dicri-frontend-dev
```

#### Producción

```bash
# Build con argumentos
docker build \
  -t dicri-frontend:prod \
  --build-arg VITE_API_BASE_URL=http://localhost:3030/api \
  --target production-stage \
  .

# Run
docker run -d \
  -p 8081:80 \
  --name dicri-frontend-prod \
  --network dicri-network \
  --restart unless-stopped \
  dicri-frontend:prod

# Logs
docker logs -f dicri-frontend-prod

# Stop
docker stop dicri-frontend-prod && docker rm dicri-frontend-prod
```

---

### 📊 Verificación de Despliegue

#### Healthcheck de Desarrollo

```bash
# Verificar que el servidor Vite responde
curl -I http://localhost:8080

# Debe retornar: HTTP/1.1 200 OK
```

#### Healthcheck de Producción

```bash
# Verificar página principal
curl -I http://localhost:8081

# Verificar ruta de SPA (debe retornar index.html)
curl -I http://localhost:8081/dashboard/expedientes

# Verificar assets
curl -I http://localhost:8081/assets/index-*.js

# Todas deben retornar: HTTP/1.1 200 OK
```

#### Verificar Logs

```bash
# Ver últimas 50 líneas de logs
docker logs --tail 50 dicri-frontend-dev
docker logs --tail 50 dicri-frontend-prod

# Logs en tiempo real con timestamps
docker logs -f --timestamps dicri-frontend-prod
```

---

### 🚨 Troubleshooting Docker

#### Error: "Port already in use"

```bash
# Encontrar proceso usando el puerto
# Windows PowerShell
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force

# Linux
lsof -ti:8080 | xargs kill -9
```

#### Error: "Cannot connect to Docker daemon"

```bash
# Windows: Iniciar Docker Desktop
# Linux:
sudo systemctl start docker
sudo usermod -aG docker $USER
```

#### Error: "Network dicri-network not found"

```bash
# Crear la red
docker network create dicri-network
```

#### Contenedor No Inicia

```bash
# Ver logs completos
docker logs dicri-frontend-prod

# Verificar que la imagen se construyó
docker images | grep dicri-frontend

# Reconstruir sin caché
docker-compose build --no-cache frontend-prod
```

#### Hot Reload No Funciona (Windows)

Verifica que `vite.config.ts` tenga:

```typescript
server: {
  watch: {
    usePolling: true,  // Necesario para Docker en Windows
  },
}
```

---

### 📝 Resumen de Comandos

#### Desarrollo

```bash
# Inicio rápido
docker-compose up -d frontend-dev

# Reconstruir
docker-compose down frontend-dev && docker-compose build frontend-dev && docker-compose up -d frontend-dev

# Ver logs
docker logs -f dicri-frontend-dev
```

#### Producción

```bash
# Construir y desplegar
docker-compose build frontend-prod && docker-compose up -d frontend-prod

# Actualizar con cambios
docker stop dicri-frontend-prod && docker rm dicri-frontend-prod && docker-compose build frontend-prod && docker-compose up -d frontend-prod

# Ver logs
docker logs -f dicri-frontend-prod
```

#### Ambos

```bash
# Levantar ambos
docker-compose up -d

# Detener ambos
docker-compose down

# Reconstruir ambos
docker-compose build && docker-compose up -d

# Ver estado
docker ps --filter "name=dicri-frontend"
```

---

## 🔌 API Endpoints

### Base URL
- **Desarrollo**: `http://localhost:3030/api`
- **Producción**: `https://api.mp.gob.gt/api`

### 🔐 Autenticación

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin",
  "clave": "admin123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "✨ Login exitoso ✨",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 1,
      "nombre_usuario": "admin",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "email": "admin@dicri.com",
      "cambiar_clave": true
    },
    "perfiles": [...],
    "roles": [...],
    "modulos": [...]
  }
}
```

#### Verificar Token
```http
GET /auth/verify
Authorization: Bearer {token}
```

#### Cambiar Contraseña
```http
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "clave_actual": "admin123",
  "clave_nueva": "NuevaC0ntr@señ@"
}
```

#### Obtener Usuario Actual
```http
GET /auth/me
Authorization: Bearer {token}
```

---

### 📁 Expedientes (Investigaciones DICRI)

#### Listar Expedientes
```http
GET /expedientes?estado_revision_dicri=EN_REGISTRO&id_fiscalia=1&activo=true
```

**Query Params:**
- `estado_revision_dicri`: `EN_REGISTRO`, `PENDIENTE_REVISION`, `APROBADO`, `RECHAZADO`
- `id_fiscalia`: ID de fiscalía
- `id_usuario_registro`: ID del usuario registrador
- `activo`: `true` o `false`

#### Obtener Expediente por ID
```http
GET /expedientes/:id
```

#### Crear Expediente
```http
POST /expedientes
Content-Type: application/json

{
  "codigo_caso": "MP001-2025-1005",
  "nombre_caso": "Homicidio en Zona 11",
  "fecha_inicio": "2025-11-20",
  "id_fiscalia": 1,
  "descripcion_hechos": "Investigación sobre hallazgo de cuerpo con herida de bala"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Expediente creado exitosamente",
  "data": {
    "id_investigacion": 9,
    "codigo_caso": "MP001-2025-1005",
    "estado_revision_dicri": "EN_REGISTRO",
    "usuario_creacion": "admin",
    "fecha_creacion": "2025-11-22T21:38:19.943Z"
  }
}
```

#### Actualizar Expediente
```http
PUT /expedientes/:id
Content-Type: application/json

{
  "nombre_caso": "Homicidio en Zona 11 - Actualizado",
  "descripcion_hechos": "Descripción ajustada",
  "estado_revision_dicri": "PENDIENTE_REVISION",
  "activo": true
}
```

#### Eliminar Expediente
```http
DELETE /expedientes/:id
```

#### Aprobar Expediente (COORDINADOR_DICRI)
```http
POST /expedientes/:id/aprobar
Authorization: Bearer {token}
```

#### Rechazar Expediente (COORDINADOR_DICRI)
```http
POST /expedientes/:id/rechazar
Content-Type: application/json

{
  "justificacion": "Información incompleta en la descripción de hechos"
}
```

---

### 🏛️ Escenas del Crimen

#### Listar Escenas por Expediente
```http
GET /escenas?id_expediente=:id_investigacion
```

#### Obtener Escena por ID
```http
GET /escenas/:id
```

#### Crear Escena
```http
POST /escenas
Content-Type: application/json

{
  "id_investigacion": 1,
  "nombre_escena": "Lugar del Crimen",
  "direccion_escena": "Avenida Reforma, Edificio X, Zona 10",
  "fecha_hora_inicio": "2025-11-20T08:00:00Z",
  "fecha_hora_fin": null,
  "latitud": 14.5995,
  "longitud": -90.5087,
  "activo": true
}
```

#### Actualizar Escena
```http
PUT /escenas/:id
Content-Type: application/json

{
  "fecha_hora_fin": "2025-11-20T14:00:00Z",
  "activo": true
}
```

#### Eliminar Escena
```http
DELETE /escenas/:id
```

---

### 🧪 Indicios

#### Listar Indicios por Expediente
```http
GET /expedientes/:id_investigacion/indicios
```

#### Listar Indicios por Escena
```http
GET /indicios?id_escena=:id_escena
```

#### Crear Indicio en Expediente
```http
POST /expedientes/:id_investigacion/indicios
Content-Type: application/json

{
  "codigo_indicio": "IND-001-2025",
  "id_escena": 1,
  "id_tipo_indicio": 1,
  "descripcion_corta": "Arma de fuego calibre 9mm",
  "ubicacion_especifica": "Sala principal, junto a la ventana",
  "fecha_hora_recoleccion": "2025-11-20T14:30:00Z"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Indicio creado exitosamente",
  "data": {
    "id_indicio": 3,
    "codigo_indicio": "IND-001-2025",
    "estado_actual": "RECOLECTADO",
    "tipo_indicio": "Arma de Fuego",
    "nombre_escena": "Lugar del Crimen"
  }
}
```

#### Actualizar Indicio
```http
PUT /indicios/:id
Content-Type: application/json

{
  "estado_actual": "EN_CUSTODIA",
  "ubicacion_especifica": "Bodega de evidencias - Estante A3"
}
```

**Estados válidos:**
- `RECOLECTADO` → `EN_CUSTODIA` → `EN_ANALISIS` → `ANALIZADO` → `DEVUELTO`

#### Eliminar Indicio
```http
DELETE /indicios/:id
```

---

### 🗂️ Catálogos

#### Fiscalías
```http
GET    /fiscalias
GET    /fiscalias/:id
POST   /fiscalias
PUT    /fiscalias/:id
DELETE /fiscalias/:id
```

#### Tipos de Indicio
```http
GET    /tipos-indicio
GET    /tipos-indicio/:id
POST   /tipos-indicio
PUT    /tipos-indicio/:id
DELETE /tipos-indicio/:id
```

#### Roles
```http
GET    /roles
GET    /roles/:id
POST   /roles
PUT    /roles/:id
DELETE /roles/:id
```

#### Perfiles
```http
GET    /perfiles
GET    /perfiles/:id
POST   /perfiles
PUT    /perfiles/:id
DELETE /perfiles/:id
```

---

### 📊 Reportes y Estadísticas

#### Estadísticas Generales
```http
GET /reportes/estadisticas-generales
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_expedientes": 120,
    "en_registro": 45,
    "pendiente_revision": 30,
    "aprobados": 40,
    "rechazados": 5,
    "total_indicios": 450,
    "expedientes_por_fiscalia": [
      { "nombre_fiscalia": "Fiscalía Contra la Vida", "total": 35 },
      { "nombre_fiscalia": "Fiscalía de Delitos Sexuales", "total": 28 }
    ]
  }
}
```

---

## 🔐 Autenticación

### Flujo de Autenticación

```mermaid
sequenceDiagram
    Usuario->>LoginPage: Ingresa credenciales
    LoginPage->>API: POST /auth/login
    API-->>LoginPage: Token JWT + Datos usuario
    LoginPage->>Redux: Guarda en store + localStorage
    Redux-->>LoginPage: Estado actualizado
    LoginPage->>Dashboard: Navega protegido
```

### Persistencia de Sesión

- **Redux Persist**: Estado guardado en `localStorage`
- **Token JWT**: Almacenado con key `dicri_auth_token`
- **Datos de usuario**: `dicri_auth_user`
- **Módulos**: `dicri_auth_modulos`
- **Perfiles y Roles**: `dicri_auth_perfiles`, `dicri_auth_roles`

### Auto-Logout

El sistema cierra sesión automáticamente si:
- ❌ Token expirado (verificado en cada request)
- ❌ Token inválido o corrupto
- ❌ Respuesta 401 del backend
- ❌ Usuario elimina manualmente el token

### Roles y Permisos

- **ADMIN**: Acceso total al sistema
- **COORDINADOR_DICRI**: Revisión y aprobación de expedientes
- **FISCAL**: Ver expedientes asignados
- **INVESTIGADOR**: Crear y editar expedientes
- **RECOLECTOR**: Registrar indicios

---

## 🎯 Módulos del Sistema

### 1. Dashboard Principal
- Estadísticas generales
- Indicadores visuales
- Distribución por fiscalía
- Acceso rápido a módulos

### 2. Gestión de Expedientes
- Lista con filtros avanzados
- Creación de nuevos expedientes
- Edición (solo en `EN_REGISTRO`)
- Vista de detalle completa
- Gestión de escenas asociadas
- Gestión de indicios asociados

### 3. Gestión de Escenas
- Lista de escenas por expediente
- Registro de nueva escena
- Edición de escena existente
- Geolocalización
- Indicios por escena

### 4. Gestión de Indicios
- Lista de indicios por expediente/escena
- Registro de nuevo indicio
- Edición de indicio
- Cambio de estado
- Cadena de custodia

### 5. Revisión de Expedientes (COORDINADOR)
- Lista de pendientes de revisión
- Aprobar expediente
- Rechazar con justificación
- Historial de revisiones

### 6. Reportes y Estadísticas
- Dashboard con métricas
- Gráficas interactivas
- Exportación de datos (próximamente)

### 7. Administración
- Gestión de usuarios
- Roles y permisos
- Perfiles de usuario
- Catálogos (Fiscalías, Tipos de Indicio)

### 8. Cambiar Contraseña
- Validación de contraseña actual
- Requisitos de complejidad
- Indicador de fortaleza
- Confirmación visual

---

## ⚡ Optimizaciones de Performance

### Code Splitting
- **Lazy Loading** de componentes con `React.lazy()`
- **Suspense** para cargas asíncronas
- Chunks separados por vendors (React, MUI, Redux)

### Build Optimizations
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'mui-vendor': ['@mui/material', '@mui/icons-material'],
        'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
      },
    },
  },
  chunkSizeWarningLimit: 1000,
}
```

### Caching Strategy
- **Redux Persist**: Estado en localStorage
- **HTTP Caching**: Headers de Nginx
- **Service Worker**: (próximamente)

### Performance Metrics
- **Initial Load**: < 2s
- **DOMContentLoaded**: < 1s
- **Time to Interactive**: < 2.5s

---

## 🧪 Testing

### Configuración de Tests (Próximamente)

```bash
npm run test          # Ejecutar tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Stack de Testing Recomendado
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Playwright** - E2E testing

---

## 🚀 Deployment

### Build de Producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

**Output:** Carpeta `dist/` con assets optimizados

### Deploy con Docker

```bash
# Build imagen de producción
docker build -t dicri-frontend:prod \
  --build-arg VITE_API_BASE_URL=https://api.mp.gob.gt/api \
  .

# Push a registry
docker tag dicri-frontend:prod registry.mp.gob.gt/dicri-frontend:latest
docker push registry.mp.gob.gt/dicri-frontend:latest

# Deploy en servidor
docker pull registry.mp.gob.gt/dicri-frontend:latest
docker run -d -p 80:80 --name dicri-frontend registry.mp.gob.gt/dicri-frontend:latest
```

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name dicri.mp.gob.gt;
  
  root /usr/share/nginx/html;
  index index.html;
  
  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  
  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Variables de Entorno en Producción

```env
VITE_API_BASE_URL=https://api.mp.gob.gt/api
VITE_APP_NAME=DICRI Indicios
VITE_APP_ENV=production
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to API"
```bash
# 1. Verificar backend está corriendo
curl http://localhost:3030/api/health

# 2. Revisar variables de entorno
cat .env.development

# 3. Verificar CORS en backend
# Debe permitir origen: http://localhost:5173
```

### Error: "Token expired"
- El sistema cerrará sesión automáticamente
- Vuelve a hacer login con tus credenciales

### Error: "Port 5173 already in use"
```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# O cambiar puerto en vite.config.ts
server: { port: 5174 }
```

### Error: "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de Vite
rm -rf node_modules/.vite
```

### Docker: "Cannot connect to Docker daemon"
```bash
# Windows
# Iniciar Docker Desktop

# Linux
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### Performance Lenta
```bash
# 1. Verificar hot reload (Docker Windows)
# vite.config.ts debe tener:
watch: { usePolling: true }

# 2. Verificar modo producción
npm run build
npm run preview

# 3. Analizar bundle size
npm run build -- --mode=analyze
```

---

## 🤝 Contribución

### Git Workflow

```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer commits descriptivos
git commit -m "feat: agregar filtro de búsqueda avanzada"

# 3. Push a remote
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub/GitLab
```

### Convenciones de Commits

```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato (sin lógica)
refactor: Refactorización de código
test: Agregar o modificar tests
chore: Mantenimiento (deps, config)
```

### Code Style

- **TypeScript**: Estricto (strict mode)
- **Imports**: Organizados (React → Third-party → Local)
- **Naming**: camelCase para variables, PascalCase para componentes
- **Archivos**: PascalCase para componentes, camelCase para utils

### Estructura de Componente

```tsx
// 1. Imports
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSave: () => void;
}

// 3. Componente
export const MyComponent = ({ title, onSave }: Props) => {
  // 4. Hooks
  const [data, setData] = useState([]);
  const { user } = useAuth();
  
  // 5. Handlers
  const handleClick = () => {
    onSave();
  };
  
  // 6. Render
  return (
    <Box>
      <Button onClick={handleClick}>{title}</Button>
    </Box>
  );
};
```

---

## 📄 Licencia

**Ministerio Público de Guatemala**  
**Sistema de Gestión DICRI Indicios**  
© 2025 - Todos los derechos reservados

Este software es propiedad del Ministerio Público de Guatemala y está protegido por las leyes de propiedad intelectual de Guatemala.

**Uso Restringido:**
- Uso exclusivo para entidades del Ministerio Público
- Prohibida su distribución sin autorización
- Prohibida su modificación sin autorización

---

## 🆘 Soporte y Contacto

### Equipo de Desarrollo

**Departamento de Tecnología**  
**Ministerio Público de Guatemala**

- **Email**: siamp@mp.gob.gt
- **Teléfono**: +502 2411-9999
- **Dirección**: 8ª Avenida 10-67, Zona 1, Ciudad de Guatemala

### Horario de Soporte

- **Lunes a Viernes**: 8:00 AM - 5:00 PM (GMT-6)
- **Urgencias**: Disponible 24/7 para problemas críticos

### Reportar Issues

Para reportar bugs o solicitar nuevas funcionalidades:

1. Enviar email a siamp@mp.gob.gt
2. Incluir:
   - Descripción del problema
   - Pasos para reproducir
   - Screenshots (si aplica)
   - Logs de consola
   - Información del navegador

---

## 📚 Documentación Adicional

- **[QUICKSTART.md](./QUICKSTART.md)** - Guía de inicio rápido
- **[API Docs](./docs/API.md)** - Documentación completa de API
- **[Architecture](./docs/ARCHITECTURE.md)** - Detalles de arquitectura
- **[Docker Guide](./docs/DOCKER.md)** - Guía completa de Docker

---

## 🎯 Roadmap 2025

### Q1 2025
- [x] Módulo de Expedientes
- [x] Módulo de Escenas
- [x] Módulo de Indicios
- [x] Sistema de Revisión
- [ ] Tests unitarios (80% coverage)

### Q2 2025
- [ ] Módulo de Reportes Avanzados
- [ ] Exportación a PDF/Excel
- [ ] Carga masiva de datos
- [ ] Firma digital de documentos

### Q3 2025
- [ ] App móvil (React Native)
- [ ] Notificaciones push
- [ ] Integración con laboratorio
- [ ] API pública documentada

### Q4 2025
- [ ] Machine Learning para análisis
- [ ] Dashboard predictivo
- [ ] Integración con otros sistemas MP
- [ ] Certificación ISO 27001

---

## ✅ Checklist de Verificación

### Para Desarrollo
- [ ] Node.js v20+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] Backend API corriendo en puerto 3030
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Login exitoso con credenciales de prueba

### Para Producción
- [ ] Build exitoso sin warnings
- [ ] Tests pasando (cuando estén implementados)
- [ ] Variables de entorno de producción configuradas
- [ ] Docker image construida
- [ ] Nginx configurado
- [ ] SSL/TLS habilitado
- [ ] Backups configurados

---

## 🏆 Créditos

### Equipo de Desarrollo

**Ministerio Público de Guatemala**  
**Departamento de Sistemas e Informática**

- **Product Owner**: Ing. [Nombre]
- **Tech Lead**: Ing. [Nombre]
- **Frontend Developers**: [Nombres]
- **Backend Developers**: [Nombres]
- **QA Engineers**: [Nombres]
- **DevOps Engineers**: [Nombres]

### Tecnologías Open Source

Agradecimientos especiales a los proyectos open source que hacen posible este sistema:

- React Team
- Vite Team
- Material-UI Team
- Redux Team
- Y toda la comunidad de JavaScript/TypeScript

---

**¡Gracias por usar DICRI Indicios!** 🚀

**Ministerio Público de Guatemala**  
*Justicia para todos*

---
