FROM node:20.11.1
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

CMD [ "node", "dist/main.js" ]