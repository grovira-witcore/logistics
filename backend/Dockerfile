FROM node:22-alpine
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --only=production
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]
