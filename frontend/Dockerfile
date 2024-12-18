FROM node:22-alpine as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine-slim
ADD ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /var/www/app/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
