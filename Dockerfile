# ==========================================
# 1. ETAPA DE DESARROLLO (dev-stage)
# ==========================================
# Usamos una imagen de Node que SÍ tiene npm instalado
FROM node:20-alpine AS dev-stage

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (usamos install para evitar errores si no hay lockfile)
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Expone el puerto de Vite por defecto
EXPOSE 5173

# En desarrollo, nos quedamos aquí. 
# El comando de arranque se inyecta desde docker-compose.


# ==========================================
# 2. ETAPA DE CONSTRUCCIÓN (build-stage)
# ==========================================
FROM dev-stage AS build-stage

# Recibimos la variable de entorno para el build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Ejecutamos el build de producción
RUN npm run build


# ==========================================
# 3. ETAPA DE PRODUCCIÓN (production-stage)
# ==========================================
FROM nginx:alpine AS production-stage

# ✅ Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos del build
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]