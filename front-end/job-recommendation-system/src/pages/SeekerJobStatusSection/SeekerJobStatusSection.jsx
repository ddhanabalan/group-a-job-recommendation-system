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
import { stubTrue } from "lodash";

export default function SeekerJobStatusSection({userType}) {
    const COMPANYID = (userType==="employer"?getStorage("userID"):getStorage("guestUserID"));
    const receivedData = useLocation();
    const [userData, setUserData] = useState({'type': userType, 'skills': []});
    console.log("received data",receivedData)
    //const [selectedEntry, setEntry] = useState(null);
    const [selectedEntry, setEntry] = useState(receivedData["state"]?receivedData.state.highlightedId || null: null);//userData is for knowing if employer or seeker and further passing it down to components
    const [selectedEntryType, setEntryType] = useState(receivedData["state"]?receivedData.state.highlightedEntryType || null: null)
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
    const callJobVacancyAPI = async (companyId) => {
        if (userType === "seeker") {
          await Promise.all([GetSeekerDetails(), GetSeekerSkills()]);
        }
        try {
          const req_response = await jobAPI.get('/job_request/user', { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
          console.log("update job requests", req_response);
          const invite_response = await jobAPI.get('/job_invite/user', { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
          console.log("update job invites", invite_response);
      
          // Wait for all job details promises to resolve
          const new_req_response = await Promise.all(
            req_response.data.map(async (e) => {
              const jobDetails = await readJobsAPI({ job_vacancy_id: e.job_id, job_status: e.status, application_id: e.id, type: "request" });
              return jobDetails;
            })
          );
      
          const new_invite_response = await Promise.all(
            invite_response.data.map(async (e) => {
              const jobDetails = await readJobsAPI({ job_vacancy_id: e.job_id, job_status: e.status, application_id: e.id, type: "invite" });
              return jobDetails;
            })
          );
      
          const detailedJobs = [...new_req_response, ...new_invite_response];
          console.log("after new jobs", detailedJobs);
          setJobVacancies(detailedJobs);
      
        } catch (e) {
          console.log("jobs failed", e);
          alert(e.message);
        }
      };
      
      const deleteJobRequestAPI = async (job_request_id) => {
        try {
          const r = await jobAPI.delete(`/job_request/${job_request_id}`, { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
          await callJobVacancyAPI();
          setEntry(null);
        } catch (e) {
          console.log("job request deletion failed", e);
          alert(e.message);
        }
      };
      
      const readJobsAPI = async ({ job_vacancy_id, job_status, application_id = null, type = null }) => {
        try {
          const r = await jobAPI.get(`/job_vacancy/${job_vacancy_id}`, { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
          let mod_response = {};
          if (type=="invite") {
            console.log("job invite detail", r);
            mod_response = {
              id: r.data.job_id,
              jobTitle: r.data.job_name,
              job_invite_id: application_id,
              invite_status: job_status,
              companyUsername: r.data.company_username,
              companyName: r.data.company_name,
              tags: r.data.tags,
              currency: r.data.salary.split('-')[0],
              salary: [r.data.salary.split('-')[1], r.data.salary.split('-')[2]],
              postDate: r.data.created_at.split('T')[0],
              last_date: r.data.last_date.split('T')[0],
              location: r.data.location,
              empType: r.data.emp_type,
              exp: r.data.experience,
              workStyle: r.data.work_style,
              workingDays: r.data.working_days,
              jobDesc: r.data.job_desc,
              jobReq: r.data.requirement,
              skills: /*r.data.skills.length ? r.data.skills :*/ [{ 'skill': "" }],
              type: "invite"
            };
          } else {
            console.log("job detail", r);
            mod_response = {
              id: r.data.job_id,
              job_req_id: application_id,
              status: job_status,
              jobTitle: r.data.job_name,
              companyUsername: r.data.company_username,
              companyName: r.data.company_name,
              tags: r.data.tags,
              currency: r.data.salary.split('-')[0],
              salary: [r.data.salary.split('-')[1], r.data.salary.split('-')[2]],
              postDate: r.data.created_at.split('T')[0],
              last_date: r.data.last_date.split('T')[0],
              location: r.data.location,
              empType: r.data.emp_type,
              exp: r.data.experience,
              workStyle: r.data.work_style,
              workingDays: r.data.working_days,
              jobDesc: r.data.job_desc,
              jobReq: r.data.requirement,
              skills: /*r.data.skills.length ? r.data.skills :*/ [{ 'skill': "" }],
              type: "request"
            };
          }
          console.log("modded job", mod_response);
          console.log("present job vac", jobVacancies);
          return mod_response;
      
        } catch (e) {
          console.log("jobs failed", e);
          alert(e.message);
        }
      };
    
    const handleInvite=async(status, job_invite_id)=>{
      
        const req_data = {
            "status": status,
        }
        console.log("job status data", req_data)
        try {
            const response = await jobAPI.put(`/job_invite/${job_invite_id}`, req_data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            console.log("updated response", response)
            //const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))
            callJobVacancyAPI();

        } catch (e) {

            console.log("failed to invite", e)

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
    const chooseEntry =(entry,entryType)=>{
        //function for passing selected job opening card from child component to parent componenet
        console.log("entry", entry, "entryType", entryType)
        if(entryType)
        {setEntry(entry);
        setEntryType(entryType);}
    }

    const searchBar =(searchValue)=>{
        setSearch(searchValue);
    }
    const expJob=(selection, selectionType="request")=>{
        console.log("select", selection, selectionType);
        
        const selectionKey = selectionType==="invite"?"job_invite_id":"job_req_id";
        console.log("selected job vacncyt after mod", jobVacancies, "selection", selection)
        const expEntry = jobVacancies.filter(e=>(e[selectionKey]===selection?e:false));
        console.log("expEntry ", expEntry)
        setJobEntry(expEntry[0]);
        if(userData.type == "employer")console.log("yep done");
        
        
    }
    console.log("selected entry: ", selectedEntry, "selected entry type:", selectedEntryType," selected job: ", selectedJobEntry);    
    
    const listToDescParentFunc=()=>{
        setSideBar(true);
    }
    //console.log("filtered applicants",filteredApplicants);
    useEffect(() => {callJobVacancyAPI(COMPANYID)}, []);//only runs during initial render
    useEffect(()=>{if(selectedEntry==null && selectedEntryType==null)
        {
         setJobEntry(jobVacancies[0]?jobVacancies[0]:null)
         setEntryType(jobVacancies[0]?jobVacancies[0].type: null)
         setEntry(jobVacancies[0]?(jobVacancies[0].type === "invite"?jobVacancies[0].job_invite_id:jobVacancies[0].job_req_id):null)
         console.log("job entry refreshed", jobVacancies)
        }
        else{
            //setJobEntry(jobVacancies[selectedEntry]);
            if(jobVacancies.length!=0)
            {expJob(selectedEntry, selectedEntryType);
            console.log("job entry refreshed", jobVacancies)}
        }},[jobVacancies])
    useEffect(()=>{if(jobVacancies.length!=0 && selectedEntry!=null && selectedEntryType!=null)expJob(selectedEntry, selectedEntryType)},[selectedEntry]);
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
                <OpeningsListBar data={jobVacancies} userType={userType} userID={COMPANYID} pageType="review" chooseEntry={chooseEntry} seekerJobs={true} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} filterFunc={filterStateSet} />
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
                    <JobCardExpanded data={selectedJobEntry}  deleteJobRequest={deleteJobRequestAPI} userData={userData} type="approval" invite={selectedJobEntry?(selectedJobEntry.type=="invite"?true:false):false} handleInvite={handleInvite}/>
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