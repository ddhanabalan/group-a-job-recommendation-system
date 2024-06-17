import axios from 'axios';

//let ip="117.215.191.48";
let ip="localhost";

export const authAPI =axios.create({
     baseURL: `http://${ip}:8000/`
});

export const userAPI=axios.create({
    baseURL:  `http://${ip}:8001/`
});

export const jobAPI=axios.create({
    baseURL:  `http://${ip}:8002/`
});

export default authAPI;


