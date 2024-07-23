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
import IconButton from '@mui/material/IconButton';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import { getStorage } from '../../storage/storage';

export default function JobCardExpanded({ data = [], createJobRequest = null, deleteJobRequest = null, userData, handleSub = null, handleInvite=null, type, invite=null, applicationErrors = null }) {
    console.log("data received by form", userData, "jobdata", data, "invite", invite, type, "checkword", data.invite?.job_status !=="approved", data.invite_status?.toLowerCase() === "pending" )

    //console.log(userData.appliedJobs.includes("4"))
    const [submit, setSubmit] = useState(false);
    //const [tag_state,setTagState] = useState(false);
    const userSkills = (userData.type === "employer" || data.length) ? (null) : (data.skills?.map(skill => userData.skills.map(skilltag => skilltag.skill).includes(skill.skill) ? true : false).filter(Boolean).length)
    const [skillIndicator, setSkillIndicator] = useState(true);
    const [userJobRequest, setUserJobRequest] = useState(null);

    console.log("data", data)

    //console.log(userSkills)
    //function for senting applicant details from the form to company

    useEffect(() => { if (userData.type == "seeker" && type != "approval" && data.length != 0) {
        const appliedSeekers=data.applicationsReceived
        if(data.userApplication?.length /*((appliedSeekers).map(e => e.user_id)).includes(userData.id)*/)
        {   const r = data.userApplication.filter(e=>e.status!=="rejected");
            console.log("rejcted ", r, "data", data)
            if(r.length)
            {   setSubmit(true)
                setUserJobRequest(r[0]/*((appliedSeekers).filter(e => e.user_id == userData.id))[0]*/)   
                
            }
            else{
                setSubmit(false);
                setUserJobRequest(null);
                
            }
        }

         else
         {
             setSubmit(false);
             setUserJobRequest(null);
         }
    } }, [data]) //UNCOMMENT THIS AFTER BACKEND FIX FOR MISSING DATA IN THE RESPONSE(i.e.applicationsReceived, tags, skills) 
    //console.log(userData.id, "applied=", submit, (data.applicationsReceived)?.map(e=>e.user_id) || "", "status", ((data.applicationsReceived)?.map(e=>e.user_id)).includes(userData.id), "submit status", submit)

    function handleApplication() {
        setSubmit(true);
        createJobRequest(data.id);
        console.log("sent", userData, "for application id", data.id)

    }

    function handleStatus(status) {
        if (status == "applied") return "black";
        else if (status == "approved") return "green";
        else if (status == "rejected") return "red";
    }

    useEffect(() => setSkillIndicator(true), [data])
    return (
        <>

            <div className="job-desc-container">
                {data.length != 0 ?
                    <>
                        <div className="job-desc-header">
                            <div className='job-desc-div1'>
                                <h1 className='job-desc-h1'>{data?.jobTitle || ""}</h1>
                                <Link to={`/e/profile/${data?.companyUsername || ""}`} state={{ "purpose": "visit", "company_id": data.companyID }}>
                                    <p className='job-desc-company-name-p'>{data?.companyName || ""}</p>
                                </Link>
                                {data.tags ?
                                    <div></div>
                                    /*<Stack className="job-desc-tags" direction="row" spacing={1}>
                                        {data.tags.map(e => {
                                            return (<Chip key={typeof(e)=="string"?uuid():e.id} className="job-desc-tags-child" label={typeof(e)=="string"?e:e.tags} size='small' />)
                                        })}
    
                            </Stack>*/
                                    :
                                    <></>
                                }
                                <p className='job-desc-salary'>{data.currency} {data.salary[0]}  {data.salary[1] ? "- " + data.salary[1] : ""} per month</p>
                            </div>
                            <div className='job-desc-div2'>
                                <div className='card-img-container qualification-card-image  job-card-img-container'>
                                    {data['profile_picture'] ? <img  src={data['profile_picture']} alt="" /> :
                                        <IconButton disabled>
                                            <CorporateFareRoundedIcon fontSize='large' />
                                        </IconButton>}
                                </div>
                                <p className='job-time-p'>{data.postDate}</p>
                            </div>
                        </div>
                        <hr className="separator" />
                        <div className="job-desc-body">
                            <div className="job-details">
                                <p><span >Location:</span> {data.location}</p>
                                <p><span >Employment type: </span>{data.empType}</p>
                                <p><span >Experience:</span> {data.exp}</p>
                                <p><span >Work style:</span> {data.workStyle}</p>
                                <p><span >Working days:</span> {data.workingDays}</p>
                                <p><span >Last date:</span> {data.last_date || ""}</p>
                            </div>

                            <div className="job-description">
                                <h6>Job description</h6>
                                <pre className='overview-formatted desc'>{data.jobDesc}</pre>
                                {/* <p className="desc">{data.jobDesc}</p> */}
                            </div>

                            <div className="job-requirements">
                                <h6>Job requirements</h6>
                                <pre className='overview-formatted desc'>{data.jobReq}</pre>
                                {/* <p className='desc'>{data.jobReq}</p> */}
                            </div>

                            {data.skills && skillIndicator ?
                                <div className="job-skills">
                                    <h6>Skills&nbsp;{userData.type == "seeker" ?  <span className='skill-counter'>You have {userSkills} out of {data.skills.length} skills required for the job</span> : <></>}</h6>
                                    {/*skill tags */}
                                    <div className='desc'><Stack className="job-desc-tags" direction="row" spacing={1}>
                                        {data.skills.map(e => {
                                            if (e!="" && e.skill != ""/* && e.skill !=""*/) {
                                                return (<div className="job-desc-skill-tags-child" key={typeof (e) == "string" ? uuid() : e.id}>
                                                    {typeof (e) == "string" ? e : e.skill} {userData.type === "employer" ?
                                                        <></>
                                                        :
                                                        (Object.keys(userData).includes('skills') ? <div className={userData.skills.map(skill => { return skill.skill.toLowerCase() }).includes(typeof (e) == "string" ? e.toLowerCase() : e.skill.toLowerCase()) ? "skill-status green" : "skill-status red"}></div> : <></>)
                                                    }
                                                </div>)
                                            }
                                            else {
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

                        {userData.type == "seeker" && type == "approval" && data.status ?
                            <>
                                <div className='job-approval-status-label'>
                                    Status: <span className={`job-status-text color-${handleStatus(data.status.toLowerCase())}`}>{data.status}</span>
                                </div>
                                {data.status == "Applied" &&
                                    <div className="cancel-application-button">
                                        <Button variant="outlined" onClick={() => { deleteJobRequest(data.job_req_id) }} sx={{ color: "black", border: "2px solid #254CE1" }} endIcon={<CancelRoundedIcon />}>
                                            <p>Cancel Application</p>
                                        </Button>
                                    </div>
                                }
                                {data.status == "rejected" &&
                                    <div className="cancel-application-button">
                                        <Link to={`/seeker/openings/${data.companyUsername}/${data.id}`}>
                                        <Button variant="outlined"  sx={{ color: "black", border: "1px solid #254CE1" }} endIcon={<FileOpenIcon />}>
                                            <p>View Vacancy</p>
                                        </Button>
                                        </Link>
                                    </div>
                                }
                            </>

                            :
                            <></>
                        }


                        {userData.type == "employer" || type == "approval" || invite ?
                            (
                                invite && ((data.invite && data.invite.job_status !=="approved") || (data.invite_status && data.invite_status.toLowerCase() === "pending" || false))?
                                 <>
                                 <div className='invite-banner'>
                                 <p>You have been invited for an interview</p>
                                 </div>
                                 <div className='invite-buttons-container'>
                                    
                                    <button className='accept' onClick={()=>{handleInvite("approved", data.job_invite_id || data.invite.job_invite_id)}} >
                                        Accept
                                    </button>
                                    <button className='reject' onClick={()=>{handleInvite("rejected", data.job_invite_id || data.invite.job_invite_id)}} >
                                        Reject
                                    </button>

                                 </div>
                                 </>
                                 
                                 :
                                 ((data.invite?.job_status.toLowerCase() === "approved") || (data.invite_status?.toLowerCase()==="approved")?
                                    <button className='continue-btn invite-accepted-btn' >
                                        Invite Accepted
                                    </button>
                                    :
                                    ((data.invite?.job_status.toLowerCase() === "rejected") || (data.invite_status?.toLowerCase()==="rejected")?
                                    <>
                                    <button className='continue-btn invite-rejected-btn' >
                                        Invite Rejected
                                    </button>
                                    
                                    <div className="cancel-application-button">
                                        <Link to={`/seeker/openings/${data.companyUsername}/${data.id}`}>
                                        <Button variant="outlined"  sx={{ color: "black", border: "1px solid #254CE1" }} endIcon={<FileOpenIcon />}>
                                            <p>View Vacancy</p>
                                        </Button>
                                        </Link>
                                    </div>
                                    </>
                                    :
                                    <></>
                                    )
                                    
                                 )
                                 
                                
                                 
                            )
                            :
                            <div className="apply-button">
                                {/* <Button variant="outlined" disabled={submit}  onClick={submit ? () => { } : handleApplication} sx={{ color: submit ? "gray" : "black", border: "1px solid #254CE1",textTransform:'none' }} startIcon={submit ? <DoneIcon /> : <MailIcon />}>
                                    <p>{submit ? "Applied" : "Apply for the job"}</p>
                                </Button> */}
                                {
                                (!submit?
                                    (applicationErrors===true?
                                    <div className='invite-banner'>
                                        <p>Application window temporarily unavailable</p>
                                    </div>
                                    
                                    :
                                    <button className='continue-btn' onClick={submit ? () => { } : handleApplication} >
                                        Apply
                                        <div class="arrow-wrapper">
                                            <div class="arrow"></div>

                                        </div>
                                    </button>
                                    )
                                    :
                                    <button className='continue-btn disable-apply-btn' onClick={submit ? () => { } : handleApplication} >
                                        {userJobRequest?.status || "Processing..."}
                                    </button>
                                )
                                }
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