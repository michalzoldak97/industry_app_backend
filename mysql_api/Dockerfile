FROM node

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

RUN npm install jsonwebtoken

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]