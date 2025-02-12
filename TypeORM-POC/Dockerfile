# Use the official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the entire application to the container
COPY . .

# Expose the app port
EXPOSE 3000

# Set environment variable to enable TypeScript development
ENV NODE_ENV=development

# Run the application
CMD ["nodemon", "src/index.ts"]