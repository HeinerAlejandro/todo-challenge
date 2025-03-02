# Development Stage

FROM node:21.4-alpine as base

WORKDIR /srv/app

COPY package*.json .

RUN npm install

COPY . .

FROM base as development

ENV NODE_ENV development

EXPOSE 5173

# Production Stage

FROM base as builder

ENV NODE_ENV production

COPY package*.json .

RUN ["npm", "run", "build"]

FROM nginx:1.25-alpine as production

COPY --from=builder /srv/app/build /usr/share/nginx/html