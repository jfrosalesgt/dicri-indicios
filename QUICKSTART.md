# 🚀 Guía de Inicio Rápido - DICRI Indicios

## ⚡ Inicio Rápido (5 minutos)

### 1. Verificar Requisitos
Asegúrate de tener instalado:
- **Node.js** v20 o superior
- **npm** v10 o superior
- **Docker** (opcional, para contenedores)

```bash
node --version
npm --version
```

### 2. Instalar Dependencias
```bash
cd d:\Proyecto\Frontend\Dicri-indicios
npm install
```

### 3. Configurar Variables de Entorno
Los archivos `.env` y `.env.development` ya están configurados con:
- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: `http://localhost:3030/api`

### 4. Iniciar la Aplicación
```bash
npm run dev
```

✅ La aplicación estará disponible en: **http://localhost:5173**

### 5. Acceder al Sistema
Usa las credenciales por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin123`

---

## 📦 Comandos Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor de desarrollo (puerto 5173)
npm run preview      # Previsualiza build de producción
```

### Build
```bash
npm run build        # Build de producción
npm run build:dev    # Build de desarrollo
npm run build:prod   # Build de producción
```

### Linting
```bash
npm run lint         # Ejecuta ESLint
```

### Docker
```bash
npm run docker:up              # Levanta contenedores
npm run docker:down            # Detiene contenedores
npm run docker:build:dev       # Build imagen desarrollo
npm run docker:build:prod      # Build imagen producción
```

---

## 🐳 Uso con Docker

### Opción 1: Docker Compose (Recomendado)

**Desarrollo (puerto 8080):**
```bash
docker-compose up -d frontend-dev
```

**Producción (puerto 8081):**
```bash
docker-compose up -d frontend-prod
```

**Detener contenedores:**
```bash
docker-compose down
```

### Opción 2: Docker Manual

**Build:**
```bash
docker build -t dicri-frontend:latest \
  --build-arg VITE_API_BASE_URL=http://localhost:3030/api .
```

**Run:**
```bash
docker run -d -p 8080:80 --name dicri-frontend dicri-frontend:latest
```

**Stop:**
```bash
docker stop dicri-frontend
docker rm dicri-frontend
```

---

## 🔧 Configuración de API

### Cambiar URL del Backend

Edita el archivo correspondiente:

**Para Desarrollo** (`.env.development`):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Para Producción** (`.env`):
```env
VITE_API_BASE_URL=http://tu-servidor.com/api
```

---

## 🎯 Estructura de Rutas

### Rutas Públicas
- `/login` - Página de inicio de sesión

### Rutas Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal
- `/dashboard/users` - Lista de usuarios
- `/dashboard/users/:id` - Detalle de usuario
- `/dashboard/nosotros` - Página Nosotros
- `/dashboard/certificaciones` - Certificaciones
- `/dashboard/noticias/mp` - Noticias MP
- Y más...

---

## 🔑 API Endpoints Disponibles

### Autenticación
```bash
POST   /api/auth/login            # Login
GET    /api/auth/verify           # Verificar token
POST   /api/auth/change-password  # Cambiar contraseña
GET    /api/auth/me               # Obtener usuario actual
```

### Usuarios
```bash
GET    /api/users        # Listar usuarios
GET    /api/users/:id    # Obtener usuario por ID
POST   /api/users        # Crear usuario
PUT    /api/users/:id    # Actualizar usuario
DELETE /api/users/:id    # Eliminar usuario
```

### Expedientes (Investigaciones DICRI)

Endpoints:
```
GET    /api/expedientes
GET    /api/expedientes/{id}
POST   /api/expedientes
PUT    /api/expedientes/{id}
DELETE /api/expedientes/{id}
```

Estados (estado_revision_dicri):
EN_REGISTRO | PENDIENTE_REVISION | APROBADO | RECHAZADO

Crear:
```json
{
  "codigo_caso": "MP001-2025-1005",
  "nombre_caso": "Homicidio en Zona 11",
  "fecha_inicio": "2025-11-20",
  "id_fiscalia": 1,
  "descripcion_hechos": "Investigación sobre el hallazgo de un cuerpo con herida de bala"
}
```

Respuesta creación (201):
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

Actualizar:
```json
{
  "descripcion_hechos": "Descripción ajustada",
  "estado_revision_dicri": "PENDIENTE_REVISION",
  "activo": true
}
```

Respuesta actualización (200):
```json
{ "success": true, "message": "Expediente actualizado exitosamente", "data": null }
```

> El listado admite filtros: estado_revision, id_fiscalia, id_usuario_registro, activo.

### Crear Indicio en Expediente

POST /api/expedientes/{id}/indicios
Campos: codigo_indicio, id_escena, id_tipo_indicio, descripcion_corta, ubicacion_especifica?, fecha_hora_recoleccion?
Estado inicial: RECOLECTADO

---

## 📂 Catálogos Rápidos

Fiscalías:
GET /api/fiscalias
POST /api/fiscalias

Tipos de Indicio:
GET /api/tipos-indicio
POST /api/tipos-indicio

---

## 🎨 Tecnologías Principales

- ⚛️ **React 18** - UI Library
- 📘 **TypeScript** - Type Safety
- ⚡ **Vite 7** - Build Tool
- 🛣️ **React Router** - Routing
- 🔌 **Axios** - HTTP Client
- 🔐 **JWT** - Authentication
- 🐳 **Docker** - Containerization
- 🌐 **Nginx** - Web Server

---

## 📁 Estructura del Proyecto

```
src/
├── domain/              # Entidades e interfaces
├── infrastructure/      # HTTP client y repositorios
├── presentation/        # Componentes UI
│   ├── pages/          # Páginas
│   ├── layouts/        # Layouts
│   ├── components/     # Componentes
│   ├── context/        # React Context
│   └── routes/         # Rutas protegidas
└── App.tsx             # Punto de entrada
```

---

## 🔒 Seguridad

- ✅ JWT Authentication con expiración automática
- ✅ Protected Routes - Rutas protegidas
- ✅ Auto-logout en caso de token inválido
- ✅ HTTP Interceptors para manejo de errores

---

## 🚨 Solución de Problemas

### Error: "Cannot connect to API"
1. Verifica que el backend esté corriendo
2. Revisa la URL en `.env.development` o `.env`
3. Verifica que no haya CORS issues

### Error: "Token expired"
- El sistema cerrará sesión automáticamente
- Vuelve a iniciar sesión con tus credenciales

### Error: "Port 5173 already in use"
```bash
# En Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# O cambia el puerto en vite.config.ts
```

---

## 📚 Recursos Adicionales

- **README completo**: `README.md`
- **Documentación de Vite**: https://vitejs.dev
- **Documentación de React**: https://react.dev
- **Documentación de React Router**: https://reactrouter.com

---

## 🆘 Soporte

**Email**: siamp@mp.gob.gt  
**Proyecto**: Ministerio Público de Guatemala  
**Año**: 2025

---

## ✅ Checklist de Verificación

- [ ] Node.js v20+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] Backend API corriendo
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Login exitoso con credenciales de prueba

¡Listo! Ya puedes comenzar a desarrollar 🎉
