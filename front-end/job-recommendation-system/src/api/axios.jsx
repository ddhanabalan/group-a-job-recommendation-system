import axios from 'axios';

let ip="192.168.1.8";
// let ip="localhost";

export const authAPI =axios.create({
     baseURL: `http://${ip}:8000/`
});

export const userAPI=axios.create({
    baseURL:  `http://${ip}:8001/`
});

export const jobAPI=axios.create({
    baseURL:  `http://${ip}:8002/`
});
export const utilsAPI = axios.create({
    baseURL: `http://${ip}:8003/`
});
export default authAPI;


