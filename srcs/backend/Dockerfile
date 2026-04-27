FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY srcs/backend/package*.json ./srcs/backend/
COPY shared/package*.json ./shared/

RUN npm install

COPY shared ./shared
COPY srcs/backend ./srcs/backend

WORKDIR /app/srcs/backend
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]