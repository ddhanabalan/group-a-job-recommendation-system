import './JobCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function JobCard({ data, id, expandView, background, profilePictureStyle, link=null }) {
    console.log("job data received for job card", data)
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false)
    const chips = [data.workStyle, data.workingDays, ...(data.skills?.map(e => e.skill).slice(0, 2) || [])]
    useEffect(()=> {if(redirect===true)
                        {setRedirect(false);
                        navigate(link, { replace: true });}}, [redirect])
    console.log(chips)
    return (
        
        <div className="card" onClick={() => {(link?setRedirect(true):expandView(data.id))}} style={background}>
            <div className='card-div1'>
                
                <h1 className='card-h1'>{data.jobTitle}</h1>
                <p className='card-company-name-p'>{data.companyName}</p>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {chips.map(e => {
                        if(typeof(e)==="string" && e!="")return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    })}

                </Stack>
                <p className='card-salary'>{data.currency} {data.salary[0]}{data.salary[1]? <span>- {data.salary[1]}</span>: <></>} per month</p>
            </div>
            <div className='card-div2'>
                <div className='card-img-container qualification-card-image' style={profilePictureStyle}>
                    {data.companyPic ? <img className='job-card-companyimg' src={data.companyPic} alt="profile" /> :
                        <IconButton disabled>
                            <CorporateFareRoundedIcon fontSize='large' />
                        </IconButton>
                    }
                </div>
                <p className='card-time-p'>{data.postDate}</p>
            </div>
        </div>
    )
}