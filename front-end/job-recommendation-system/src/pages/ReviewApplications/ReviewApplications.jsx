import Lottie from "lottie-react";
import "./ReviewApplications.css";
import { getStorage } from "../../storage/storage";
import Filter from "../../components/Filter/Filter";
import OpeningsListBar from "../../components/OpeningsListBar/OpeningsListBar";
import JobCardExpanded from "../../components/JobCardExpanded/JobCardExpanded";
import BackBtn from "../../components/BackBtn/BackBtn";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import { jobAPI, userAPI } from "../../api/axios";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import noApplicationsFiller from "../../images/no-applications-found.json";
import careerGoLogo from "../../images/careergo_logo.svg";

export default function ReviewApplications({ userType, invite = null }) {
    const PROCESSING_DELAY = 1000;
    console.log("user is ", userType)
    const link_data = useParams();
    console.log("received from rl", link_data)
    const INVITE_ID = link_data?.invite_id || null;
    const COMPANY_USERNAME = link_data?.company_username || null;
    const [companyID, setCompanyID] = useState((userType === "employer" ? getStorage("userID") : (link_data.company_id ? link_data.company_id : null)));

    const receivedData = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ 'id': Number(getStorage("userID")),'type': userType, 'skills': [] });
    console.log("received data", receivedData)
    //const [selectedEntry, setEntry] = useState(null);
    const [loadingApplicants, setLoadingApplicants] = useState(false)
    const [selectedEntry, setEntry] = useState(receivedData["state"] ? receivedData.state.highlightedId || null : (link_data.job_id ? Number(link_data.job_id) : null));//userData is for knowing if employer or seeker and further passing it down to components
    //console.log("selected entry", selectedEntry);
    const [searchVal, setSearch] = useState("");
    const [applicationFilter, setApplicationFilter] = useState({"Applied": false, "Invited": false, "Rejected": false, "Approved": false})
    //demoInfo is example vacancy profiles
    const [jobVacancies, setJobVacancies] = useState([]);
    const [jobApplicants, setApplicants] = useState([]);
    const [processing, setProcessing] = useState(false);
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
    const profileInfo = [{ applicantID: 1, candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 2, candidateName: "Galvin Serie", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 3, candidateName: "Cole Nicol", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 4, candidateName: "Salvin Drone", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 5, candidateName: "Sepen Zen", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 6, candidateName: "Zeke John", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 7, candidateName: "Keire Helen", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 8, candidateName: "Karen Laneb", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 },
    { applicantID: 9, candidateName: "Javan Dille", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 }
    ]



    const [filterstat, setFilter] = useState(false);
    const [filterparam, setParam] = useState({});
    let filtered = (jobVacancies.length!=0?(searchVal.startsWith("#")?/*search with # to search with tags*/jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(searchVal.slice(1).toLowerCase()))).filter(Boolean).length?id:false)/*search with # to search with tags*/:/*search without # to search with name*/jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).startsWith(searchVal.toLowerCase()))/*search without # to search with name*/):[]);
    const [filteredApplicants, setFilteredApplicants] = useState([])
    const [invitesSent, setInvitesSent] = useState([]);
    let invitesReceived = [];
    let dateVariable = "";
    //const filtered = []
    const [selectedJobEntry, setJobEntry] = useState(null);
    //const [filteredApplicants, setfilteredApplicants]=useState(profileInfo.filter(applicants=>(selectedJobEntry["applicationsReceived"].includes(applicants["applicantID"])?applicants:false)));
    const [sidebarState, setSideBar] = useState(false);
    const [applicationErrors, setApplicationErrors] = useState(false);
    const [inviteNotFoundError, setInviteNotFoundError] = useState(false);
    const callJobVacancyAPI = async (companyId) => {
        
        try {
            
            if (userType == "seeker") {
                await Promise.all([GetSeekerSkills(), FetchInviteDetails()]);
                
            }
            
            const response = await (userType === "employer" ? jobAPI.get(`/job_vacancy/company`, { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } }) : jobAPI.get(`/job_vacancy/company/${companyId}`));
            //const second_response = await jobAPI.get(`/job_vacancy/company/${companyId}`)
            console.log("received job response", response)
            
            const rec_response = response.data.map(e => ({ id: e.job_id, jobTitle: e.job_name, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1], e.salary.split('-')[2]], postDate: e.created_at, last_date: e.last_date, location: e.location, poi: e.job_position, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc, jobReq: e.requirement, skills: e.skills.length ? e.skills : [{ 'skill': "" }], applicationsReceived: e.job_seekers, closed: e.closed }))
            const mod_response = dateProcessor(rec_response, "vacancy");
            if(userType=="seeker")
            {   const invites = invitesReceived.map(e=>e.job_vacancy_id);
                const new_mod_response = mod_response.map(e => {
                    
                    const userApplication = e.applicationsReceived.filter(app => app.user_id === userData.id);
                    const application = userApplication.find(app => app.status !== "rejected");
                    return {
                            ...e,
                            userApplication: userApplication.length > 0 ? userApplication : null,
                            status: application ? (application.status !== "rejected" ? application.status : null) : null,
                            userInvited: invites.includes(e.id) && invitesReceived[invites.indexOf(e.id)].job_status !== "rejected",
                            invite: invites.includes(e.id) && invitesReceived[invites.indexOf(e.id)].job_status !== "rejected"? invitesReceived[invites.indexOf(e.id)]: null
                    };
                });
                console.log("new mod rep", new_mod_response, invites, invitesReceived)
            setJobVacancies(new_mod_response);
            }
            else if(userType==="employer"){
            setJobVacancies(mod_response);
            }
            console.log(response);
            console.log(" after new job vacancies", mod_response);
            console.log("filtered", filtered);
            
        } catch (e) {
            console.log("jobs failed", e )

            alert(e.message);
        }
    }


    const DeleteJobAPI = async (job_id) => {
        try {

            const response = await jobAPI.delete(`job_vacancy/${job_id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            callJobVacancyAPI(companyID);
            setEntry(null);
            console.log("deleted successfully", job_id, "resp: ", response)
        }
        catch (e) {

            console.log("error", e)
            alert(e.message)

        }

    }

    const statusFilter=()=>{
        console.log("exec status", applicationFilter, "growing job appli", jobApplicants)
        const filteredApplicants = jobApplicants.filter(applicant => {
            // Filter keys where the value is true
            const activeFilters = Object.keys(applicationFilter).filter(key => applicationFilter[key]).map(f=>f.toLowerCase());
            // Check if the applicant's job_status is in the active filters
            console.log("active filters", activeFilters)
            if(activeFilters.length){
                if(activeFilters.includes("invited") && applicant.application_type=="invite")return applicant;
                else return (applicant.application_type=="request" && activeFilters.includes(applicant.job_status.toLowerCase()));  
            }
            else return applicant;
        });
        console.log("filtered appli", filteredApplicants)
        setFilteredApplicants(filteredApplicants)
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

    const GetSeekerSkills = async () => {
        try {
            const response = await userAPI.get('/seeker/skill', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("skills", response)
            setUserData({ ...userData, 'id': response.data.length != 0 ? response.data[0].user_id : Number(getStorage("userID")), 'skills': response.data ? response.data : [] })

            //console.log("skills received", response.data)
            // setUserData({'id': response.data?.user_id || Number(getStorage("userID")), 'type': 'seeker', 'skills': response.data})

        }

        catch (e) {
            console.log("skill error", e)
        }
        console.log("user datum", userData);
    }

    const CreateJobRequest = async (jobId) => {
        processDelay(true)
        try {
            const response = await jobAPI.post('/job_request/', {
                "job_id": Number(jobId),
                "status": "Applied"
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );
            console.log("successfully created job request");
            console.log(response);
            callJobVacancyAPI(companyID);


        } catch (e) {
            console.log("jobs failed", e)

            alert(e.message);
        }
        finally{
            processDelay(false)
        }
    }

    const RequestJobApplications = async (applicantList, selectedJobEntry=null) => {
        setLoadingApplicants(true);
        if(applicantList)
        {//const modApplicantList = applicantList.map(e => e.user_id)
        const inviteApplicants = [...new Set(invitesSent.filter(e => e.job_id == selectedEntry).map(f => ({ user_id: f.user_id, job_id: f.job_id, invite_id: f.id, status: f.status, created_at: f.created_at })))];
        //const inviteApplicantList = inviteApplicants.map(e=>e.user_id)
        console.log("all invites", invitesSent)
        console.log("applicant listing", applicantList)
        //console.log("invites received", inviteApplicantList)

        //console.log("appli list", modApplicantList)
        try {
            const requests = await userAPI.post('/seeker/details/list', { "user_ids": applicantList.map(e => e.user_id) }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const invites = await userAPI.post('/seeker/details/list', { "user_ids": inviteApplicants.map(e=>e.user_id) }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("updating invites",invites.data, invitesSent)
            console.log("updating requests", requests.data, applicantList, selectedJobEntry)
            const mod_response = await Promise.all(requests.data.map(e => ({ applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name, city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture, job_request_id: applicantList[requests.data.indexOf(e)].id, job_status: applicantList[requests.data.indexOf(e)].status.toLowerCase(), application_created_at: applicantList[requests.data.indexOf(e)].created_at,application_type: "request" })))
            const invite_response = await Promise.all(invites.data.map(e => ({ applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name, city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture, job_vacancy_id: /*inviteApplicantList[invites.data.indexOf(e)].job_id*/inviteApplicants[invites.data.indexOf(e)].job_id, job_invite_id: inviteApplicants[invites.data.indexOf(e)].invite_id,job_status: inviteApplicants[invites.data.indexOf(e)].status.toLowerCase(), application_created_at: inviteApplicants[invites.data.indexOf(e)].created_at, application_type: "invite"  })))
            const final_response = dateProcessor([...mod_response, ...invite_response]);
            //const test_response = dateTesterFunction(final_response);
            setApplicants(final_response);
            setApplicationErrors(false);
            console.log("applicants receiveed", final_response , mod_response, invite_response);

        } catch (e) {
            alert(e.response.data.detail + "!!!.....Hmm.");
            console.log("applicants failed", e)
            setApplicationErrors(true);
        }}
         
       // handleClick(3000, setLoadingApplicants, false)    //Only for testing purposes.Comment after loading verification.Uncomment bottom line
        setLoadingApplicants(false)
    }

    const editJobVacancyStatusAPI = async (rec_data, closed) => {
        console.log("data for closure ", rec_data)
        const update_data = {"company_id": companyID,
                                "company_name": rec_data.companyName,
                                "emp_type": rec_data.empType,
                                "salary": rec_data.currency + "-" + ((rec_data.salary[1]==="")?rec_data.salary[0]:rec_data.salary.join("-")),
	                            "working_days": rec_data.workingDays,
                                "work_style": rec_data.workStyle,
                                "experience": rec_data.exp,
                                "job_name": rec_data.jobTitle,
                                "job_position": rec_data.poi,
                                "location": rec_data.location,

                                "job_desc": rec_data.jobDesc,
                                
                                "requirement": rec_data.jobReq,
                                "last_date": rec_data.last_date,
                                
                                "skills": [],
                                'skills_delete':[],
                                "closed": closed,
                            }
        
        try {
            
          
                console.log("updating data", update_data)
                const response = await jobAPI.put(`/job_vacancy/${rec_data.id}`, update_data, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }         
                }
                
                );
                await callJobVacancyAPI();
                
            
            

        } catch (e) {
            console.log(e)

            alert(e.message)
            
        }
    }

    const getCompanyDetails = async (username) =>{
        try{
            const response = await userAPI.get(`/profile/${username}`)
            console.log("response for company details", response.data)
            setCompanyID(response.data.user_id);

        }
        catch (e){
            console.log("failed to fetch company id", e);
            alert(e);
        }
    }

    const FetchInviteDetails = async() =>{
        try{
            const invite_response = await jobAPI.get('/job_invite/user', { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
                console.log("update job invites", invite_response);
                let inviteFound = false;
                const new_invite_response = await Promise.all(
                    invite_response.data.map(async (e) => {
                      const jobDetails = { job_vacancy_id: e.job_id, job_status: e.status, job_invite_id: e.id, type: "invite" };
                      if((e.id) === Number(INVITE_ID) && invite===true) {
                        console.log("matched invite", e.job_id, e.company_id, e.id, e.user_id)
                        setEntry(e.job_id);
                        setCompanyID(e.company_id);
                        inviteFound = true;
                      }
                      return jobDetails;
                    })
                );

                if(inviteFound===false && invite===true) setInviteNotFoundError(true);
            invitesReceived= new_invite_response;
            console.log("invites came", invitesReceived)
        }
        catch(e){
            console.log("failed to fetch user invites", e);
            alert(e);
        }
    }

    const callCompanyInvitesAPI = async ()=>{
        try{
            const invite_response = await jobAPI.get('/job_invite/company', { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
            console.log("update job invites", invite_response);
            setInvitesSent([...invite_response.data]);
        }
        catch (e) {

            console.log("fetching company invites failed", e)

            alert(e.message);
        }
    }

    const jobApprovalAPI = async (job_req_id, job_status, user_id) => {
        const req_data = {
            "status": job_status,
        }
        console.log("job status data", req_data)
        try {
            /*const checkInvite = filteredApplicants.filter(e=>(e.applicantID === user_id && e.application_type ==="invite"));                    //uncomment if issues faced with approval or status display in job section
            console.log("checkInvite", checkInvite, filteredApplicants)
            if(checkInvite.length) {
                const r = await removeInvite(checkInvite[0].job_invite_id);
                if(!r) throw new Error("Failed to delete rejected invite");
            }*/
            const response = await jobAPI.put(`/job_request/${job_req_id}`, req_data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            console.log("updated response", response)
            //const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))
            callJobVacancyAPI(companyID);

        } catch (e) {

            console.log("failed to sent approval status", e)

            alert(e.message);
        }
    }

    const removeInvite=async(job_invite_id)=>{
      
        
        
        try {
            const response = await jobAPI.delete(`/job_invite/${job_invite_id}`,  {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            console.log("updated response", response)
            //const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, candidateName: (e.first_name + " " + e.last_name), first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))
            await callCompanyInvitesAPI();
            return true;
        } catch (e) {

            console.log("failed to delete invite", e)

            alert(e.message);
            return false;
        }
    

    }

    const handleInvite=async(status, job_invite_id)=>{
        processDelay(true)
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
            setJobVacancies([]);
            callJobVacancyAPI(companyID);

        } catch (e) {

            console.log("failed to invite", e)

            alert(e.message);
        }
        finally{
            processDelay(false);
        }

    }

    //console.log("applicants confirmed", jobApplicants)
    //console.log("sidebar", sidebarState)
    //console.log("filtered", filtered);
    const dateProcessor=(objectList, type="application")=>{
        let arranged=[]
        if(type==="vacancy")
        {
            objectList.sort((a, b) => {return Number(a.closed) - Number(b.closed) || b.postDate.localeCompare(a.postDate)}); 
            arranged = objectList.map((e)=>({...e, postDate: e.postDate.split('T')[0].split('-').reverse().join('-'), last_date: e.last_date.split('T')[0].split('-').reverse().join('-')}))

        }
        else{
        objectList.sort((a, b) => b.application_created_at.localeCompare(a.application_created_at)); 
        arranged = objectList.map((e)=>({...e, application_created_at: e.application_created_at.split('T')[0].split('-').reverse().join('-')}))
        }
        return arranged;
    }

    /*const dateTesterFunction=(objectList)=>{
        let date = 24
        const date_string = "-08-2024"
        const resp = objectList.map((e)=>{date -=1;
                                          return {...e, application_created_at: `${date}` + date_string}
         })
        return resp
    }*/

    const filterStateSet = (fstate) => {
        setFilter(fstate);
    }
    const filterDataSet = (fdata) => {
        setParam({ ...fdata });
    }
    //console.log("filter parameters", filterparam);
    const chooseEntry = (entry) => {
        //function for passing selected job opening card from child component to parent componenet
        setEntry(entry);
    }

    const handleApplicationFilter = (entry) => {
        //function for passing selected job opening card from child component to parent componenet
        setApplicationFilter(entry);
    }
    const searchBar = (searchValue) => {
        setSearch(searchValue);
    }
    const handleClick=(timeout, callFn, value=null)=>{
        setTimeout(() => {value?callFn(value):callFn()}, timeout);
    };

    const processDelay = (value)=>{
        if(value===true) setProcessing(true)
        else{
        setTimeout(() => {
          setProcessing(false)
        }, PROCESSING_DELAY);
      }
      }

    const expJob = (selection) => {
        //console.log("select", selection);
        console.log("selected job vacncyt after mod", jobVacancies, "selection", selection);
        const expEntry = jobVacancies.filter(e => (e["id"] === selection ? e : false));
        console.log("expEntry ", expEntry)
        if(expEntry.length)
        {setJobEntry(expEntry[0]);
        if (userData.type == "employer") console.log("yep done");
        if (expEntry[0].applicationsReceived)RequestJobApplications(expEntry[0].applicationsReceived);}

    }
    console.log("selected entry: ", selectedEntry, " selected job: ", selectedJobEntry);

    const listToDescParentFunc = () => {
        setSideBar(true);
    }
    //console.log("filtered applicants",filteredApplicants);
    useEffect(() => { if(!companyID)
                      { if(COMPANY_USERNAME){
                            
                            getCompanyDetails(COMPANY_USERNAME);
                        }
                        else if(INVITE_ID){
                            FetchInviteDetails(INVITE_ID);
                        }
                    }
                      
     }, []);//only runs during initial render

    useEffect(() =>{if(inviteNotFoundError===true)navigate("/profile")}, [inviteNotFoundError])
    useEffect(()=>{
                if(userType == "employer") {
                callCompanyInvitesAPI();}
                if(companyID){
                callJobVacancyAPI(companyID);}
                }, [companyID])
    useEffect(()=>{if(selectedJobEntry && selectedJobEntry.applicationsReceived)RequestJobApplications(selectedJobEntry.applicationsReceived)}, [invitesSent]);
    useEffect(() => {console.log("jobVacancies" , jobVacancies)
        if (selectedEntry == null) {
            setEntry(jobVacancies[0] ? jobVacancies[0].id : null)
            setJobEntry(jobVacancies[0] ? jobVacancies[0] : null)

        }
        else {
            //setJobEntry(jobVacancies[selectedEntry]);
            console.log("came here", jobVacancies)
            if (jobVacancies.length != 0) {
                expJob(selectedEntry);
                console.log("job entry refreshed", jobVacancies)
            }
        }
    }, [jobVacancies])
    console.log("app filter status", applicationFilter)
    useEffect(() => {if(selectedJobEntry && selectedJobEntry.applicationsReceived)RequestJobApplications(selectedJobEntry.applicationsReceived, selectedJobEntry)}, [selectedJobEntry])
    useEffect(() => {statusFilter()}, [applicationFilter, jobApplicants])
    useEffect(() => { if (jobVacancies.length != 0 && selectedEntry != null) 
        {setFilteredApplicants([]);                
        expJob(selectedEntry)} }, [selectedEntry]);

    return (
        <div id="page" >
            <div className={`review-left-bar${sidebarState ? " wide" : ""}`}>
                {sidebarState ?
                    <>
                        <JobCardExpanded data={selectedJobEntry} userData={userData} />
                        <div className="back-button-review" onClick={() => setSideBar(false)}><BackBtn outlineShape={"square"} butColor={"white"} /></div>
                    </>
                    :
                    <OpeningsListBar data={filtered} userType={userType} userID={companyID} pageType="review" chooseEntry={chooseEntry} searchBar={searchBar} listToDescParentFunc={listToDescParentFunc} preselectedEntry={selectedEntry} /*filterFunc={filterStateSet}*/ deleteJobFunc={DeleteJobAPI} editJobVacancyStatusFunc={editJobVacancyStatusAPI} invite={Number(link_data.job_id)} />
                }
            </div>
            {filterstat ?
                <div className="filter enabled">
                    <Filter title="Filter" passFilteredDataFn={filterDataSet} />
                </div>
                :
                <></>
            }
            <NavigationBar active={userType == "employer" ? "review-applications" : "none"} />
            <div className={`applications-box${filterstat ? " blur" : ""}${sidebarState ? " wide" : ""}`}>
                {userType == "employer" && jobApplicants.length != 0?
                <div className="application-filter">
                    {Object.keys(applicationFilter).map(e=>
                    <button className={`application-filter-btn application-filter-btn-apply application-filter-btn${applicationFilter[e]?`-active-${e.toLowerCase()}`: ""} application-filter-btn${"-" + e.toLowerCase()}`} onClick={()=>{handleApplicationFilter({...applicationFilter, [e]: !applicationFilter[e]})}}> {e}
                    </button>)
                    }  
                </div>
                :
                <></>
                }
                {userType == "employer" ?

                    (selectedEntry != null && filtered.length != 0 && filteredApplicants.length != 0 && !loadingApplicants?
                        
                        filteredApplicants.map(e => {
                                                const isDateDifferent = (dateVariable!==e.application_created_at)
                                                if(isDateDifferent)dateVariable=e.application_created_at
                                                 return (
                                                    <>
                                                    {
                                                        isDateDifferent &&
                                                        <div className="application-date-indicator"><p>{e.application_created_at}</p></div>
                                                    }
                                                    <CandidateCard type="review" 
                                                                   key={filteredApplicants.indexOf(e)} 
                                                                   reloadFn={RequestJobApplications} 
                                                                   applicantList={selectedJobEntry.applicationsReceived} 
                                                                   jobEntryId={selectedEntry} crLink={receivedData["pathname"]} 
                                                                   jobApprovalFunction={jobApprovalAPI} 
                                                                   removeInvite={removeInvite} 
                                                                   data={e} />
                                                    </>
                                                    )}
                                               )
                        :
                        (filtered.length == 0 ?
                            <div className="no-vacancies-message">
                                <img className="careergo-web-logo-rev-pg" src={careerGoLogo} />
                                <p>Find ideal candidates through CareerGo</p>
                            </div>
                            :
                            <div className="no-applications-message">
                                <Lottie className="no-applications-ani" animationData={noApplicationsFiller} loop={true} />
                                {loadingApplicants?<p>Loading Applications</p>:<p>No job applications found.</p>}
                            </div>
                        )
                    )
                    :
                    (selectedJobEntry != null && filtered.length != 0 ?
                        <JobCardExpanded data={selectedJobEntry} createJobRequest={CreateJobRequest} userData={userData} invite={selectedJobEntry.userInvited?true: null} handleInvite={handleInvite} applicationErrors={applicationErrors} processing={processing}/>
                        :
                        <></>
                    )
                }
                { }
            </div>
        </div>
    )
}