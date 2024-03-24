import axios from 'axios';

 const API =axios.create({
    baseURL: "http://13.200.252.236:8000"
});
export default API