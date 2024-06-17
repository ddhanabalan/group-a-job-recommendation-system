import './CandidateCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
export default function CandidateCard({ type=null, data }) {
    const [profile, setProfile] = useState(false)
    const navigate=useNavigate();
    const showProfile=()=>{
        setProfile(true)
    }

    
    return (
        <div className="card job-card">
            <div className='job-card-div1'>
                <h1 className='card-h1'>{data.candidateName}</h1>
                <Stack direction="row" spacing={1}>
                    <Chip className="chip-with-icon" icon={<LocationOnIcon />} label={data.location} />
                    <Chip className="chip-with-icon" icon={<WorkIcon />} label={data.experience + " years"} />
                </Stack>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.tags.map(e => {
                        return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    })}

                </Stack>
                <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Education</p>
                    <p>B.Tech CSE , IIT Madras</p>
                </div>
                <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Preferred Work location</p>
                    <p>Chennai</p>
                </div>
            </div>
            <div className='job-card-div2'>
                <div className='job-card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
                {type==="review"?
                <div className="application-review-buttons">
                    <Button variant="contained"  onClick={showProfile} sx={{ color: 'black', backgroundColor: '#d2cece', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<Person2RoundedIcon />}>
                        <p>View full profile</p>
                    </Button>
                    <Button variant="contained"  sx={{ color: 'black', backgroundColor: 'green', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<DoneIcon />}>
                        <p>Approve</p>
                    </Button>
                    <Button variant="contained"  sx={{ color: 'black', backgroundColor: 'red', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<CloseIcon />}>
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