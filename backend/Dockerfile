FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
RUN mkdir -p logs
EXPOSE 5000
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
RUN npm ci --only=production
COPY . .
RUN mkdir -p logs
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
