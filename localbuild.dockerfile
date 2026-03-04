FROM node:slim

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY backend/package*.json ./backend/

# Install dependencies
WORKDIR /app/backend
RUN npm install

# Go back to root and copy the entire project
WORKDIR /app
COPY . .

# Expose port 80
EXPOSE 80

# Set the working directory for the command execution
WORKDIR /app/backend

# Run the backend
CMD ["npm", "start"]
