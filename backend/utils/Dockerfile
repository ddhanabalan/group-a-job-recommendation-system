
FROM python:3.11

ENV APP_HOME /app

ENV HOST=0.0.0.0
ENV PORT=8000
ENV RELOAD=True
ENV SQL_HOST=mysql_server
ENV DATABASE_NAME=utilDB
ENV SQL_USER=utilsql
ENV SQL_PASSWORD=utilsqlPass_32
ENV SERVER_IP ="http://career-go.centralindia.cloudapp.azure.com"
ENV SQL_PORT=3306


WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY ./UtilsAPI /app
COPY ./requirements.txt $APP_HOME/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "main.py"]

