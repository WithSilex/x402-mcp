FROM node:20-alpine
WORKDIR /app
COPY package.json index.js ./
COPY bin ./bin
USER node
ENTRYPOINT ["node", "./bin/cli.js"]
