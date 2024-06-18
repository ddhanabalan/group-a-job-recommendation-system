import './CandidateCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function CandidateCard({ type = null, jobEntryId = null, crLink = null, data, background, profilePictureStyle  }) {
    const [profile, setProfile] = useState(false)
    const navigate = useNavigate();
    const showProfile = () => {
        setProfile(true)
    }

    useEffect(() => { if (profile) navigate(`/profile/${data.username}`, { state: { presentjobId: jobEntryId, link: crLink } }) }, [profile])


    return (
        <div className="card job-card" style={background}>
            <div className='job-card-div1'>
                <h1 className='card-h1'>{data.candidateName}</h1>
                <Stack direction="row" spacing={1}>
                    <Chip className="chip-with-icon" icon={<LocationOnIcon />} label={data.location || "not available"} />
                    <Chip className="chip-with-icon" icon={<WorkIcon />} label={(data.experience ? (data.experience + " years") : "not available")} />
                </Stack>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.tags?.map(e => {
                        return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    }) || <></>}

                </Stack>
                {/* <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Education</p>
                    <p>{data.education || "not available"}</p>
                </div>
                <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Preferred Work location</p>
                    <p>{data.work_location || "not available"}</p>
                </div> */}
            </div>
            <div className='job-card-div2'>
                <div className='job-card-img-container' style={profilePictureStyle}>
                    <img src={profilePlaceholder} alt="candidate profile" />
                </div>
                {type === "review" ?
                    <div className="application-review-buttons">
                        <Button variant="contained" onClick={showProfile} sx={{ color: 'black', backgroundColor: '#d2cece', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<Person2RoundedIcon />}>
                            <p>View full profile</p>
                        </Button>
                        <Button variant="contained" sx={{ color: 'black', backgroundColor: '#38b000', width: '100%', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<DoneIcon />}>
                            <p>Approve</p>
                        </Button>
                        <Button variant="contained" sx={{ color: 'black', backgroundColor: '#fc2828', width: '100%', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<CloseIcon />}>
                            <p>Reject</p>
                        </Button>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    )
}