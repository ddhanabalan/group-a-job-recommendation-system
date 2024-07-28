import CandidateCard from '../CandidateCard/CandidateCard';
import './AiCandidates.css';
import { useEffect, useState } from 'react';
import  {v4 as uuid} from 'uuid';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
export default function AiCandidates({ childData = [], expandView, setAiCandidates=null }) {
    useEffect(() => {
        if(childData)setRecCandidates(childData);
    },[childData])
    const [recCandidates, setRecCandidates] = useState([])
    console.log("child Data received ", childData)
    return (
        recCandidates.length > 0 &&
        <div className='ai-jobs-container'>
            {recCandidates.map(e => {
                return <CandidateCard key={uuid()} data={e} 
                    profilePictureStyle={{backgroundColor:'white'}}
                    background={{ backgroundImage: 'linear-gradient(60deg, rgba(255,255,255,1.00) 0%,rgba(229,153,242,1.00) 100%)', backgroundPosition: 'center center' }} />
            })}
            <button className='ai-clear-response-btn' onClick={setAiCandidates} >
                Clear response
                <div class="arrow-wrapper">
                   <CloseRoundedIcon/>
                </div>
            </button>
        </div>

    )
}