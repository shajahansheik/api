FROM --platform=linux/amd64 node:18-alpine

EXPOSE 80
EXPOSE 443
EXPOSE 8080
EXPOSE 3001
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev -f

COPY . ./

RUN npm install typescript -f
RUN npm run-script build

CMD [ "npm", "start" ]
