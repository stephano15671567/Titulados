from node:24.2.0
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install -g serve
# Copy the rest of the application code
COPY . .
# Expose the port the app runs on
EXPOSE 3000
RUN npm run build
# Start the application
CMD ["serve", "-s", "build"]

# Use a non-root user to run the application

