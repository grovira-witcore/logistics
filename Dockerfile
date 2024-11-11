FROM node:22-alpine as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./frontend/package*.json .
RUN npm install --legacy-peer-deps
COPY ./frontend .
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./backend/package*.json .
RUN npm install --only=production --legacy-peer-deps
COPY ./backend .
COPY ./infra/create-endpoints.js ./create-endpoints.js
COPY --from=build /usr/src/app/dist ./public
EXPOSE 3000
CMD ["node", "index.js"]
