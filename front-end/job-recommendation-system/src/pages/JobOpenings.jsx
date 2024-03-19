import Filter from "../components/Filter";
import StatsAI from "../components/StatsAI";

import OpeningsListBar from "../components/OpeningsListBar";
import JobDesciptionForm from "../components/JobDesciption";
import { useLocation } from "react-router-dom";

export default function JobOpeningsSection() {
    const location = useLocation();
    const userType = location["pathname"].includes("employer")?"employer":"seeker";
    const userData ={usertype:userType}
    const demoInfo = { jobTitle: "Python Developer", 
                       companyName: "Google LLC", 
                       tags: ["on-site", "software / IT", "Monday-Friday"], 
                       currency: "₹", 
                       salary: "50k", 
                       postDate: "13/9/23" , 
                       location: 'London', 
                       empType: 'Full-time', 
                       exp: '5-10 years', 
                       jobDesc: "This is for demo purpose" ,
                       jobReq:"This is for demo purpose",
                       skills: ["python", "AI", "Django"],
                       ...userData};
    
    
   
    
    return (
        <div id="page">
            <OpeningsListBar data={userData}/>
            <JobDesciptionForm data={demoInfo}/>
        </div>
    )
}