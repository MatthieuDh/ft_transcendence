FROM nginx:alpine

RUN apk add --no-cache openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=BE/ST=Antwerp/L=Antwerp/O=42Network/CN=localhost"

COPY nginx.conf /etc/nginx/conf.d/default.conf