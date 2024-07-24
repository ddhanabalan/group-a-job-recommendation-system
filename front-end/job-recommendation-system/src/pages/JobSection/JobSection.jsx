import './JobSection.css'
import { useState, useEffect } from 'react';
import getStorage from '../../storage/storage';
import { jobAPI, userAPI } from '../../api/axios';
import Filter from "../../components/Filter/Filter";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Jobs from "../../components/Jobs/Jobs";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import BackBtn from '../../components/BackBtn/BackBtn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from '@mui/material';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';

export default function JobSection() {
    const [loading, SetLoading] = useState(true)
    const [userData, setUserData] = useState({ 'type': 'seeker', 'id': Number(getStorage("userID")), 'skills': [] });
    const [jobVacancies, setJobVacancies] = useState([]);
    const [searchVal, setSearch] = useState("");
    const [filterparam, setParam] = useState({});
    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => id["skills"].map((tag) => (tag["skill"].toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length ? id : false) : []);
    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).includes(searchVal.toLowerCase())?id:false): [])
    const [descriptionOn, setDesc] = useState(false);
    const [userInvites, setUserInvites] = useState([]);
    const [AiJobs, setAiJobs] = useState([]) //state to store recommended jobs
    const [aiBtnloading, setAiBtnLoading] = useState(false);//state to control animation of ai button
    

    const filterDataSet = (fdata) => {
        setParam({ ...fdata });
    }
    console.log("filter", filterparam);
    function OpenDesc(desc_state) {
        setDesc(desc_state);
        //console.log("description status job section", desc_state);
    }
    const searchBar = (searchValue) => {
        setSearch(searchValue);
    }
    const callJobVacancyAPI = async () => {
        
        try {
            await Promise.all([GetSeekerSkills()]);
            const response = await jobAPI.get('/job_vacancy/',
                {
                    params: searchVal!=""?{"title": searchVal, ...filterparam }:{...filterparam},
                    paramsSerializer: params => {
                        // Custom params serializer if needed
                        return Object.entries(params).map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return value.map(val => `${key}=${encodeURIComponent(val)}`).join('&');
                            }
                            return `${key}=${encodeURIComponent(value)}`;
                        }).join('&');
                    }
                }).then(SetLoading(false))
            const mod_response = dataNormalizer(response.data);
            setJobVacancies(mod_response);
            console.log(response);
            console.log(" after new job vacancies", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {

            console.log("jobs failed", e);
            alert(e.message);
        }
    }
    const callModelAPI = async () => {  //function to get recommended jobs
        setAiBtnLoading(true)
        try {
            const response = await modelAPI.get('/model/seeker', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("model response", response)
            const mod_response = dataNormalizer(response.data)
            setAiJobs(mod_response)
            setAiBtnLoading(false)
        } catch (e) {
            console.log("model response", e)

            alert(e.message);
        }
    }


    const dataNormalizer=(objectList)=>{
        const normalized_response = objectList.map(e => {
            const salaryParts = e.salary.split('-');
            const createdDateParts = e.created_at.split('T');
            const lastDateParts = e.last_date.split('T');
            const inviteStat = userInvites.length?getInviteStatus(e.job_id):null;
            console.log("invite stat", inviteStat, userInvites)
            return {
              id: e.job_id,
              companyID: e.company_id,
              jobTitle: e.job_name,
              companyUsername: e.company_username,
              companyName: e.company_name,
              tags: /* (e.tags.length ? e.tags : */ [{ tag: "" }], // Keeping the comment
              currency: salaryParts.length > 0 ? salaryParts[0] : "",
              salary: salaryParts.length > 2 ? [salaryParts[1], salaryParts[2]] : (salaryParts.length === 2 ? [salaryParts[1], ""]:["", ""]),
              postDate: createdDateParts.length > 0 ? createdDateParts[0] : e.created_at,
              last_date: lastDateParts.length > 0 ? lastDateParts[0] : e.last_date,
              location: e.location,
              empType: e.emp_type,
              exp: e.experience,
              jobDesc: e.job_desc,
              jobReq: e.requirement,
              skills: e.skills.length ? e.skills : [{ skill: "" }],
              workStyle: e.work_style,
              workingDays: e.working_days,
              closed: e.closed,
              applicationsReceived: e.job_seekers,
              userApplication: ((((e.job_seekers).map(e => e.user_id)).includes(userData.id))?((e.job_seekers).filter(e => e.user_id == userData.id)):null),
              invite_status: inviteStat?inviteStat.status:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.status || null: null*/, 
              job_invite_id: inviteStat?inviteStat.id:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.id || null: null*/
            };
          });
          return normalized_response;

    }
    const duplicatesFilter=()=>{
        const originals = jobVacancies.filter(e=>{!(AiJobs.map(job=>job.id).includes(e.id))})
        setJobVacancies(originals);
    }
    const callModelAPI = async () => {  //function to get recommended jobs
        setAiBtnLoading(true)
        try {
            const response = await modelAPI.get('/model/seeker', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("model response", response)
            const mod_response = dataNormalizer(response.data)
            if(mod_response && !mod_response.length){
                setBlankModelData(true)
            }
            else{
                setBlankModelData(false)
            }
            setAiJobs(mod_response)
            setAiBtnLoading(false)
            return true;
        } catch (e) {
            console.log("model response", e)

            alert(e.message);
            return false;
        }
    }


    const dataNormalizer=(objectList)=>{
        const normalized_response = objectList.map(e => {
            const salaryParts = e.salary.split('-');
            const createdDateParts = e.created_at.split('T');
            const lastDateParts = e.last_date.split('T');
            const userCreatedApplications = ((((e.job_seekers).map(e => e.user_id)).includes(userData.id))?((e.job_seekers).filter(e => e.user_id == userData.id)):null);
            const applicationCheckDummy = userCreatedApplications?.map(e=>e.status.toLowerCase()) || [];                                                                     //will have to verify logic
            const inviteStat = userInvites.length?(!(applicationCheckDummy.includes("approved"))?getInviteStatus(e.job_id):null):null;                                       //will have to verify logic
            console.log("invite stat", inviteStat, userInvites)
            return {
              id: e.job_id,
              companyID: e.company_id,
              jobTitle: e.job_name,
              companyUsername: e.company_username,
              companyName: e.company_name,
              tags: /* (e.tags.length ? e.tags : */ [{ tag: "" }], // Keeping the comment
              currency: salaryParts.length > 0 ? salaryParts[0] : "",
              salary: salaryParts.length > 2 ? [salaryParts[1], salaryParts[2]] : (salaryParts.length === 2 ? [salaryParts[1], ""]:["", ""]),
              postDate: createdDateParts.length > 0 ? createdDateParts[0] : e.created_at,
              last_date: lastDateParts.length > 0 ? lastDateParts[0] : e.last_date,
              location: e.location,
              empType: e.emp_type,
              exp: e.experience,
              jobDesc: e.job_desc,
              jobReq: e.requirement,
              skills: e.skills.length ? e.skills : [{ skill: "" }],
              workStyle: e.work_style,
              workingDays: e.working_days,
              closed: e.closed,
              applicationsReceived: e.job_seekers,
              userApplication: userCreatedApplications,
              invite_status: inviteStat?inviteStat.status:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.status || null: null*/, 
              job_invite_id: inviteStat?inviteStat.id:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.id || null: null*/
            };
          });
          return normalized_response;

    }
    const duplicatesFilter=()=>{
        const test = AiJobs.map(job=>job.id)
        const originals = jobVacancies.filter(e=>!(AiJobs.map(job=>job.id).includes(e.id)))
        console.log("originals", originals, test, jobVacancies, AiJobs)
        setJobVacancies(originals);
    }
    const callModelAPI = async () => {  //function to get recommended jobs
        setAiBtnLoading(true)
        try {
            const response = await modelAPI.get('/model/seeker', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("model response", response)
            const mod_response = dataNormalizer(response.data)
            setAiJobs(mod_response)
            setAiBtnLoading(false)
        } catch (e) {
            console.log("model response", e)

            alert(e.message);
        }
    }


    const dataNormalizer=(objectList)=>{
        const normalized_response = objectList.map(e => {
            const salaryParts = e.salary.split('-');
            const createdDateParts = e.created_at.split('T');
            const lastDateParts = e.last_date.split('T');
            const userCreatedApplications = ((((e.job_seekers).map(e => e.user_id)).includes(userData.id))?((e.job_seekers).filter(e => e.user_id == userData.id)):null);
            const applicationCheckDummy = userCreatedApplications?.map(e=>e.status.toLowerCase()) || [];                                                                     //will have to verify logic
            const inviteStat = userInvites.length?(!(applicationCheckDummy.includes("approved"))?getInviteStatus(e.job_id):null):null;                                       //will have to verify logic
            console.log("invite stat", inviteStat, userInvites)
            return {
              id: e.job_id,
              companyID: e.company_id,
              jobTitle: e.job_name,
              companyUsername: e.company_username,
              companyName: e.company_name,
              tags: /* (e.tags.length ? e.tags : */ [{ tag: "" }], // Keeping the comment
              currency: salaryParts.length > 0 ? salaryParts[0] : "",
              salary: salaryParts.length > 2 ? [salaryParts[1], salaryParts[2]] : (salaryParts.length === 2 ? [salaryParts[1], ""]:["", ""]),
              postDate: createdDateParts.length > 0 ? createdDateParts[0] : e.created_at,
              last_date: lastDateParts.length > 0 ? lastDateParts[0] : e.last_date,
              location: e.location,
              empType: e.emp_type,
              exp: e.experience,
              jobDesc: e.job_desc,
              jobReq: e.requirement,
              skills: e.skills.length ? e.skills : [{ skill: "" }],
              workStyle: e.work_style,
              workingDays: e.working_days,
              closed: e.closed,
              applicationsReceived: e.job_seekers,
              userApplication: userCreatedApplications,
              invite_status: inviteStat?inviteStat.status:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.status || null: null*/, 
              job_invite_id: inviteStat?inviteStat.id:null/*userInvites.length?userInvites.filter(f=>f.job_id == e.job_id)[0]?.id || null: null*/
            };
          });
          return normalized_response;

    }
    const duplicatesFilter=()=>{
        const test = AiJobs.map(job=>job.id)
        const originals = jobVacancies.filter(e=>!(AiJobs.map(job=>job.id).includes(e.id)))
        console.log("originals", originals, test, jobVacancies, AiJobs)
        setJobVacancies(originals);
    }
    /*
    const GetSeekerDetails = async () => {

        try {
            const response = await userAPI.get('/seeker/details', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("resp dat", response)
            setUserData({ ...userData, 'id': response.data.length!=0?response.data[0].user_id :  Number(getStorage("userID")) })
  

        }
        catch (e) {
            console.log("user req failed", e);
        }
    }
    */
    const getInviteStatus = (jobId) => {
        const invite = userInvites.filter(f => f.job_id == jobId);
        let index = 0;
        if(invite.length)
            {//console.log("logged invite job", invite[0].invite_status);
                const r = invite.map(e=>e.status?e.status.toLowerCase():null);
                //console.log("registered invites", inviteJob, r, data.id)
                
                if(/*r.includes("rejected") && */r.includes("pending"))
                {
                    index = r.lastIndexOf("pending");
                }
            //console.log("invite job", index)
            }
        console.log("userInvites", userInvites, "and", jobId)
        return invite.length?invite[index]: null;
      };
    const GetUserInvites = async () => {
        try{
            const response = await jobAPI.get('/job_invite/user',{
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("response of user invites", response)
            setUserInvites(response.data);
        }
        catch(e){
            console.log("failed to fetch user invites", e)
        }
    }
    const GetSeekerSkills = async () => {
        try {
            const response = await userAPI.get('/seeker/skill', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("skills received", response.data)
            setUserData({ ...userData, 'id': response.data.length!=0?response.data[0].user_id :  Number(getStorage("userID")), 'skills': response.data?response.data: [] })

        }

        catch (e) {
            

            console.log("skill error", e)
        }
        
    }

    const CreateJobRequest = async (jobId) => {
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
            callJobVacancyAPI();


        } catch (e) {
            console.log("jobs failed", e)

            alert(e.message);
        }
    }

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
            
            GetUserInvites();

        } catch (e) {

            console.log("failed to invite", e)

            alert(e.message);
        }
    

    }

    console.log("user datum", userData);
    useEffect(() => {if(descriptionOn)GetUserInvites()}, [descriptionOn])
    useEffect(() => { callJobVacancyAPI() }, [filterparam, searchVal, userInvites]);
    useEffect(() => {if(jobVacancies)duplicatesFilter()},[AiJobs])
    

    return (
        <div id="page">
            {loading && <LoaderAnimation />}
            <div className="job-filter">
                <Filter title="Filter jobs" userType="seeker" passFilteredDataFn={filterDataSet} />
            </div>
            {!descriptionOn && <NavigationBar active="jobs" />}
            <StatsAI value="jobs" />

            <div className="job-search">
                {descriptionOn ?
                    <div className="back-icon">
                        <IconButton aria-label="back" onClick={() => { OpenDesc(false) }} sx={{ display: "flex", alignItems: "center", borderRadius: "50%", backgroundColor: "white", width: 35, height: 35 }}>
                            <ArrowBackIosIcon sx={{ color: "black", position: "relative", left: "0.2rem" }} />
                        </IconButton>
                    </div>
                    :
                    <></>
                }
                <SearchBar toSearch="Search Jobs" onSearch={searchBar} />
            </div>
            <Jobs data={jobVacancies} modelData={AiJobs} createJobRequest={CreateJobRequest} dataToParentFn={OpenDesc} handleInvite={handleInvite} desc_state={descriptionOn} userData={userData} />
        </div>
    )
}