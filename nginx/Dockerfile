FROM nginx:1.25-alpine as dev

COPY nginx.dev.conf /etc/nginx/conf.d/default.conf

FROM nginx:1.25-alpine as prod

COPY nginx.dev.conf /etc/nginx/conf.d/default.conf
