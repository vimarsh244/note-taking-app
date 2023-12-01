# Specify the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy the frontend code
COPY notetaking-frontend ./notetaking-frontend

# Install the frontend dependencies
WORKDIR /app/notetaking-frontend
RUN npm install

# Create .env file for notetaking-frontend
RUN echo "VITE_SERVER_URL=http://localhost:3000" > .env

# Build the frontend code
RUN npm run build

# Change the working directory to the backend folder
WORKDIR /app/express-backend

# Copy the backend code
COPY express-backend .

# Install the backend dependencies
RUN npm install

# Expose the port on which the server will run
EXPOSE 3000

# Copy the frontend build output to the backend folder
COPY --from=0 /app/notetaking-frontend/dist /app/express-backend/public


# Start the server
CMD ["npm", "start"]
