from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from . import config

app = FastAPI()

# Load TF-IDF Vectorizer and Models
with open(config.TFIDF_VECTORIZER_PATH, 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

#Load the dataset
final_data = pd.read_pickle(config.FINAL_DATA_PATH)

# Load NN model for jobs
with open(config.NN_MODEL_JOBS_PATH, 'rb') as f:
    nn_model_jobs = pickle.load(f)

# Load NN model for applicants
with open(config.NN_MODEL_APPLICANTS_PATH, 'rb') as f:
    nn_model_applicants = pickle.load(f)    

# Fit and transform the job descriptions
tfidf_job_description = tfidf_vectorizer.transform(final_data['text'])


nn_model_jobs.fit(tfidf_job_description)

# Fit and transform the position of interest
tfidf_position_of_interest = tfidf_vectorizer.transform(final_data['Position.Of.Interest'])


nn_model_applicants.fit(tfidf_position_of_interest)

# Define functions for handling recommendations

def print_recommended_jobs(applicant_id):
    if applicant_id not in final_data['Applicant.ID'].values:
        raise HTTPException(status_code=404, detail=f"Applicant ID {applicant_id} not found in the data.")
    
    applicant_index = final_data[final_data['Applicant.ID'] == applicant_id].index[0]
    nearest_neighbors_indices = nn_model_jobs.kneighbors(tfidf_job_description[applicant_index])
    top_jobs_for_applicant = [final_data.iloc[idx]['Job.ID'] for idx in nearest_neighbors_indices[1][0]]
    
    return {"user_id": applicant_id, "job_id": top_jobs_for_applicant}

def recommend_applicants(job_position):
    tfidf_job_position = tfidf_vectorizer.transform([job_position])
    nearest_neighbors_indices = nn_model_applicants.kneighbors(tfidf_job_position)
    top_applicants_indices = nearest_neighbors_indices[1][0]
    top_applicants_for_job = [final_data.iloc[idx]['Applicant.ID'] for idx in top_applicants_indices]
    
    return {"job_position": job_position, "applicant_id": top_applicants_for_job}

# Define FastAPI endpoints

@app.get('/recommend_jobs/{applicant_id}')
async def handle_recommend_jobs_endpoint(applicant_id: int):
    recommendations = print_recommended_jobs(applicant_id)
    return recommendations

@app.get('/recommend_applicants/{job_position}')
async def handle_recommend_applicants_endpoint(job_position: str):
    recommendations = recommend_applicants(job_position)
    return recommendations

# Create an asynchronous scheduler
scheduler = AsyncIOScheduler()

# Function to fetch updated data from an API
async def fetch_updated_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(config.UPDATE_DATA_API_URL)  # Replace with your API endpoint
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch updated data. Status code: {response.status_code}")
            return None
        
#Functiom to fetch upadated position of interest from an API        
async def fetch_updated_poi():
    async with httpx.AsyncClient() as client:
        response = await client.get(config.UPDATE_POI_API_URL)  # Replace with your API endpoint
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch updated data. Status code: {response.status_code}")
            return None
        
# Function to update models with fetched data
async def update_models():
    global tfidf_vectorizer, final_data, nn_model_jobs, nn_model_applicants

    # Fetch updated data from API
    updated_data = await fetch_updated_data()
    if updated_data is None:
        print("No updated data available. Models not updated.")
        return

    # Example: Assume the API returns data in a specific format
    updated_text_data = updated_data['text_data']

    # Update tfidf_vectorizer with updated_text_data
    tfidf_vectorizer.fit(updated_text_data)

    # Retrain models with updated data
    tfidf_job_description = tfidf_vectorizer.fit_transform(updated_text_data)
    nn_model_jobs.fit(tfidf_job_description)

    # Fetch updated data from API
    updated_poi = await fetch_updated_poi()
    if updated_poi is None:
        print("No updated data available. Models not updated.")
        return

    # Example: Assume the API returns data in a specific format
    updated_poi_data = updated_poi['Position.of.interest']

    # Update tfidf_vectorizer with updated_text_data
    tfidf_vectorizer.fit(updated_poi_data)

    tfidf_position_of_interest = tfidf_vectorizer.transform(updated_poi_data)

    # Find the nearest neighbors (i.e., top job positions) for each position of interest
    distances, indices = nn_model_jobs.kneighbors(tfidf_position_of_interest)


    # Fetch updated data from API
    updated_poi = await fetch_updated_poi()
    if updated_poi is None:
        print("No updated data available. Models not updated.")
        return

    # Example: Assume the API returns data in a specific format
    updated_poi_data = updated_poi['Position.of.interest']

    # Update tfidf_vectorizer with updated_text_data
    tfidf_vectorizer.fit(updated_poi_data)

    tfidf_position_of_interest = tfidf_vectorizer.transform(updated_poi_data)

    #fitting applicant model to poi
    nn_model_applicants.fit(tfidf_position_of_interest)

    print("Models updated.")

# Define scheduled job
async def interval():
    await update_models()
    

# Schedule the update_models function to run periodically
scheduler.add_job(lambda: asyncio.create_task(interval()), 'interval', hours=24)

# Start the scheduler
scheduler.start()
