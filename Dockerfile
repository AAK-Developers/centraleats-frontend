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

# Copy environment injection script to docker-entrypoint.d
COPY nginx/30-generate-env-config.sh /docker-entrypoint.d/30-generate-env-config.sh
RUN chmod +x /docker-entrypoint.d/30-generate-env-config.sh

# Expose port 80
EXPOSE 80

# Use standard Nginx entrypoint execution
CMD ["nginx", "-g", "daemon off;"]
