# use current node.js LTS version
FROM node:12.16.3

RUN apt-get update
RUN apt-get install -y tofrodos
RUN npm install -g http-server

# create app dir
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# copy project files to current dir
COPY . .

# build app for production with minification
RUN ls -l
RUN chmod 755 build.sh
RUN fromdos < build.sh > build1.sh
RUN mv build1.sh build.sh
RUN npm run demo-build

EXPOSE 8080
CMD [ "http-server", "dist" ]
