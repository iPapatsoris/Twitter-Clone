FROM node:18
WORKDIR /backend
COPY backend/package*.json .
RUN yarn install --ignore-engines
COPY backend .
COPY .env ../.env
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ./entrypoint.sh