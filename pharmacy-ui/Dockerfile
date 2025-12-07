FROM node:22-alpine
WORKDIR /pham-app
COPY . .
COPY package*.json ./
RUN npm install

RUN npm run build
RUN npm run tail
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]