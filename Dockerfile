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
# Esta imagen es ligera y solo tiene Nginx (NO tiene Node/NPM)
FROM nginx:alpine AS production-stage

# Copiamos la configuración de nginx si la tienes (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados en la etapa 'build-stage'
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]