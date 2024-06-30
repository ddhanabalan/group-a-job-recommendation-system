import './CandidateCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
export default function CandidateCard({ type = null, jobEntryId = null, crLink = null, data, jobApprovalFunction = null, background, profilePictureStyle }) {
    const [profile, setProfile] = useState(false)
    const [approval, setApproval] = useState('')
    console.log("cand data", data)
    const navigate = useNavigate();
    const showProfile = () => {
        setProfile(true)
    }

    useEffect(() => {
        if (profile && approval == '') navigate(`/profile/${data.username}`
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
    return (
        <div className="card job-card" style={background} onClick={() => setProfile(true)}>
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
            {type === "review" &&
                <div className="application-review-buttons">
                    <Tooltip title="Approve" enterDelay={500} leaveDelay={200}>
                        <IconButton className='application-approve-btn' onClick={() => setApproval('approved')}
                            sx={{ color: '#38b000', backgroundColor: "#d8f3dc" }}>
                            <DoneIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject" enterDelay={500} leaveDelay={200}>
                        <IconButton className='application-reject-btn' onClick={() => setApproval('rejected')}
                            sx={{ color: '#ff0000', backgroundColor: "#f6cacc" }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            }
        </div>
    )
}