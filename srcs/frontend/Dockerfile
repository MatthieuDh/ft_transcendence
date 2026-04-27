FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY srcs/frontend/package*.json ./srcs/frontend/
COPY shared/package*.json ./shared/

RUN npm install

COPY shared ./shared
COPY srcs/frontend ./srcs/frontend

WORKDIR /app/srcs/frontend

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]