
FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root_password
ENV AUTH_DATABASE=authDB
ENV USER_DATABASE=usersDB
ENV AUTHAPI_HOST=authapi
ENV USERAPI_HOST=userapi

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY SkillData.sql /docker-entrypoint-initdb.d/02-SkillData.sql

EXPOSE 3306
