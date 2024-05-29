import './JobCardExpanded.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';

export default function JobCardExpanded({ data, createJobRequest=null, userData, handleSub=null }) {
    console.log("data received by form", userData, "jobdata",data)
   
    //console.log(userData.appliedJobs.includes("4"))
    const [submit, setSubmit] = useState(false);
    //const [tag_state,setTagState] = useState(false);
    const userSkills = (userData.type==="employer"?null:data.skills?.map(skill => userData.skills.includes(skill)?true:false).filter(Boolean).length)
    const [skillIndicator, setSkillIndicator] = useState(true);
    



    //console.log(userSkills)
    //function for senting applicant details from the form to company

    /*useEffect(()=>{if(userData.type=="seeker")setSubmit(((data.applicationsReceived).map(e=>e.user_id)).includes(userData.id))})*/ //UNCOMMENT THIS AFTER BACKEND FIX FOR MISSING DATA IN THE RESPONSE(i.e.applicationsReceived, tags, skills) 
    //console.log(userData.id, "applied=", submit, (data.applicationsReceived)?.map(e=>e.user_id) || "", "status", ((data.applicationsReceived)?.map(e=>e.user_id)).includes(userData.id))

    function handleApplication(){
        setSubmit(true);
        createJobRequest(data.id);
        console.log("sent", userData, "for application id", data.id )
        
    }

    useEffect(() => setSkillIndicator(true), [data])
    return (
        <>
        
        <div className="job-desc-container">
            <div className="job-desc-header">
                <div className='job-desc-div1'>
                    <h1 className='job-desc-h1'>{data.jobTitle}</h1>
                    <p className='job-desc-company-name-p'>{data.companyName}</p>
                    {data.tags?
                        <Stack className="job-desc-tags" direction="row" spacing={1}>
                            {data.tags.map(e => {
                                return (<Chip key={typeof(e)=="string"?uuid():e.id} className="job-desc-tags-child" label={typeof(e)=="string"?e:e.tags} size='small' />)
                            })}

                        </Stack>
                        :
                        <></>
                    }
                    <p className='job-desc-salary'>{data.currency} {data.salary[0]}  {data.salary[1]?"- "+data.salary[1]:""} per month</p>
                </div>
                <div className='job-desc-div2'>
                    <div className='job-desc-img-container'>
                        {/* <img src="" alt="" /> */}
                    </div>
                    <p className='job-desc-time-p'>{data.postDate}</p>
                </div>
            </div>
            <hr className="separator"/>
            <div className="job-desc-body">
                <div className="job-details">
                    <p><span >Location:</span> {data.location}</p>
                    <p><span >Employment type:</span>{data.empType}</p>
                    <p><span >Experience:</span> {data.exp}</p>
                    <p><span >Last Date:</span> {(data.last_date?.split('-').reverse()).join('-') || ""}</p>
                </div>

                <div className="job-description">
                    <h6>Job Description</h6>
                    <p className="desc">{data.jobDesc}</p>
                </div> 

                <div className="job-requirements">
                    <h6>Job Requirements</h6>
                    <p className='desc'>{data.jobReq}</p>
                </div> 

                {data.skills && skillIndicator? 
                    <div className="job-skills">
                        <h6>Skills&nbsp;{userData.type=="seeker"?<span className='skill-counter'>&nbsp;  You have {userSkills} out of {data.skills.length} skills required for the job</span>: <></>}</h6>
                        {/*skill tags */}
                        <div className='desc'><Stack className="job-desc-tags" direction="row" spacing={1}>
                            {data.skills.map(e => {if(e.skill != "" && e.skill !="")
                                {return (<div className="job-desc-skill-tags-child" key={typeof(e)=="string"?uuid():e.id}>
                                        {typeof(e)=="string"?e:e.skill} {userData.type=="employer"?
                                                <></>
                                                :
                                                <div className={userData.skills.map(skill => {return skill.toLowerCase()}).includes(typeof(e)=="string"?e.toLowerCase():e.skill.toLowerCase())?"skill-status green":"skill-status red"}></div>
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
            {userData.type=="employer"?
                <></>
                :
                <div className="apply-button">
                <Button variant="outlined" onClick={submit?()=>{}:handleApplication} sx={{color: submit?"gray":"black", border: "2px solid #254CE1"}} startIcon={submit?<DoneIcon/>:<MailIcon />}>
                <p>{submit?"Applied":"Apply for the job"}</p>
                </Button>
                </div>
            }
        </div>
        </>
    )
}