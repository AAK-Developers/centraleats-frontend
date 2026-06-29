# Step 1: Build the application
FROM node:22-alpine AS build

WORKDIR /app

# Build is environment-agnostic; variables are injected at runtime

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration template
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Generate env-config.js from environment variables at runtime, then start Nginx
CMD ["/bin/sh", "-c", "echo \"window.env = { VITE_API_BASE_URL: '${VITE_API_BASE_URL}', VITE_CLERK_PUBLISHABLE_KEY: '${VITE_CLERK_PUBLISHABLE_KEY}', VITE_APP_ENV: '${VITE_APP_ENV}' };\" > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]
