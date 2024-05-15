import './JobSection.css'
import { useState, useEffect } from 'react';
import Filter from "../../components/Filter/Filter";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Jobs from "../../components/Jobs/Jobs";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import BackBtn from '../../components/BackBtn/BackBtn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton} from '@mui/material';

export default function JobSection() {
    const demoInfo = [{ id: 0, jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},
                      { id: 1, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Moscow', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["java", "AI"]},
                      { id: 2, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Uganda', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["ruby", "AI", "Django"]},
                      { id: 3, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Alaska', empType: 'Internship', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},
                      { id: 4, jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Germany', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["react", "AI", "Django"]},
                      { id: 5, jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},
                      { id: 6, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Alaska', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["reactor", "AI", "Django"]},
                      { id: 7, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},
                      { id: 8, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'India', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},
                      { id: 9,jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"]},]    
    const userData = {'type': "seeker", 'skills': ['python', 'java', 'react', 'ai'], "appliedJobs": [1,2,5,6]};
    const [searchVal, setSearch] = useState("");
    const [filterparam, setParam] = useState({});
    const filtered = demoInfo.filter(id => id["skills"].map((tag)=>(tag.toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length?id:false)
    
    const [descriptionOn,setDescFromChild] = useState(false);

    const filterDataSet=(fdata)=>{
        setParam({...fdata});
    }
    console.log("filter", filterparam);
    function OpenDesc(desc_state){
        setDescFromChild(desc_state);
        //console.log("description status job section", desc_state);
    }
    const searchBar =(searchValue)=>{
        setSearch(searchValue);
    }

    return (
        <div id="page">
            <div className="job-filter">
                <Filter title="Filter jobs" passFilteredDataFn={filterDataSet}/>
            </div>
            <NavigationBar active="job/candidate"/>
            <StatsAI value="jobs"/>
            
            <div className="job-search">
                {descriptionOn?
                    <div className="back-icon">
                        <IconButton aria-label="back" onClick={()=>{OpenDesc(false)}} sx={{display: "flex", alignItems: "center", borderRadius: "50%", backgroundColor:"white", width: 35, height: 35}}>
                            <ArrowBackIosIcon sx={{color: "black", position: "relative", left: "0.2rem"}}/>
                        </IconButton>
                    </div>
                    :
                    <></>
                }
                <SearchBar toSearch="Search Jobs" onSearch={searchBar}/> 
            </div>
            <Jobs data={filtered} dataToParentFn={OpenDesc} desc_state={descriptionOn} userData={userData}/>
        </div>
    )
}