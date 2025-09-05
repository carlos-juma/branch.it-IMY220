FROM node:20

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE 1337