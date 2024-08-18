FROM node:20 as build

WORKDIR /app

# Copies the necessary NX files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig* ./
COPY .eslintrc.json ./

COPY apps/frontend ./apps/frontend

RUN npm install

# Additional NX logging
# ENV NX_VERBOSE_LOGGING=true

ENV NX_DAEMON=true
RUN npx nx build frontend --configuration=docker

FROM nginx:alpine
COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]