FROM node:18-alpine

WORKDIR /app

# Install build tools and Python for bcrypt
RUN apk add --no-cache python3 build-base
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"] 