
import './JobInvite.css'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import JobInviteDetailsCard from '../JobInviteDetailsCard/JobInviteDetailsCard';
import CreateFormTextFields from '../CreateJobVacancyForm/CreateFormTextFields';
import { Link } from 'react-router-dom';
import {getStorage} from '../../storage/storage';

export default function JobInvite({ data=[], jobData=null, createJobRequest=null, deleteJobRequest=null, userData, handleSub=null, type, sentInvite=null }) {
    console.log("data received by form", userData, "jobdata",data)
    const CANDIDATE_PROFILE_PIC = (userData.type==="employer"?data.profile_picture:null);
    console.log("CANDIDATE_PROFILE_PIC", CANDIDATE_PROFILE_PIC)
    //console.log(userData.appliedJobs.includes("4"))
    const [finalData, setfinalData] = useState({});
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState(false);
    //const [tag_state,setTagState] = useState(false);
    const userSkills = (userData.type==="employer" || data.length)?(null):(data.skills?.map(e => (userData.skills.map(_ => _.skill.toLowerCase())).includes(e.skill.toLowerCase())?true:false).filter(Boolean).length)
    
    



    //console.log(userSkills)
    //function for senting applicant details from the form to company

    useEffect(()=>{if(userData.type=="seeker" && type != "approval" && data.length!=0)setSubmit(((data.applicationsReceived).map(e=>e.user_id)).includes(userData.id))}, [data]) //UNCOMMENT THIS AFTER BACKEND FIX FOR MISSING DATA IN THE RESPONSE(i.e.applicationsReceived, tags, skills) 
    //console.log(userData.id, "applied=", submit, (data.applicationsReceived)?.map(e=>e.user_id) || "", "status", ((data.applicationsReceived)?.map(e=>e.user_id)).includes(userData.id), "submit status", submit)

    function handleInviteData(){
        
        if(!jobData)setError(true);
        else{
            setError(false);
            setfinalData({...jobData,...data, 'remarks': remarks})
            
        }   
    }
    

    

    function handleRemarks(text){
        setRemarks(text);
    }

    useEffect(()=>{if(Object.keys(finalData).length)sentInvite(finalData);}, [finalData])

    
    return (
        <>
        
        <div className="job-desc-container">
            
            {data.length!=0?
                    <>
                    <div className="job-desc-header">
                        <div className='job-desc-div1'>
                            <h1 className='job-desc-h1'>{data?(data.first_name + " " + data.last_name) : ""}</h1>
                            <div className='job-invite-details'>
                                <Chip className="detail-chips" icon={<LocationOnIcon />} label={(data.city + ',' + data.country) || "not available"} />
                                <Chip className="detail-chips" icon={<WorkIcon />} label={data.experience + " years"} /> 
                            </div>
                        </div>
                        <div className='job-desc-div2'>
                            <div className='job-invite-img-container'>
                                <img src={CANDIDATE_PROFILE_PIC}/> 
                            </div>
                            
                        </div>
                    </div>
                    <hr className="separator"/>
                    <div className="job-desc-body">

                            <div className="job-details">
                                <p><span>Job vacancy:</span> {jobData?<></>:<span className={`selection-hint-text${error?"-red":""}`}>select a job vacancy from left</span>}</p>
                                <div className="job-vacancy-selection-container">
                                    {jobData?
                                    <JobInviteDetailsCard data={jobData} />
                                    :
                                    <p ></p>
                                    }
                                </div>
                                    {/* <pre className='overview-formatted desc'>{data.jobDesc}</pre> */}
                                {/* <p className="desc">{data.jobDesc}</p> */}
                            </div> 
                        
                            <div className="job-details">
                                <p><span>Remarks:</span></p>
                                <div className="job-vacancy-selection-container">
                                    <div className="create-job-desc-field"><CreateFormTextFields inputPlaceholder="Enter remarks(optional)" fontsz="14px" wparam="100%" defaultValue={""} multipleLine={true} minrows={8} onChange={handleRemarks} /></div>
                                </div>
                            </div>
                            <div className="mailing-info-text">
                                <p><span></span>Note: CareerGo will be senting an email to the candidate specifying the link to the invited job vacancy and remarks.The candidate will have to apply from the link.
                                         You can then approve the application from the review section. </p>
                            </div>              
                    </div>
                    <div className="confirm-job-invite-button">
                        <Button variant="outlined" onClick={handleInviteData} sx={{color: "#7B7777", border: "solid 1px green",fontFamily: "Inter-regular"}}>
                            <p>Send Job Invite</p>
                        </Button>
                    </div>
                    </>
                    :
                    <></>
                    }
        </div>
        </>
    )
}