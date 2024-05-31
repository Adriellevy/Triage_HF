# Usa una imagen base oficial de Node.js
FROM node:20.14.0

# Establece el directorio de trabajo
WORKDIR /server

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que la aplicación estará corriendo
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]