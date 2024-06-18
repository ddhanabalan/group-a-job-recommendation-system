# Use the official Python image from Docker Hub
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Install necessary system packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget unzip

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Paths to model and data files
ENV MODEL_DIR=model
ENV TFIDF_VECTORIZER_PATH=${MODEL_DIR}/tfidf_vectorizer.pkl
ENV FINAL_DATA_PATH=${MODEL_DIR}/final_data.pkl
ENV NN_MODEL_JOBS_PATH=${MODEL_DIR}/nn_model_jobs.pkl
ENV NN_MODEL_APPLICANTS_PATH=${MODEL_DIR}/nn_model_applicants.pkl

# API endpoint for fetching updated data
ENV UPDATE_DATA_API_URL=http://localhost:8080/text
ENV UPDATE_POI_API_URL=http://localhost:8080/poi

# Download the model files from Google Drive (replace with your actual file IDs)
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1psJZZBbYxwSEobRsW28Trp6G164zoGzF" -O model/tfidf_vectorizer.pkl
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1mXT4kTNUZ-XGBLcUHqcbqC3p8ZMuqoFh" -O model/final_data.pkl
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1xAxFvfMDG-B1pPIAPLlbI36OLuJK8Y5u" -O model/nn_model_jobs.pkl
RUN wget --no-check-certificate "https://drive.google.com/uc?export=download&id=1bOvHktgvWScaG_pSRkRqHrBgYykNd3Dl" -O model/nn_model_applicants.pkl

# Copy the rest of the application code
COPY . .

# Expose the port on which FastAPI will run (adjust if necessary)
EXPOSE 8000

# Command to run the FastAPI application using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
