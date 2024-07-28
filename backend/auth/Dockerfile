
FROM python:3.11

ENV APP_HOME /app
ENV SQL_HOST=mysql_server
ENV DATABASE_NAME=authDB
ENV SQL_USER=authsql
ENV SQL_PASSWORD=authPass_32
ENV SQL_PORT=3306
ENV HOST=0.0.0.0
ENV PORT=8000
ENV RELOAD=True
ENV USER_API_HOST=userapi
ENV JOB_API_HOST=jobapi
ENV MODEL_API_HOST=modelapi
ENV SERVER_IP="http://career-go.centralindia.cloudapp.azure.com"
ENV SMTP_SERVER="smtp.gmail.com"
ENV SMTP_PORT=465
ENV EMAIL_ADDRESS="careergo.noreply@gmail.com"
ENV EMAIL_PASSWORD="txdd fmjg vatx dqyd"

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config openssl && \
    rm -rf /var/lib/apt/lists/*

COPY ./AuthAPI /app
COPY ./requirements.txt $APP_HOME/

RUN pip install --no-cache-dir -r requirements.txt
RUN openssl rand -hex 32 > key.txt && KEY=$(cat key.txt) && rm key.txt

ENV SECRET_KEY=$KEY
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=30
ENV REFRESH_TOKEN_EXPIRE_MINUTES=144 0

EXPOSE 8000

CMD ["python", "main.py"]

