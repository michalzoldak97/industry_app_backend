FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

EXPOSE 8082

CMD ["npm", "run", "start"]

# to run test on build: CMD ["npm", "run", "test"]