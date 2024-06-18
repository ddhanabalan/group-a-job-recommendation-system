import JobVacancyForm from "../../components/CreateJobVacancyForm/CreateJobVacancyForm";
import "./CreateJobVacancy.css"
import { useLocation } from "react-router-dom";

export default function CreateJobVacancy() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location["pathname"].includes("employer")?"employer":"seeker";
    const userData ={usertype:userType} //if users employer or seeker
    const demoInfo = {companyName: "Google LLC"} //default company profile for employers
    
    
   
    
    return (
        <div id="page" className="create-vacancy-page">
            
            <JobVacancyForm data={demoInfo}/>
            
        </div>
    )
}