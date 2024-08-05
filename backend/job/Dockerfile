
FROM python:3.11

ENV APP_HOME /app
ENV SQL_HOST=mysql_server
ENV AUTH_API_HOST=authapi
ENV USER_API_HOST=userapi

ENV MODEL_API_HOST=modelapi

ENV SERVER_IP="http://career-go.centralindia.cloudapp.azure.com"
ENV DATABASE_NAME=jobDB
ENV SQL_USER=jobsql
ENV SQL_PASSWORD=jobsPass_32
ENV SQL_PORT=3306
ENV HOST=0.0.0.0
ENV PORT=8000
ENV RELOAD=True
ENV SMTP_SERVER="smtp.gmail.com"
ENV SMTP_PORT=465
ENV EMAIL_ADDRESS="careergo.noreply@gmail.com"
ENV EMAIL_PASSWORD="txdd fmjg vatx dqyd"

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY ./JobAPI /app
COPY ./requirements.txt $APP_HOME/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "main.py"]

