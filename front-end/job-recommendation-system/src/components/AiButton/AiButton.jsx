import './AiButton.css';
import AiBtn from '../../images/AI-Icon.svg';
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import AiBtnAnimated from '../../images/Ai-btn-animated.json'
import Tooltip from '@mui/material/Tooltip';
export default function ({ value, callFn, loading, jobSelection=null, blankModelData=null }) {
    const [errorMsg, setErrorMsg] = useState(null);
    const generateDelay=(timeout, callFn, value=null)=>{
        setTimeout(() => {value?callFn(value):callFn()}, timeout);
    };
    const modelCallingFn=async ()=>{
        if (value ==="candidates" && !jobSelection)return;
        const r = await callFn();
        console.log("recorded response", r, blankModelData);
        if(!r){
            console.log("recorded response error")
            setErrorMsg("Our recommmendation engine is facing some issues.Try again later");
        } 
        else if( r && blankModelData===true){setErrorMsg("No recommendations found")}
        console.log("blank model ", blankModelData);
        
    }

    useEffect(()=>{errorMsg && generateDelay(2000, setErrorMsg, null)}, [errorMsg])
    
    // const [loading, SetLoading] = useState(false);
    return (
        <div className="ai-btn-container">
            <h3 className='ai-btn-h3'>Let us Find the Best</h3>
            <p className='ai-btn-p'>{value} based on your choices and activities</p>
            <Tooltip title="Get AI recommendations" enterDelay={500} leaveDelay={100}>
            <button className="ai-btn" onClick={!errorMsg && modelCallingFn}>
                {loading ? <Lottie animationData={AiBtnAnimated} loop={true} /> : <img src={AiBtn} alt="Ai Button" />}
                </button>
            </Tooltip>
            {
                errorMsg && <div><p>{errorMsg}</p></div>
            }
            {
                /*value==="candidates" && !jobSelection && <div className='prompt-text'><p>Select a job vacancy from the list</p></div>*/ //uncomment this for job vacancy selection prompt to appear inside AI button
            }
        </div>
    )
}