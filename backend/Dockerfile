# Base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Bundle app source
COPY src ./src

# Creates a "dist" folder with the compiled JavaScript files
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/index.js" ]