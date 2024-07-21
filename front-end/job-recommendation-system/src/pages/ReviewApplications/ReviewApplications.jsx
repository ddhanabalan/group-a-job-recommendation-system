import Lottie from "lottie-react";
import "./ReviewApplications.css";
import {getStorage} from "../../storage/storage";
import Filter from "../../components/Filter/Filter";
import OpeningsListBar from "../../components/OpeningsListBar/OpeningsListBar";
import JobCardExpanded from "../../components/JobCardExpanded/JobCardExpanded";
import BackBtn from "../../components/BackBtn/BackBtn";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import { jobAPI, userAPI } from "../../api/axios";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import noApplicationsFiller from "../../images/no-applications-found.json";
import careerGoLogo from "../../images/careergo_logo.svg";

export default function ReviewApplications({userType, invite=null}) {
    
    const link_data = useParams();
    console.log("received from url", link_data)
    const COMPANYID = (userType==="employer"?getStorage("userID"):(link_data.company_id?link_data.company_id: getStorage("guestUserID")));
    const receivedData = useLocation();
    const [userData, setUserData] = useState({'type': userType, 'skills': []});
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
    const filtered = (jobVacancies.length!=0?jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length?id:false):[]);
    
    //const filtered = []
    const [selectedJobEntry,setJobEntry] = useState(null);
    //const [filteredApplicants, setfilteredApplicants]=useState(profileInfo.filter(applicants=>(selectedJobEntry["applicationsReceived"].includes(applicants["applicantID"])?applicants:false)));
    const [sidebarState, setSideBar] = useState(false);
    const callJobVacancyAPI= async (companyId)=>{
        
        try {
            if(userType==="seeker")
            { 
            await Promise.all([GetSeekerSkills()]);
            }
            
            const response = await (userType==="employer" ? jobAPI.get(`/job_vacancy/company`, {headers:{'Authorization': `Bearer ${getStorage("userToken")}`}}): jobAPI.get(`/job_vacancy/company/${companyId}`));
            console.log("received job response", response)
            const mod_response = response.data.map(e=>({id: e.job_id, jobTitle: e.job_name, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1],e.salary.split('-')[2]], postDate: e.created_at.split('T')[0] , last_date: e.last_date.split('T')[0], location: e.location, poi: e.job_position, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc ,jobReq:e.requirement,skills: e.skills.length?e.skills: [{'skill': ""}], applicationsReceived: e.job_seekers}))
            setJobVacancies(mod_response);
            console.log(response);
            console.log(" after new job vacancies", mod_response);
            console.log("filtered", filtered);
        } catch (e) {
            console.log("jobs failed", e)
            
            alert(e.message);
        }
    }


    const DeleteJobAPI = async (job_id) =>{
        try{
            
            const response = await jobAPI.delete(`job_vacancy/${job_id}`, {
                                                                            headers:{
                                                                                'Authorization': `Bearer ${getStorage("userToken")}`
                                                                            }
                                                                          });
            callJobVacancyAPI(COMPANYID); 
            setEntry(null);
            console.log("deleted successfully", job_id, "resp: ", response)
        }
        catch(e){

            console.log("error", e)
            alert(e.message)

        }
        
    }
    
    /*const GetSeekerDetails = async ()=>{
        
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
    }*/

    const GetSeekerSkills = async ()=>{
        try{
            const response = await userAPI.get('/seeker/skill', {
                headers:{
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
        })
        console.log("skills", response)
        setUserData({ ...userData, 'id': response.data.length!=0?response.data[0].user_id :  Number(getStorage("userID")), 'skills': response.data?response.data: [] })

        //console.log("skills received", response.data)
        // setUserData({'id': response.data?.user_id || Number(getStorage("userID")), 'type': 'seeker', 'skills': response.data})
        
    }
    
        catch(e){
            console.log("skill error", e)
        }
        console.log("user datum", userData);
    }
    const CreateJobRequest= async (jobId)=>{
        try {
            const response = await jobAPI.post('/job_request/', {"job_id": Number(jobId),
                                                                 "status": "Applied"
                },
                {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }         
                }
            );
            console.log("successfully created job request");
            console.log(response);
            callJobVacancyAPI(COMPANYID);  
            
            
        } catch (e) {
            console.log("jobs failed", e)
            
            alert(e.message);
        }
    }

    const RequestJobApplications= async (applicantList)=>{
        const modApplicantList = applicantList.map(e=>e.user_id)
        
        console.log("appli list", modApplicantList)
        try {
            const response = await userAPI.post('/seeker/details/list', {"user_ids": modApplicantList}, {
                headers:{
                    'Content-Type': 'application/json'
                }         
                });
            console.log("updated response", response)
            const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture, job_request_id: applicantList[response.data.indexOf(e)].id, job_status: applicantList[response.data.indexOf(e)].status}))
            
            setApplicants(mod_response);
            console.log("applicants receiveed", mod_response);
            
        } catch (e) {
            
            console.log("applicants failed", e)
            
            alert(e.message);
        }
    }

    const jobApprovalAPI = async (job_req_id, job_status, user_id)=>{
        const req_data = {
                                "status": job_status,
                            }
        console.log("job status data", req_data)
        try {
            const response = await jobAPI.put(`/job_request/${job_req_id}`, req_data, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }         
                });
            console.log("updated response", response)
            //const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))
            
            
        } catch (e) {
            
            console.log("failed to sent approval status", e)
            
            alert(e.message);
        }
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
        if(expEntry[0].applicationsReceived)RequestJobApplications(expEntry[0].applicationsReceived);
        
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
         
        }
        else{
            //setJobEntry(jobVacancies[selectedEntry]);
            console.log("came here", jobVacancies)
            if(jobVacancies.length!=0)
            {expJob(selectedEntry);
            console.log("job entry refreshed", jobVacancies)}
        }},[jobVacancies])
    useEffect(()=>{if(jobVacancies.length!=0 && selectedEntry!=null)expJob(selectedEntry)},[selectedEntry]);
    
    return (
        <div id="page" >
            <div className={`review-left-bar${sidebarState?" wide":""}`}>
                {sidebarState?
                <>
                <JobCardExpanded data={selectedJobEntry} userData={userData}/>
                <div className="back-button-review" onClick={()=>setSideBar(false)}><BackBtn outlineShape={"square"} butColor={"white"}/></div>
                </>
                :
                <OpeningsListBar data={filtered} userType={userType} userID={COMPANYID} pageType="review" chooseEntry={chooseEntry} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} filterFunc={filterStateSet} deleteJobFunc={DeleteJobAPI} invite={Number(link_data.job_id)}/>
                }
            </div>
            {filterstat?
            <div className="filter enabled">
                <Filter title="Filter" passFilteredDataFn={filterDataSet}/>
            </div>
            :
            <></>
            }
            <NavigationBar active={userType=="employer"?"review-applications":"none"}/>
            <div className={`applications-box${filterstat?" blur":""}${sidebarState?" wide":""}`}>
            {userType=="employer"?
                
                (selectedEntry!=null && filtered.length!=0 && jobApplicants.length!=0?
                    
                    jobApplicants.map(e=><CandidateCard type="review" key={e.applicantID} jobEntryId={selectedEntry} crLink={receivedData["pathname"]} jobApprovalFunction={jobApprovalAPI} data={e}/>)
                    :
                    (filtered.length==0?
                        <div className="no-vacancies-message">
                            <img className="careergo-web-logo-rev-pg" src={careerGoLogo}/>
                            <p>Find ideal candidates through CareerGo</p>
                        </div>
                        :
                        <div className="no-applications-message">
                           <Lottie className="no-applications-ani" animationData={noApplicationsFiller} loop={true} />
                            <p>You haven't received any job applications.</p>
                        </div>
                    )
                )
                :
                (selectedJobEntry!=null && filtered.length!=0?
                    <JobCardExpanded data={selectedJobEntry} createJobRequest={CreateJobRequest} userData={userData} invite={selectedJobEntry.id==link_data.job_id?invite: null}/>
                    :
                    <></>
                )
            }
            {}
            </div>
        </div>
    )
}