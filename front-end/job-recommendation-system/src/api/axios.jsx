import axios from 'axios';

let ip="13.233.114.185";
 const API =axios.create({
     baseURL: "http://13.233.114.185:8000/"
});
export default API
