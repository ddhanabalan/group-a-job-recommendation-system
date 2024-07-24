import './JobOpeningCard.css';
import { Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import { useState, useEffect } from 'react';


export default function JobOpeningCard({ data, type = null, highlighted = null, listToDescFunc = null, deleteJobFunc = null, disabled=false, invite = null, inviteJob=null }, props) {
    //opening cards show in opening page    
    console.log("data to opening card", data, invite)
    const [status, setStatus] = useState("");
    const [statusColor, setStatusColor] = useState("");
    const [cssTag, setCssTag] = useState("");
    const [preJob, setPreJob] = useState();
    
    console.log("received invite card", inviteJob);

    const checkStatus = () => {
        if (!preJob) return;
        const application_type = preJob.type.toLowerCase();
        const app_status = preJob.job_status?.toLowerCase() || preJob.invite_status.toLowerCase();
        if (application_type == "request") {
            console.log("requesting");
            if (app_status == "applied") {
                setStatus("Already applied");
                setStatusColor("yellow");
                setCssTag("reject");
            } else if (app_status == "approved") {
                setStatus("Application approved");
                setStatusColor("green");
                setCssTag("approve");
            } /*else if (preJob.job_status == "rejected") {
                setStatus("rejected");
                setStatusColor("red");
                setCssTag("reject");
            }*/
        } else {
            if (app_status == "pending") {
                setStatus("Invite sent");
                setStatusColor("orange");
                setCssTag("reject");
            } else if (app_status == "approved") {
                setStatus("Invite accepted");
                setStatusColor("green");
                setCssTag("approve");
            } /*else if (preJob.invite_status == "rejected") {
                setStatus("invite declined");
                setStatusColor("red");
                setCssTag("reject");
            }*/
        }
    };
    
    

    useEffect(() => {
    if(inviteJob && inviteJob.length)
    {console.log("logged invite job", inviteJob[0].invite_status);
        const r = inviteJob.map(e=>e.invite_status?e.invite_status.toLowerCase():null);
        console.log("registered invites", inviteJob, r, data.id)
    let index = 0;
    if(/*r.includes("rejected") && */ r.includes("pending"))
    {
        index = r.lastIndexOf("pending");
    }
    console.log("invite job", index)

    setPreJob(inviteJob[index])
    }}, [inviteJob])
    useEffect(() => {
        console.log("prejob set", preJob)
        if (preJob) checkStatus();
    }, [preJob]);
    useEffect(()=>{console.log("updated tags", data.id, status, statusColor, cssTag);
                    if(status!="")disabled(true)}, [status]);
    


    return (
        <div className={status==""?`opening-card ${highlighted ? 'highlighted' : ''}`:`opening-card disabled`}>
            {data.length != 0 ?
                <>
                    <div className='opening-card-div1'>
                        <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                        <p className='opening-card-company-name-p'>{data.companyName}</p>

                        <p className='opening-card-salary'>{data.currency} {data.salary[0]} {data.salary[1] ? "- " + data.salary[1] : ""} per month</p>
                        {data.userType == "employer" ?
                                ((type && type !="invite")?
                                <div className="opening-vacancy-buttons">
                                    <Button variant="contained" disableElevation onClick={deleteJobFunc ? () => deleteJobFunc(data.id) : undefined} className="opening-delete-button" sx={{ color: '#f6cacc', backgroundColor: '#ff0000', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<DeleteOutlineIcon />}>
                                        Delete
                                    </Button>
                                    <Link to="../employer/job-vacancy" state={{ ...data, edit: true }}>
                                        <Button variant="contained" disableElevation className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<EditIcon />}>
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                                :
                                ((inviteJob && status!="")?
                                <div className={`job-status-div job-status-${cssTag} job-status-opening-card`}>
                                    <p>{status}</p>
                                    <div className={`skill-status ${statusColor}`}></div>
                                </div>
                                :
                                <></>
                                )
                                )
                        
                            :
                            (data.userInvited || data.type=="invite" || (preJob && preJob.type == "invite") ?
                                <div className="job-status-div job-status-reject job-status-opening-card">
                                    <p>Invite</p>
                                    <div className="skill-status blue"></div>
                                </div>
                                : <>
                                    {data.status === "rejected"/*data.userApplication?data.userApplication[0].status === "rejected":null*/ &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Rejected</p>
                                            <div className="skill-status red"></div>
                                        </div>
                                    }
                                    {data.status === "approved" &&
                                        <div className="job-status-div job-status-approve job-status-opening-card">
                                            <p>Approved</p>
                                            <div className="skill-status green"></div>
                                        </div>
                                    }
                                    {data.status === "Applied" &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Applied</p>
                                            <div className="skill-status yellow"></div>
                                        </div>
                                    }
                                </>
                            )

                        }
                    </div>
                    <div className={`opening-card-div2${type === "review" ? " review" : ""}`}>
                        {(data?.closed) && type==="review" &&
                            <div className='closed-indicator'>Closed</div>
                        }
                        {type ?
                            <div className='feature-side'>
                                {data.applicationsReceived && (type != "invite") ?
                                    (data.applicationsReceived.filter(e => e.status.toLowerCase() === "applied").length ?
                                    <div className='application-indicator'>
                                        <p>{data.applicationsReceived.filter(e => e.status.toLowerCase() === "applied").length}</p>
                                    </div>
                                    :
                                    <div></div>)
                                    :
                                    <></>
                                }
                                {highlighted && status=="" &&
                                    <Tooltip title="View job description" enterDelay={500} leaveDelay={200}>
                                        <IconButton onClick={listToDescFunc} className='view-description-btn'
                                            sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black' }}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                            :
                            <div className='card-img-container qualification-card-image opening-card-img' >
                                <IconButton disabled>
                                    <CorporateFareRoundedIcon fontSize='large' />
                                </IconButton>
                            </div>
                        }
                        {data.application_created_at?
                        <div className="application-creation-date">
                            <p>{data.application_created_at}</p>
                        </div>
                        :
                        <></>
                        }
                    </div>

                </>
                :
                <></>
            }
        </div>
    )
}