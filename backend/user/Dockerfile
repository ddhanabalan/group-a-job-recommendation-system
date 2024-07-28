
FROM python:3.11

ENV APP_HOME /app
ENV SQL_HOST=mysql_server
ENV AUTH_API_HOST=authapi
ENV JOB_API_HOST=jobapi
ENV MODEL_API_HOST=modelapi
ENV SERVER_IP="http://career-go.centralindia.cloudapp.azure.com"
ENV DATABASE_NAME=usersDB
ENV SQL_USER=usersql
ENV SQL_PASSWORD=usersPass_32
ENV SQL_PORT=3306
ENV HOST=0.0.0.0
ENV PORT=8000
ENV RELOAD=True

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY ./UserAPI /app
COPY ./requirements.txt $APP_HOME/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "main.py"]

