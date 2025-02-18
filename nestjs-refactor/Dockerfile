# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Compila el código de TypeScript a JavaScript
RUN npm run build

# Exponemos el puerto que usará la aplicación NestJS
EXPOSE 3010

# Define el comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
