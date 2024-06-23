import './JobCardExpanded.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {getStorage} from '../../storage/storage';

export default function JobCardExpanded({ data=[], createJobRequest=null, deleteJobRequest=null, userData, handleSub=null, type }) {
    console.log("data received by form", userData, "jobdata",data)
    const COMPANY_PROFILE_PIC = (userData.type==="employer"?getStorage("profile pic"):(data.profile_picture?data.profile_picture:null));
    console.log("company_profile_pic", COMPANY_PROFILE_PIC)
    //console.log(userData.appliedJobs.includes("4"))
    const [submit, setSubmit] = useState(false);
    //const [tag_state,setTagState] = useState(false);
    const userSkills = (userData.type==="employer" || data.length)?(null):(data.skills?.map(e => (userData.skills.map(_ => _.skill.toLowerCase())).includes(e.skill.toLowerCase())?true:false).filter(Boolean).length)
    const [skillIndicator, setSkillIndicator] = useState(true);
    



    //console.log(userSkills)
    //function for senting applicant details from the form to company

    useEffect(()=>{if(userData.type=="seeker" && type != "approval" && data.length!=0)setSubmit(((data.applicationsReceived).map(e=>e.user_id)).includes(userData.id))}, [data]) //UNCOMMENT THIS AFTER BACKEND FIX FOR MISSING DATA IN THE RESPONSE(i.e.applicationsReceived, tags, skills) 
    //console.log(userData.id, "applied=", submit, (data.applicationsReceived)?.map(e=>e.user_id) || "", "status", ((data.applicationsReceived)?.map(e=>e.user_id)).includes(userData.id), "submit status", submit)

    function handleApplication(){
        setSubmit(true);
        createJobRequest(data.id);
        console.log("sent", userData, "for application id", data.id )
        
    }

    function handleStatus(status){
        if(status=="applied")return "black";
        else if(status=="approved")return "green";
        else if(status=="rejected")return "red";
    }

    useEffect(() => setSkillIndicator(true), [data])
    return (
        <>
        
        <div className="job-desc-container">
            {data.length!=0?
                    <>
                    <div className="job-desc-header">
                        <div className='job-desc-div1'>
                            <h1 className='job-desc-h1'>{data?.jobTitle || ""}</h1>
                            <Link to={`/e/profile/${data?.companyUsername || ""}`} state={{"purpose": "visit", "company_id": data.companyID}}>
                            <p className='job-desc-company-name-p'>{data?.companyName || ""}</p>
                            </Link>
                            {data.tags?
                                <div></div>
                                /*<Stack className="job-desc-tags" direction="row" spacing={1}>
                                    {data.tags.map(e => {
                                        return (<Chip key={typeof(e)=="string"?uuid():e.id} className="job-desc-tags-child" label={typeof(e)=="string"?e:e.tags} size='small' />)
                                    })}

                        </Stack>*/
                        :
                        <></>
                    }
                    <p className='job-desc-salary'>{data.currency} {data.salary[0]}  {data.salary[1]?"- "+data.salary[1]:""} per month</p>
                </div>
                <div className='job-desc-div2'>
                    <div className='job-desc-img-container'>
                        <img src={COMPANY_PROFILE_PIC}/> 
                    </div>
                    <p className='job-desc-time-p'>{data.postDate}</p>
                </div>
            </div>
            <hr className="separator"/>
            <div className="job-desc-body">
                <div className="job-details">
                    <p><span >Location:</span> {data.location}</p>
                    <p><span >Employment type: </span>{data.empType}</p>
                    <p><span >Experience:</span> {data.exp}</p>
                    <p><span >Work Style:</span> {data.workStyle}</p>
                    <p><span >Working Days:</span> {data.workingDays}</p>
                    <p><span >Last Date:</span> {(data.last_date?.split('-').reverse()).join('-') || ""}</p>
                </div>

                <div className="job-description">
                        <h6>Job Description</h6>
                        <pre className='overview-formatted desc'>{data.jobDesc}</pre>
                    {/* <p className="desc">{data.jobDesc}</p> */}
                </div> 

                <div className="job-requirements">
                        <h6>Job Requirements</h6>
                        <pre className='overview-formatted desc'>{data.jobReq}</pre>
                    {/* <p className='desc'>{data.jobReq}</p> */}
                </div> 

                        {data.skills && skillIndicator? 
                            <div className="job-skills">
                                <h6>Skills&nbsp;{userData.type=="seeker"?<span className='skill-counter'>&nbsp;  You have {userSkills} out of {data.skills.length} skills required for the job</span>: <></>}</h6>
                                {/*skill tags */}
                                <div className='desc'><Stack className="job-desc-tags" direction="row" spacing={1}>
                                    {data.skills.map(e => {if(e.skill != ""/* && e.skill !=""*/)
                                        {return (<div className="job-desc-skill-tags-child" key={typeof(e)=="string"?uuid():e.id}>
                                                {typeof(e)=="string"?e:e.skill} {userData.type==="employer"?
                                                        <></>
                                                        :
                                                        (Object.keys(userData).includes('skills')?<div className={userData.skills.map(skill => {return skill.skill.toLowerCase()}).includes(typeof(e)=="string"?e.toLowerCase():e.skill.toLowerCase())?"skill-status green":"skill-status red"}></div>:<></>)      
                                                    }
                                                </div>)}
                                        else{
                                            setSkillIndicator(false);
                                        }
                                    })}

                                </Stack>
                                </div>
                            </div>
                            :
                            <></>
                        }    
                    </div>

            {userData.type=="seeker" && type =="approval"?
                <>
                <div className='job-approval-status-label'>
                    Status: <span className={`job-status-text color-${handleStatus(data.status.toLowerCase())}`}>{data.status}</span>
                </div>
                <div className="cancel-application-button">
                <Button variant="outlined" onClick={()=>{deleteJobRequest(data.job_req_id)}} sx={{color: "black", border: "2px solid #254CE1"}} endIcon={<CancelRoundedIcon/>}>
                    <p>Cancel Application</p>
                </Button>
                </div>
                </>
                
                :
                <></>
            }       
                    
                    
            {userData.type=="employer" || type =="approval"?
                <></>
                :
                <div className="apply-button">
                <Button variant="outlined" onClick={submit?()=>{}:handleApplication} sx={{color: submit?"gray":"black", border: "2px solid #254CE1"}} startIcon={submit?<DoneIcon/>:<MailIcon />}>
                <p>{submit?"Applied":"Apply for the job"}</p>
                </Button>
                </div>
            }
            </>
            :
            <></>
            }
            
            
        </div>
        </>
    )
}