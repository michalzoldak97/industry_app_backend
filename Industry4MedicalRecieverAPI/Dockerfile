FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install nodemon -g

COPY . .

CMD ["npm", "run", "start"]