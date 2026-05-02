FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["npm", "run", "dev"]
