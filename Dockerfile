# Step 1: Build the application
FROM node:22-alpine AS build

WORKDIR /app

# Add build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_APP_ENV

# Set environment variables for the build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_APP_ENV=$VITE_APP_ENV

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

# The official nginx image supports environment variables in templates
# It will replace ${BACKEND_ADDR} with the actual value at runtime
CMD ["nginx", "-g", "daemon off;"]
