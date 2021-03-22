FROM nginx:1.19-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY map.conf /etc/nginx/conf.d/map.conf
EXPOSE 80
EXPOSE 8080