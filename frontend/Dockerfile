# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We assume standard vite build command
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy custom nginx config if we have one, or just use default
# Here we use default, but we should make sure routing works for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
