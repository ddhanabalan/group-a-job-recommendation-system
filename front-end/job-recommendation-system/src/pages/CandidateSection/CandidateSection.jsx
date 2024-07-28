import Filter from "../../components/Filter/Filter";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Candidates from "../../components/Candidates/Candidates";
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import { useState, useEffect } from "react";
import {getStorage, removeStorage} from "../../storage/storage";
import { jobAPI, userAPI, modelAPI } from "../../api/axios";
import './CandidateSection.css';
import AiCandidates from "../../components/AiCandidates/AiCandidates";
export default function CandidateSection() {
    const [loading, SetLoading] = useState(true)
    const [userData, setUserData] = useState({ 'type': 'employer' });
    const [companyID, setCompanyID] = useState(getStorage("userID"));

    const [candidates, setCandidates] = useState([]);
    const [candidateSearchVal, setCandidateSearch] = useState("");
    const [jobSearchVal, setJobSearch] = useState("");
    const [filterparam, setParam] = useState({});
    const [selectedJobEntry, setJobEntry] = useState(null);//userData is for knowing if employer or seeker and further passing it down to components
    const [aiBtnloading, setAiBtnLoading] = useState(false);
    const [selectedJobEntryDetails, setJobEntryDetails] = useState(null);
    const [jobVacancies, setJobVacancies] = useState([]);
    const [aiCandidates, setAiCandidates] = useState([]);
    const [blankModelData, setBlankModelData] = useState(false);
    let filteredJobs = (jobVacancies.length!=0?(jobSearchVal.startsWith("#")?/*search with # to search with tags*/jobVacancies.filter(id => id["skills"].map((tag)=>(tag["skill"].toLowerCase().includes(jobSearchVal.slice(1).toLowerCase()))).filter(Boolean).length?id:false)/*search with # to search with tags*/:/*search without # to search with name*/jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).startsWith(jobSearchVal.toLowerCase()))/*search without # to search with name*/):[]);

    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => id["skills"].map((tag) => (tag["skill"].toLowerCase().includes(candidateSearchVal.toLowerCase()))).filter(Boolean).length ? id : false) : []);
    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).includes(candidateSearchVal.toLowerCase())?id:false): [])
    //const [descriptionOn, setDesc] = useState(false);

    const filterDataSet = (fdata) => {
        setParam({ ...fdata });
    }
    console.log("filter", filterparam);
    
    const candidateSearchBar = (candidateSearchValue) => {
        setCandidateSearch(candidateSearchValue);
    }
    const jobSearchBar = (jobSearchValue) => {
        setJobSearch(jobSearchValue);
    }
    const chooseJobEntry = (entry)=>{
        setJobEntry(entry);
    }
    const dataNormalizer = (objectList)=>{
        const normalized_data = objectList.map(e=>({applicantID: e.user_id, username: e.username, first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture})) || []
        console.log("normalized dta", normalized_data)
        return normalized_data
    }

    const duplicatesFilter=(data)=>{
        //console.log("data from filter",data)
        //const test = aiCandidates.map(candidate=>candidate.applicantID)
        const originals = candidates.filter(e=>!(data.map(candidate=>candidate.applicantID).includes(e.applicantID)))
        console.log("original candidates only", originals, candidates, data)
        if(originals.length)setCandidates(originals);
    }
    
    const callCandidatesAPI = async () => {
        SetLoading(true)
        try {
            const response = await userAPI.get('/seeker/details/list',
                {
                    params: candidateSearchVal != "" ? { "name": candidateSearchVal, ...filterparam } : { ...filterparam },
                    paramsSerializer: params => {
                        // Custom params serializer if needed
                        return Object.entries(params).map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return value.map(val => `${key}=${encodeURIComponent(val)}`).join('&');
                            }
                            return `${key}=${encodeURIComponent(value)}`;
                        }).join('&');
                    },
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                });
            //const mod_response = response.data.map(e => ({ id: e.job_id, jobTitle: e.job_name, companyName: e.company_name, tags: /*(e.tags.length ? e.tags : */[{ 'tag': "" }], currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1], e.salary.split('-')[2]], postDate: e.created_at.split('T')[0], last_date: e.last_date.split('T')[0], location: e.location, empType: e.emp_type, exp: e.experience, jobDesc: e.job_desc, jobReq: e.requirement, skills: e.skills.length ? e.skills : [{ 'skill': "" }], workStyle: e.work_style, workingDays: e.working_days, applicationsReceived: e.job_seekers }))
            const mod_response = dataNormalizer(response.data)
            setCandidates(mod_response);
            if(mod_response.length ){
                const r="current_candidate_element"
                
                 if(r){loadingDelay(200, scrollToItem, getStorage(r))
                removeStorage(r)}
            }
            SetLoading(false)
            console.log(response);
            //console.log(" after new candidates", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {

            console.log("candidates failed", e);
            alert(e.message);
        } finally {

            SetLoading(false)
        }
    }
    
      console.log("candidates", candidates)  
      
      const callAiCandidateFetch = async() =>{
          if(selectedJobEntryDetails){
            if(selectedJobEntryDetails.poi){
                const r =  await callModelAPI(selectedJobEntryDetails.poi)
                console.log("model calling response", r)
                if(!r) return false;
                else return true;
            }
          }
      }
      const callModelAPI = async (position) => {  //function to get recommended jobs
        setAiBtnLoading(true)
        try {
            const response = await modelAPI.post('/model/job', {"job_position":position},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("model response", response)
            const mod_response = dataNormalizer(response.data)
            if(mod_response && !mod_response.length) 
            {
                console.log("mod response length", mod_response)
                setBlankModelData(true)
            }
            else{
                //console.log("moderated", mod_response)
                duplicatesFilter(mod_response)
                setBlankModelData(false)
                setAiCandidates(mod_response)
            }

            console.log("ai candidates", mod_response, blankModelData)
            
            setAiBtnLoading(false)
            return true;
        } catch (e) {
            console.log("model response", e)
            //alert(e);
            setAiBtnLoading(false)
            
            return false;
        }
    }

      const callJobVacancyAPI = async () => {
        
        try {
             
            
            const response = await jobAPI.get(`/job_vacancy/company`, { headers: { 'Authorization': `Bearer ${getStorage("userToken")}` } });
            //const second_response = await jobAPI.get(`/job_vacancy/company/${companyId}`)
            console.log("received job response", response)
            
            const mod_response = response.data.map(e => ({ id: e.job_id, jobTitle: e.job_name, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1], e.salary.split('-')[2]], postDate: e.created_at.split('T')[0], last_date: e.last_date.split('T')[0], location: e.location, poi: e.job_position, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc, jobReq: e.requirement, skills: e.skills.length ? e.skills : [{ 'skill': "" }], applicationsReceived: e.job_seekers, profile_picture:  getStorage("profile pic")  }))
            
            
            setJobVacancies(mod_response);
            
            console.log(response);
            console.log(" after new job vacancies", mod_response);
            console.log("filtered jobs", filteredJobs);
            
        } catch (e) {
            console.log("jobs failed", e )

            alert(e.message);
        }
    }

    const expJob = (selection) => {
        //console.log("select", selection);
        console.log("selected job vacncyt after mod", jobVacancies, "selection", selection);
        const expEntry = jobVacancies.filter(e => (e["id"] === selection ? e : false));
        console.log("expEntry ", expEntry)
        if(expEntry.length)
        {setJobEntryDetails(expEntry[0]);
        if (userData.type == "employer") console.log("yep done");
       }

    }
    /*const CreateJobRequest = async (jobId) => {
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
    }*/

    const resetAiCandidates= async ()=>{
        setAiCandidates([]);
        await callCandidatesAPI();
    }
    const loadingDelay = (delay, callFn, value=null) =>{
        setTimeout(() => {
            value?callFn(value):callFn();
        }, delay);
    }
    const scrollToItem = (id) => {
        const element = document.getElementById(id);
        console.log("scroll log, element", element , id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };


useEffect(()=>{if(companyID){callJobVacancyAPI(companyID);}}, [companyID])

useEffect(() => {console.log("jobVacancies" , jobVacancies)
        
        if (jobVacancies.length != 0 && selectedJobEntry!=null) {
            expJob(selectedJobEntry);
            console.log("job entry refreshed", jobVacancies)
        }
}, [jobVacancies])

useEffect(() => { if (jobVacancies.length != 0 && selectedJobEntry != null) expJob(selectedJobEntry) }, [selectedJobEntry]);
useEffect(() => { callCandidatesAPI() }, [filterparam, candidateSearchVal]);
useEffect(() => {console.log("canidates ai loading", aiBtnloading)}, [aiBtnloading])

    return (
        <div id="page">
            {loading && <LoaderAnimation />}
            <div className="job-filter">
            <Filter title="Filter applicants" userType="employer" passFilteredDataFn={filterDataSet} />            
            </div>
            <NavigationBar active="candidates" />
            <StatsAI value="candidates" aiBtnloading={aiBtnloading} callFn={callAiCandidateFetch}  jobs={filteredJobs} chooseEntryFunc={chooseJobEntry} jobSearchFunc={jobSearchBar} selectedEntry={selectedJobEntry} blankModelData={blankModelData}/>
            <div className="candidate-search">
                <SearchBar toSearch="Search Candidates" onSearch={candidateSearchBar} />
            </div>
            <Candidates candidateData={candidates} modelData={aiCandidates} setAiCandidates={resetAiCandidates}/>
        </div>
        
    )
}