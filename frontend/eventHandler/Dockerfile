FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy everything else including .env if needed
COPY . .

# Build the app
RUN npm run build

# Check that dist folder exists
RUN test -f dist/index.html

# Serve the build
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
