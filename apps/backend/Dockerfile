FROM node:20

WORKDIR /app

# Copies the necessary NX files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig* ./
COPY .eslintrc.json ./

COPY apps/backend ./apps/backend

RUN npm install

# Additional NX logging
# ENV NX_VERBOSE_LOGGING=true

ENV NX_DAEMON=true
RUN npm run server-build

EXPOSE 3000

RUN npx nx reset
CMD ["npm", "run", "server-run"]