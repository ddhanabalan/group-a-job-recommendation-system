import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Paths to model and data files
MODEL_DIR = os.getenv('MODEL_DIR')
TFIDF_VECTORIZER_PATH = os.getenv('TFIDF_VECTORIZER_PATH')
FINAL_DATA_PATH = os.getenv('FINAL_DATA_PATH')
NN_MODEL_JOBS_PATH = os.getenv('NN_MODEL_JOBS_PATH')
NN_MODEL_APPLICANTS_PATH = os.getenv('NN_MODEL_APPLICANTS_PATH')

# API endpoint for fetching updated data
UPDATE_DATA_API_URL = os.getenv('UPDATE_DATA_API_URL')
UPDATE_POI_API_URL = os.getenv('UPDATE_POI_API_URL')
