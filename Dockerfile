FROM nginx:alpine AS production
RUN apk add --no-cache docker-cli docker-compose
COPY ./dist/agent-frontend/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /app/conf
RUN mkdir -p /home/code
COPY ./glyph_code_tools_linux /app/glyph_code_tools_linux
COPY ./start.sh /app/start.sh
COPY ./conf /app/conf
RUN chmod 0777 /app/
RUN mkdir -p /root/.docker
RUN chmod -R 0777 /root/.docker
WORKDIR /app
EXPOSE 80
ENTRYPOINT [ "sh","./start.sh" ]