FROM node:alpine
 
WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
