# Use a Node.js base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the app runs on
EXPOSE 3333

# Command to run the application
CMD ["npm", "run", "start:dev"]