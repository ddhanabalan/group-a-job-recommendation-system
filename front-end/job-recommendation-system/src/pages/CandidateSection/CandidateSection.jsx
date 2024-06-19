import Filter from "../../components/Filter/Filter";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Candidates from "../../components/Candidates/Candidates";
import { useState, useEffect } from "react";
import {getStorage} from "../../storage/storage";
import { userAPI } from "../../api/axios";
import './CandidateSection.css';
export default function CandidateSection() {
    const [userData, setUserData] = useState({ 'type': 'employer' });
    const [candidates, setCandidates] = useState([]);
    const [searchVal, setSearch] = useState("");
    const [filterparam, setParam] = useState({});
    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => id["skills"].map((tag) => (tag["skill"].toLowerCase().includes(searchVal.toLowerCase()))).filter(Boolean).length ? id : false) : []);
    //const filtered = (jobVacancies.length != 0 ? jobVacancies.filter(id => (id["jobTitle"].toLowerCase()).includes(searchVal.toLowerCase())?id:false): [])
    //const [descriptionOn, setDesc] = useState(false);

    const filterDataSet = (fdata) => {
        setParam({ ...fdata });
    }
    console.log("filter", filterparam);
    
    const searchBar = (searchValue) => {
        setSearch(searchValue);
    }
    const callCandidatesAPI = async () => {
        
        try {
            const response = await userAPI.get('/seeker/details/list',
                {
                    params: searchVal!=""?{"name": searchVal, ...filterparam }:{...filterparam},
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
            const mod_response = response.data.map(e=>({applicantID: e.user_id, username: e.username, first_name: e.first_name, last_name: e.last_name,city: e.city, country: e.country, location: e.location, experience: e.experience, profile_picture: e.profile_picture}))

            setCandidates(mod_response);
            console.log(response);
            //console.log(" after new candidates", mod_response);
            //console.log("filtered", filtered);
        } catch (e) {

            console.log("candidates failed", e);
            alert(e.message);
        }
    }
    
      console.log("candidates", candidates)  

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

    useEffect(() => { callCandidatesAPI() }, [filterparam, searchVal]);
    return (
        <div id="page">
            <div className="job-filter">
            <Filter title="Filter applicants" userType="employer" passFilteredDataFn={filterDataSet} />            
            </div>
            <NavigationBar active="employer-profile" />
            <StatsAI value="candidates"/>
            <div className="candidate-search">
                <SearchBar toSearch="Search Candidates" onSearch={searchBar} />
            </div>
            <Candidates candidateData={candidates}/>
        </div>
        
    )
}