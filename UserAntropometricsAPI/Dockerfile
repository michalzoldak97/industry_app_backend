FROM node

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "send.js"]