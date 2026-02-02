# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for caching
COPY mcp-servers/linear-manager/package*.json ./mcp-servers/linear-manager/
COPY mcp-servers/github-manager/package*.json ./mcp-servers/github-manager/
COPY mcp-servers/ssh-manager/package*.json ./mcp-servers/ssh-manager/

# Install dependencies for all services
RUN cd mcp-servers/linear-manager && npm install
RUN cd mcp-servers/github-manager && npm install
RUN cd mcp-servers/ssh-manager && npm install

# Copy source code
COPY mcp-servers/ ./mcp-servers/

# Install git for github-manager & ssh client for ssh-manager
RUN apk add --no-cache git openssh-client

# The command will be overridden by docker-compose
CMD ["node"]
