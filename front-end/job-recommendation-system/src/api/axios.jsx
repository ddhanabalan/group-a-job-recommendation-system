import axios from 'axios';

 const API =axios.create({
     baseURL: "http://13.235.13.36:8000/"
});
export default API
