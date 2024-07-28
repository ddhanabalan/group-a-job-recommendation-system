import axios from 'axios';
import { navigate } from '../context/NavigationService.jsx';
import { setStorage, getStorage } from '../storage/storage.jsx';



// let ip="192.168.1.6";
// let ip="localhost";
let loggedOut = false
let ip="career-go.centralindia.cloudapp.azure.com"
let proceed = "true";
const authAPI =axios.create({
     baseURL: `http://${ip}:8000/`
});

const userAPI=axios.create({
    baseURL:  `http://${ip}:8001/`
});

const jobAPI=axios.create({
    baseURL:  `http://${ip}:8002/`
});
const utilsAPI = axios.create({
    baseURL: `http://${ip}:8003/`
});
const modelAPI = axios.create({
    baseURL: `http://${ip}:8004/`
});

const API = [authAPI, userAPI, jobAPI, utilsAPI, modelAPI]

const handleTimeout = (delay)=>{
    setTimeout(() => {
        proceed = true
        console.log("timer worked")
    }, delay);
}

const handleRefresh= (delay)=>{
  setTimeout(() => {
      window.location.reload()
  }, delay);
}

const refreshTokens = async() => {
    try{
    const response = await authAPI.get('/refresh_token', {
      headers: {
        'Authorization': `Bearer ${getStorage("refToken")}`
      }
   })
    console.log("refresh token successful", response.data)
    setStorage("refToken", response.data.refresh_token)
    setStorage("userToken", response.data.access_token)
    loggedOut = false
    
    handleRefresh(1000)
    return true
    }
    catch(e){
        console.log("verification error", e)
        
        navigate('/')
        loggedOut = true
        return false
    }


  }

const setupInterceptor = (apiInstance) => {
    apiInstance.interceptors.response.use(
      response => response,
      error => {
        console.log("logging out", loggedOut)
        console.log("errors encountered man", error)
        
        if (error.response && error.response.status === 401 && !loggedOut && proceed) {
        
          console.log(`Big almost unauthorized error from ${apiInstance.defaults.baseURL}`);
          proceed = false;
          const r = refreshTokens();
          handleTimeout(5000);
          console.log("refresh token return", r)
          // Handle the error, e.g., redirect to login or refresh token
          
        }
      else if(error.response && error.response.status === 404 && error.response.request.responseURL && error.response.request.responseURL.includes("8004")){
          console.log(`Model error registered`);
          
        }
        // else{
        //   console.log("big error")
        //   navigate('/*')
        // }
        return Promise.reject(error);
      }
    );
  };

  
  
  API.forEach(api => setupInterceptor(api));

export {authAPI, userAPI, jobAPI, utilsAPI, modelAPI};
export default authAPI;


