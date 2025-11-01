# Stage 1: Build the React application
FROM node:20 AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# When the nginx image is run, it will start nginx and host the files in /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]