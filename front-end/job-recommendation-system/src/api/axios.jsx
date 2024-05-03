import axios from 'axios';

let ip="13.233.114.185";
 const API =axios.create({
     baseURL: "http://localhost:8000/"
});
export default API
