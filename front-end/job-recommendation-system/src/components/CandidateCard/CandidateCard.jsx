import './CandidateCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
export default function CandidateCard({ type = null, jobEntryId = null, crLink = null, data, jobApprovalFunction = null, removeInvite=null, applicantList=null, background, profilePictureStyle,reloadFn }) {
    const [profile, setProfile] = useState(false)
    const [approval, setApproval] = useState('')
    console.log("cand data", data)
    const navigate = useNavigate();
    const showProfile = () => {
        setProfile(true)
    }

    useEffect(() => {
        if (profile) navigate(`/profile/${data.username}`
            , { state: { presentjobId: jobEntryId, link: crLink } })
        setProfile(false)
    }, [profile])
    useEffect(() => {
        if (jobApprovalFunction) {
            if (approval === "approved") jobApprovalFunction(data.job_request_id, "approved", data.applicantID);
            else if (approval === "rejected") jobApprovalFunction(data.job_request_id, "rejected", data.applicantID);
        }
    }, [approval])

    console.log("experience", data.experience)
    const candidateCardClass = `card job-card ${data.job_status === "approved" && 'approved-candidate-card ' || data.job_status === "rejected" && 'rejected-candidate-card' ||data.application_type === "invite" && 'invited-candidate-card '|| data.job_status === "applied" && 'applied-candidate-card '}`
    return (
        <div className={candidateCardClass} style={background} onClick={() => setProfile(true)}>
            <div className='job-card-div1'>
                <h1 className='card-h1'>{data.first_name} {data.last_name}</h1>
                <Stack direction="row" spacing={1}>
                    <Chip className="chip-with-icon" icon={<LocationOnIcon />} label={data.city + ',' + data.country || "not available"} />
                    <Chip className="chip-with-icon" icon={<WorkIcon />} label={data.experience + " years"} />
                </Stack>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.skill?.map(e => {
                        return (<Chip key={e.id} className="card-tags-child" label={e.skill} size='small' />)
                    }).slice(0, 3) || <></>}

                </Stack>
            </div>
            <div className='job-card-div2'>
                <div className='job-card-img-container' style={profilePictureStyle}>
                    <img src={data.profile_picture ? data.profile_picture : profilePlaceholder} alt="candidate profile" />
                </div>
            </div>
            {type === "review" && data.job_status==="applied" &&
                <div className="application-review-buttons">
                    <Tooltip title="Approve" enterDelay={500} leaveDelay={200}>
                        <IconButton className='application-approve-btn' onClick={(event) => {
                            event.stopPropagation();
                            setApproval('approved')
                            reloadFn()
                         }}
                            sx={{ color: '#38b000', backgroundColor: "#d8f3dc" }}>
                            <DoneIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject" enterDelay={500} leaveDelay={200}>
                        <IconButton className='application-reject-btn' onClick={(event) => {
                            event.stopPropagation();
                            setApproval('rejected')
                            reloadFn()
                         }}
                            sx={{ color: '#ff0000', backgroundColor: "#f6cacc" }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            }
            <div className='card-status-div'>
            {
                data.application_type == "invite" && data.job_status=="pending" &&
                <>
                <div className="invite-status-div invite-status-pending">
                    <p>Invited</p>
                    <div className="skill-status yellow"></div>
                </div>
                </>    
            }
            {
                data.job_status === "approved" && data.application_type == "request" &&
                <div className="job-status-div job-status-approve">
                    <p>Approved</p>
                    <div className="skill-status green"></div>
                </div>
            }
            {
                data.job_status === "rejected" && data.application_type == "request" && 
                <div className="job-status-div job-status-reject">
                    <p>Rejected</p>
                    <div className="skill-status red"></div>
                </div>
            }
            {
                data.job_status === "rejected" && data.application_type == "invite" &&
                <>
                <div className="job-status-div job-status-reject">
                    <p>Declined</p>
                    <div className="skill-status red"></div>
                </div>
                {removeInvite?
                    <Tooltip title="Remove" enterDelay={500} leaveDelay={200}>
                        
                        <IconButton className='application-reject-btn' onClick={(event) => {
                            event.stopPropagation();
                            removeInvite(data.job_invite_id)
                            setApproval('')
                            reloadFn()
                            }}
                            sx={{ color: 'black', backgroundColor: "white" }}>
                            <DeleteOutlineIcon />
                        </IconButton>
                        
                    </Tooltip>
                    :
                    <></>
                        }
                </>
            }
            {
                data.job_status === "approved" && data.application_type == "invite" &&
                <div className="job-status-div job-status-approve">
                    <p>Accepted</p>
                    <div className="skill-status green"></div>
                </div>
            }
            
            </div>
        </div>
    )
}