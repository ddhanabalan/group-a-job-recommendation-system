//import Filter from "../components/Filter";
//import StatsAI from "../components/StatsAI";
import "./SeekerJobStatusSection.css";
import {getStorage, setStorage} from "../../storage/storage";
import Filter from "../../components/Filter/Filter";
import OpeningsListBar from "../../components/OpeningsListBar/OpeningsListBar";
import JobCardExpanded from "../../components/JobCardExpanded/JobCardExpanded";
import BackBtn from "../../components/BackBtn/BackBtn";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import { set } from "react-hook-form";
import { jobAPI, userAPI } from "../../api/axios";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import careerGoLogo from "../../images/careergo_logo.svg"

export default function SeekerJobStatusSection({userType}) {
    const COMPANYID = (userType==="employer"?getStorage("userID"):getStorage("guestUserID"));
    const receivedData = useLocation();
    const [userData, setUserData] = useState({'type': userType, 'skills': []});
    console.log("received data",receivedData)
    //const [selectedEntry, setEntry] = useState(null);
    const [selectedEntry, setEntry] = useState(receivedData["state"]?receivedData.state.highlightedId || null: null);//userData is for knowing if employer or seeker and further passing it down to components
    //console.log("selected entry", selectedEntry);
    const [searchVal, setSearch] = useState("");
    //demoInfo is example vacancy profiles
    const [jobVacancies, setJobVacancies] = useState([]);
    const [newVacancy, setNewVacancy] = useState({});
    const [jobApplicants, setApplicants] = useState([]);
    /*const demoInfo = [{ },
                      { id: 1, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Moscow', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["java", "AI"], applicationsReceived: [1,2,3,4,5,7,8,9]},
                      { id: 2, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Uganda', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["ruby", "AI", "Django"], applicationsReceived: [1,2,3,4,5,7,9]},
                      { id: 3, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Alaska', empType: 'Internship', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"], applicationsReceived: [1,2,3,4,9]},
                      { id: 4, jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Germany', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["react", "AI", "Django"], applicationsReceived: [1,2,3,4,5,]},
                      { id: 5, jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"], applicationsReceived: [1,4,5,7,8,9]},
                      { id: 6, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'Alaska', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["reactor", "AI", "Django"], applicationsReceived: [1,2,8,9]},
                      { id: 7, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"], applicationsReceived: [1,3,8,9]},
                      { id: 8, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'India', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"], applicationsReceived: [1,2,9]},
                      { id: 9,jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "RS", salary: ["5000","10000"], postDate: "13/9/23" , location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose" ,jobReq:"This is for demo purpose",skills: ["python", "AI", "Django"], applicationsReceived: [1,5,7,8,9]},]*/
   


    
    const [filterstat, setFilter] = useState(false);
    const [filterparam, setParam] = useState({});
    //const filtered = (jobVacancies.length!=0?jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length?id:false):[]);
    
    //const filtered = []
    const [selectedJobEntry,setJobEntry] = useState(null);
    //const [filteredApplicants, setfilteredApplicants]=useState(profileInfo.filter(applicants=>(selectedJobEntry["applicationsReceived"].includes(applicants["applicantID"])?applicants:false)));
    const [sidebarState, setSideBar] = useState(false);
    const [queryJob, setQueryJob] = useState({});
    const callJobVacancyAPI= async (companyId)=>{
        if(userType==="seeker")
        {GetSeekerSkills();
        GetSeekerDetails();}
        try {
            
            const response = await jobAPI.get('/job_request/user', {headers:{'Authorization': `Bearer ${getStorage("userToken")}`}});
            console.log("update",response);
            const new_response = response.data.map(async(e) => {const jobDetails= await readJobsAPI(e.job_id,e.status, e.id)
                                                                return jobDetails;
                                                                })
            const detailedJobs = await Promise.all(new_response)
            console.log("after new jobs", detailedJobs)
            setJobVacancies(detailedJobs);
            
            //console.log(" after new job vacancies", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {
            console.log("jobs failed", e)
            
            alert(e.message);
        }
    }

    const deleteJobRequestAPI = async(job_request_id) => {
        try {
            
            const r = await jobAPI.delete(`/job_request/${job_request_id}`, {headers:{'Authorization': `Bearer ${getStorage("userToken")}`}});
            callJobVacancyAPI();
            setEntry(null);
            
            //console.log(" after new job vacancies", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {
            console.log("job request deletion  failed", e)
            
            alert(e.message);
        }

    }

    
    const readJobsAPI = async(job_vacancy_id, status, job_request_id)=>{
        try {
            
            const r = await jobAPI.get(`/job_vacancy/${job_vacancy_id}`, {headers:{'Authorization': `Bearer ${getStorage("userToken")}`}});
            console.log("job detail",r);
            const mod_response = {id: r.data.job_id, job_req_id: job_request_id,status: status, jobTitle: r.data.job_name, companyUsername: r.data.company_username, companyName: r.data.company_name, tags: r.data.tags, currency: r.data.salary.split('-')[0], salary: [r.data.salary.split('-')[1],r.data.salary.split('-')[2]], postDate: r.data.created_at.split('T')[0] , last_date: r.data.last_date.split('T')[0], location: r.data.location, empType: r.data.emp_type, exp: r.data.experience, workStyle: r.data.work_style, workingDays: r.data.working_days, jobDesc: r.data.job_desc ,jobReq: r.data.requirement,skills: /*r.data.skills.length?r.data.skills: */[{'skill': ""}]};
            console.log("modded job", mod_response)
            console.log("present job vac", jobVacancies)
            return mod_response
            
            
            //console.log(" after new job vacancies", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {
            console.log("jobs failed", e)
            
            alert(e.message);
        }
    }

    
    
    const GetSeekerDetails = async ()=>{
        
        try{
            const response = await userAPI.get('/seeker/details', {
                headers:{
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
         console.log("resp dat", response)
         setUserData({'id': response.data.user_id, 'type': userData.type, 'skills': []})
         
        }
        catch(e){
            console.log("user req failed", e);
        }
    }
    const GetSeekerSkills = async ()=>{
        try{
            const response = await userAPI.get('/seeker/skill', {
                headers:{
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
        })
        //console.log("skills received", response.data)
        setUserData({'id': response.data?.user_id || Number(getStorage("userID")), 'type': 'seeker', 'skills': response.data})
        
    }
    
        catch(e){
            console.log("skill error", e)
        }
        console.log("user datum", userData);
    }
    

    
        
    //console.log("applicants confirmed", jobApplicants)
    //console.log("sidebar", sidebarState)
    //console.log("filtered", filtered);
    const filterStateSet=(fstate)=>{
        setFilter(fstate);
    }
    const filterDataSet=(fdata)=>{
        setParam({...fdata});
    }
    //console.log("filter parameters", filterparam);
    const chooseEntry =(entry)=>{
        //function for passing selected job opening card from child component to parent componenet
        setEntry(entry);
    }

    const searchBar =(searchValue)=>{
        setSearch(searchValue);
    }
    const expJob=(selection)=>{
        //console.log("select", selection);
        console.log("selected job vacncyt after mod", jobVacancies, "selection", selection)
        const expEntry = jobVacancies.filter(e=>(e["id"]===selection?e:false));
        console.log("expEntry ", expEntry)
        setJobEntry(expEntry[0]);
        if(userData.type == "employer")console.log("yep done");
        
        
    }
    console.log("selected entry: ", selectedEntry, " selected job: ", selectedJobEntry);    
    
    const listToDescParentFunc=()=>{
        setSideBar(true);
    }
    //console.log("filtered applicants",filteredApplicants);
    useEffect(() => {callJobVacancyAPI(COMPANYID)}, []);//only runs during initial render
    useEffect(()=>{if(selectedEntry==null)
        {setEntry(jobVacancies[0]?jobVacancies[0].id:null)
         setJobEntry(jobVacancies[0]?jobVacancies[0]:null)
         console.log("job entry refreshed", jobVacancies)
        }
        else{
            //setJobEntry(jobVacancies[selectedEntry]);
            if(jobVacancies.length!=0)
            {expJob(selectedEntry);
            console.log("job entry refreshed", jobVacancies)}
        }},[jobVacancies])
    useEffect(()=>{if(jobVacancies.length!=0 && selectedEntry!=null)expJob(selectedEntry)},[selectedEntry]);
    //useEffect(() => {if(Object.keys(newVacancy).length !=0)setJobVacancies([...jobVacancies, newVacancy]);}, [newVacancy])
    console.log("updated vacancies", jobVacancies)

    return (
        <div id="page">
            <div className={`review-left-bar${sidebarState?" wide":""}`}>
            {/*{jobVacancies.length!=0?
                <OpeningsListBar data={jobVacancies} userType={userType} userID={COMPANYID} pageType="review" chooseEntry={chooseEntry} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} filterFunc={filterStateSet} />
                :
                <></>
            }*/}
                <OpeningsListBar data={jobVacancies} userType={userType} userID={COMPANYID} pageType="review" chooseEntry={chooseEntry} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} filterFunc={filterStateSet} />
            </div>
            {filterstat?
            <div className="filter enabled">
                <Filter title="Filter" passFilteredDataFn={filterDataSet}/>
            </div>
            :
            <></>
            }
            <NavigationBar active="job-applications"/>
            <div className={`applications-box${filterstat?" blur":""}${sidebarState?" wide":""}`}>
            
                
                {selectedEntry!=null /*&& filtered.length!=0*/ && jobVacancies.length!=0?
                    <JobCardExpanded data={selectedJobEntry}  deleteJobRequest={deleteJobRequestAPI} userData={userData} type="approval"/>
                    :
                    <div className="no-job-applications-message">
                            <img className="careergo-web-logo" src={careerGoLogo}/>
                            <p>Boost your career options with CareerGo</p>
                    </div>
                }
            
            </div>
        </div>
    )
}