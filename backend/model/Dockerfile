
FROM python:3.11

ENV APP_HOME /app
ENV SQL_HOST=mysql_server
ENV AUTH_API_HOST=authapi
ENV USER_API_HOST=userapi
ENV JOB_API_HOST=jobapi
ENV DATABASE_NAME=modelDB
ENV SQL_USER=modelsql
ENV SQL_PASSWORD=modelsPass_32
ENV SQL_PORT=3306
ENV HOST=0.0.0.0
ENV PORT=8000
ENV RELOAD=True

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY ./ModelAPI /app

RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1psJZZBbYxwSEobRsW28Trp6G164zoGzF" -O app/mlmodel/tfidf_vectorizer.pkl
#RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1mXT4kTNUZ-XGBLcUHqcbqC3p8ZMuqoFh" -O mlmodel/final_data.pkl
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1xAxFvfMDG-B1pPIAPLlbI36OLuJK8Y5u" -O app/mlmodel/nn_model_jobs.pkl
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1bOvHktgvWScaG_pSRkRqHrBgYykNd3Dl" -O app/mlmodel/nn_model_applicants.pkl
COPY requirements.txt $APP_HOME/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "main.py"]

