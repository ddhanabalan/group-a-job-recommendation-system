
# Career Go - Job Recommendation System Installation Guide

## Installation

1. **Clone the Repository**: 
   ```sh
   git clone https://github.com/ddhanabalan/group-a-job-recommendation-system.git
   ```
2. **Navigate to the Project Directory**: 
   ```sh
   cd group-a-job-recommendation-system
   ```
3. **Build the Docker Containers**: 
   ```sh
   docker-compose build
   ```
4. **Run the Docker Containers**: 
   ```sh
   docker-compose up
   ```

## Running Multiple Instances

### Separate Backend and Frontend Instances

1. **Clone the Repository**: 
   ```sh
   git clone https://github.com/ddhanabalan/group-a-job-recommendation-system.git
   ```
2. **Navigate to the Backend Directory**: 
   ```sh
   cd group-a-job-recommendation-system/backend
   ```
3. **Build the Docker Containers for Backend**: 
   ```sh
   docker-compose build
   ```
4. **Run the Docker Containers for Backend**: 
   ```sh
   docker-compose up
   ```
5. **Take note of the IP Address**.
6. **Navigate to the Frontend Directory**: 
   ```sh
   cd ../frontend/job-recommend-system/src/axio
   ```
7. **Update the IP Address in `axios.jsx`**.
8. **Navigate back to the Frontend Directory**: 
   ```sh
   cd ../../
   ```
9. **Build the Docker Containers for Frontend**: 
   ```sh
   docker build -t frontend:latest .
   ```
10. **Run the Docker Containers for Frontend**: 
    ```sh
    docker run frontend
    ```

### Running Multiple Instances with Different APIs

1. **Clone the Repository**: 
   ```sh
   git clone https://github.com/ddhanabalan/group-a-job-recommendation-system.git
   ```
2. **Navigate to the Backend Directory**: 
   ```sh
   cd group-a-job-recommendation-system/backend
   ```
3. **Navigate to Each API Directory (auth, users, job, model, utils)**: 
   ```sh
   cd <API_DIRECTORY>
   ```
4. **Build and Run the Docker Containers for Each API**: 
   ```sh
   docker build -t <API_DIRECTORYNAME>:latest .
   docker run <API_DIRECTORYNAME>
   ```
   **Note**: While building, make sure to specify each IP address of each API in the Docker configuration so they can communicate with each other.

5. **Update the IP Addresses in `axios.jsx`**.
6. **Navigate back to the Frontend Directory**: 
   ```sh
   cd ../../frontend/job-recommend-system/src/axio
   ```
7. **Update the IP Address in `axios.jsx`**.
8. **Navigate back to the Frontend Directory**: 
   ```sh
   cd ../../
   ```
9. **Build the Docker Containers for Frontend**: 
   ```sh
   docker build -t frontend:latest .
   ```
10. **Run the Docker Containers for Frontend**: 
    ```sh
    docker run frontend
    ```

## Technologies Used
- **Frontend**: HTML, CSS, React.js, MUI
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: MySQL
- **Machine Learning**: Python, scikit-learn
- **Scheduler**: APScheduler
