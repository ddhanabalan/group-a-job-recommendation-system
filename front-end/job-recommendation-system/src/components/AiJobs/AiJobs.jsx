import { useState,useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import './AiJobs.css';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
export default function AiJobs({ childData, expandView }) {
    useEffect(() => {
        setRecJobs(childData)
    },[childData])
const [recJobs,setRecJobs]=useState([])
    return (
        recJobs.length > 0 &&
        <div className='ai-jobs-container'>
            <h3 className='ai-jobs-h3'>Ai recommened Jobs &nbsp; <AutoAwesomeRoundedIcon sx={{ color:'rgba(220, 3, 255, 1)'}}/></h3>
            {
                recJobs.map(e => {
                    const salaryParts = e.salary.split('-');
                    const createdDateParts = e.created_at.split('T');
                    const lastDateParts = e.last_date.split('T');
                    // const inviteStat = userInvites.length ? getInviteStatus(e.job_id) : null;
                    // console.log("invite stat", inviteStat, userInvites)
                return <JobCard data={{
                    id: e.job_id,
                    companyID: e.company_id,
                    jobTitle: e.job_name,
                    companyUsername: e.company_username,
                    companyName: e.company_name,
                    tags: /* (e.tags.length ? e.tags : */[{ tag: "" }], // Keeping the comment
                    currency: salaryParts.length > 0 ? salaryParts[0] : "",
                    salary: salaryParts.length > 2 ? [salaryParts[1], salaryParts[2]] : ["", ""],
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
                    applicationsReceived: e.job_seekers,
                    // userApplication: ((((e.job_seekers).map(e => e.user_id)).includes(userData.id)) ? ((e.job_seekers).filter(e => e.user_id == userData.id)) : null),
                    // invite_status: inviteStat ? inviteStat.status : null,
                    // job_invite_id: inviteStat ? inviteStat.id : null
                }} expandView={expandView}
                    profilePictureStyle={{backgroundColor:'white'}}
                    background={{ backgroundImage: 'linear-gradient(60deg, rgba(255,255,255,1.00) 0%,rgba(229,153,242,1.00) 100%)', backgroundPosition: 'center center' }} />
            })}
                <button className='ai-clear-response-btn' onClick={() => setRecJobs([])
                    
            } >
                Clear response
                <div class="arrow-wrapper">
                   <CloseRoundedIcon/>
                </div>
            </button>
        </div>
    )
}