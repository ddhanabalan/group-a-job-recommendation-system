import { useState,useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import './AiJobs.css';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import  {v4 as uuid} from 'uuid';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
export default function AiJobs({ childData, expandView, setAiJobs }) {
    useEffect(() => {
        if(childData)setRecJobs(childData);
    },[childData])
    const [recJobs, setRecJobs] = useState([])
    return (
        recJobs.length > 0 &&
        <div className='ai-jobs-container'>
            <h3 className='ai-jobs-h3'>Ai recommened Jobs &nbsp; <AutoAwesomeRoundedIcon sx={{ color:'rgba(220, 3, 255, 1)'}}/></h3>
            {
                recJobs.map(e => {
                    
                return <JobCard data={{...e, 'userType': "seeker"}} expandView={expandView}
                    key={uuid()} id={e["id"]}  
                    profilePictureStyle={{backgroundColor:'white'}}
                    background={{ backgroundImage: 'linear-gradient(60deg, rgba(255,255,255,1.00) 0%,rgba(229,153,242,1.00) 100%)', backgroundPosition: 'center center' }} />
            })}
                <button className='ai-clear-response-btn' onClick={() => setAiJobs([])} >
                Clear response
                <div class="arrow-wrapper">
                   <CloseRoundedIcon/>
                </div>
            </button>
        </div>
    )
}