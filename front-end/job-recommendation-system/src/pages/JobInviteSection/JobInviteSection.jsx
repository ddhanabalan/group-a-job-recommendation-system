//import Filter from "../components/Filter";
//import StatsAI from "../components/StatsAI";
import "./JobInviteSection.css";
import {getStorage, setStorage} from "../../storage/storage";
import Filter from "../../components/Filter/Filter";
import OpeningsListBar from "../../components/OpeningsListBar/OpeningsListBar";
import JobCardExpanded from "../../components/JobCardExpanded/JobCardExpanded";
import BackBtn from "../../components/BackBtn/BackBtn";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import { set } from "react-hook-form";
import { jobAPI, userAPI } from "../../api/axios";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";


import JobInvite from "../../components/JobInvite/JobInvite";

export default function JobInviteSection({userType}) {
    const link_data = useParams();
    console.log("received from url", link_data)
    const COMPANYID = (userType==="employer"?getStorage("userID"):(link_data.company_id?link_data.company_id: getStorage("guestUserID")));
    const receivedData = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({'type': userType});
    console.log("received data",receivedData)
    //const [selectedEntry, setEntry] = useState(null);
    const [selectedEntry, setEntry] = useState(receivedData["state"]?receivedData.state.highlightedId || null: (link_data.job_id?Number(link_data.job_id):null));//userData is for knowing if employer or seeker and further passing it down to components
    //console.log("selected entry", selectedEntry);
    const [searchVal, setSearch] = useState("");
    //demoInfo is example vacancy profiles
    const [jobVacancies, setJobVacancies] = useState([]);
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
    const profileInfo = [{ applicantID: 1,candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 2,candidateName: "Galvin Serie", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 3,candidateName: "Cole Nicol", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 4,candidateName: "Salvin Drone", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 5,candidateName: "Sepen Zen", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 6,candidateName: "Zeke John", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 7,candidateName: "Keire Helen", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 8,candidateName: "Karen Laneb", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2},
                      { applicantID: 9,candidateName: "Javan Dille", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2} 
                    ]


    
    const [filterstat, setFilter] = useState(false);
    const [filterparam, setParam] = useState({});
    //const filtered = (jobVacancies.length!=0?jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length?id:false):[]);
    let filtered = (jobVacancies.length!=0?(searchVal.startsWith("#")?/*search with # to search with tags*/jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(searchVal.slice(1).toLowerCase()))).filter(Boolean).length?id:false)/*search with # to search with tags*/:/*search without # to search with name*/jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).startsWith(searchVal.toLowerCase()))/*search without # to search with name*/):[]);

    //const filtered = []
    const [selectedJobEntry,setJobEntry] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const [companyRequests, setCompanyRequests] = useState([]);
    //const [filteredApplicants, setfilteredApplicants]=useState(profileInfo.filter(applicants=>(selectedJobEntry["applicationsReceived"].includes(applicants["applicantID"])?applicants:false)));
    const [sidebarState, setSideBar] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState(null);
    const [inviteResponse, setInviteResponse] = useState(null);
    const callJobVacancyAPI= async (companyId)=>{
        
        try {
            

            const response = await (userType==="employer" ? jobAPI.get(`/job_vacancy/company`, {headers:{'Authorization': `Bearer ${getStorage("userToken")}`}}): jobAPI.get(`/job_vacancy/company/${companyId}`));
            console.log("received job response", response)
            const invite_response = await jobAPI.get('/job_invite/company', { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
            console.log("update job invites", invite_response);
            const mod_response = response.data.map(e=>({id: e.job_id, jobTitle: e.job_name, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1],e.salary.split('-')[2]], postDate: e.created_at.split('T')[0] , last_date: e.last_date.split('T')[0], location: e.location, poi: e.job_position, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc ,jobReq:e.requirement,skills: e.skills.length?e.skills: [{'skill': ""}], applicationsReceived: e.job_seekers}))
            setJobVacancies(mod_response);
            console.log(" after new job vacancies", mod_response);
            const prereq_response = await Promise.all(response.data.map(vacancy => vacancy.job_seekers.filter(user => user.user_id === receivedData.state.user_id).map(user => {
                return {
                    // List only the keys you want to retain
                    job_vacancy_id: user.job_id, job_status: user.status, job_request_id: user.id, type: "request"
                    // Add other keys you want to retain
                };
            })).flat()); // Flatten the array to get a single array of users
      
          // Wait for all job details promises to resolve
          const new_invite_response = await Promise.all(
            invite_response.data.map(async (e) => {if(e.user_id == receivedData.state.user_id)
              {const jobDetails = { job_vacancy_id: e.job_id, invite_status: e.status, job_invite_id: e.id, type: "invite" };
              return jobDetails;}
            })
          );
            const update_response = [...prereq_response,...new_invite_response].filter(Boolean);
            console.log("updated_response", update_response, new_invite_response,receivedData.state.user_id)
            setUserJobs(update_response);
            
            
            console.log("filtered", filtered);
        } catch (e) {
            console.log("jobs failed", e)
            
            alert(e.message);
        }
    }
    
    const handleClick = (delay, callFunction) => {
        setTimeout(() => {
            callFunction()
        }, delay);
    };

    const refreshInvite = () => {
        setEntry(null);
        setJobEntry(null);
        callJobVacancyAPI();
    }
    const makeShift=()=>{
        console.log("refreshed page")
        window.location.reload();
    }
        
    console.log("user in compnay", userJobs);
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

    const handleApplicationStatus = (appData)=>{
        console.log("application data received", appData)
        if(appData.application_type=="request" && appData.application_status=="rejected")setDeleteRequest(appData.application_id);
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

    const deleteJobRequestAPI = async (job_request_id) => {
        try {
          const r = await jobAPI.delete(`/job_request/${job_request_id}`, { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
          await callJobVacancyAPI();
          setEntry(null);
          console.log("successfully deleted", job_request_id)
          return true;
        } catch (e) {
          console.log("job request deletion failed", e);
          alert(e.message);
          return false;
        }
      };

    const sentInvite = async (finalData)=>{
        
        console.log("final data", finalData)
        const req_data = {
                                "job_id": finalData.id,
                                "user_id": finalData.user_id,
                                "recruiter_name": finalData.recruiter_name,
                                "recruiter_position": finalData.recruiter_position,
                                "remarks": finalData.remarks
                            }
        console.log("job status data", req_data)
        try {
            if(deleteRequest){
            const n = await deleteJobRequestAPI(deleteRequest);
            if(!n)throw new Error("Failed to Delete Rejected Application")};
            const response = await jobAPI.post(`/job_invite/`, req_data, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }         
                });
            setDeleteRequest(null);
            console.log("updated response", response)
            setInviteResponse("sent");
            //const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))
            handleClick(1000, refreshInvite);
            
        } catch (e) {
            setInviteResponse("failed");
            
            console.log("failed to sent invite", e)
            
            alert(e.message);
            handleClick(1000, makeShift);
        }

    }
    //console.log("filtered applicants",filteredApplicants);
    useEffect(() => {callJobVacancyAPI(COMPANYID)
    }, []);//only runs during initial render
    useEffect(()=>{setInviteResponse("");
        if(selectedEntry==null)
        {setEntry(null)
         setJobEntry(null)
         
        }
        else{
            //setJobEntry(jobVacancies[selectedEntry]);
            console.log("came here", jobVacancies)
            if(jobVacancies.length!=0)
            {expJob(selectedEntry);
            console.log("job entry refreshed", jobVacancies)}
        }},[jobVacancies])
    useEffect(()=>{if(jobVacancies.length!=0 && selectedEntry!=null){
        
        expJob(selectedEntry);}},[selectedEntry]);
    
    useEffect(()=>{if(companyRequests==true)callCompanyInvitesAPI, [companyRequests]})
    
    /*const resultGen=()=>{
        
            let result = demoInfo.filter(id => id["skills"].map((tag)=>(tag.includes(searchVal))).filter(Boolean).length?id:false)
            //console.log(result)
            setFilter(result);
        
        
        //console.log(typeof(searchVal))
        

    }
    useEffect(() => resultGen, [searchVal])
    */
    //console.log(`search=${searchVal}`);
    //console.log(filtered)
    //const result = demoInfo.filter((profiles) => profiles["tags"].map((tag)=>(tag.includes(searchVal))).filter(Boolean).length?profiles:null)
    //console.log(result)
    //const tags = [{"skills": ["hello", "hil", "how"]}, {"skills": ["helo", "hi", "how"]}, {"skills": ["kioo", "ka", "how"]},]
    //const newtags = tags.filter(id => id["skills"].map((tag)=>(tag.includes(searchVal))).filter(Boolean).length?id:false)
    //console.log(newtags)
    //console.log(searchVal);

    
    //console.log(`search=${searchVal}`);
   
    return (
        <div id="page" >
            <div className={`review-left-bar${sidebarState?" wide":""}`}>
                {sidebarState?
                <>
                <JobCardExpanded data={selectedJobEntry} userData={userData}/>
                <div className="back-button-review" onClick={()=>setSideBar(false)}><BackBtn outlineShape={"square"} butColor={"white"}/></div>
                </>
                :
                <OpeningsListBar data={filtered} userType={userType} userID={COMPANYID} userJobs={userJobs} pageType={"invite"} chooseEntry={chooseEntry} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} handleApplicationStatus={handleApplicationStatus} filterFunc={filterStateSet} />
                }
            </div>
            {filterstat?
            <div className="filter enabled">
                <Filter title="Filter" passFilteredDataFn={filterDataSet}/>
            </div>
            :
            <></>
            }
            <NavigationBar />
            <div className={`candidate-invite-box${filterstat?" blur":""}${sidebarState?" wide":""}`}>
            
                
                
                    
                    <JobInvite data={receivedData.state} jobData={selectedJobEntry}  userData={userData} sentInvite={sentInvite} inviteResponse={inviteResponse}/>                    
                
            
            </div>
        </div>
    )
}