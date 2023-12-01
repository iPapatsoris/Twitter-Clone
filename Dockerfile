FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build
CMD ["yarn", "preview"]