# SELECT NODE VERSION. Alpine is a lightweight linux distribution. designed to be small and secure
FROM node:25-alpine

# Set working directory inside the container
WORKDIR /app

# Copy application code inside the container.
COPY package*.json ./
# COPY src ./

# Install dependencies inside container. (yarn add if using yarn)
RUN npm install

# Expose the port your backend runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "run", "dev"]
