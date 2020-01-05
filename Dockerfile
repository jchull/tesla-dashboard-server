FROM node:12-alpine3.9

# Create app directory
RUN mkdir -m777 -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package.json ./

COPY . .
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install
RUN npm run build

ENV PORT 3000
EXPOSE 3000

CMD [ "npm", "start" ]
