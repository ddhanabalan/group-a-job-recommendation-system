import './AiButton.css';
import AiBtn from '../../images/AI-Icon.svg';
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import AiBtnAnimated from '../../images/Ai-btn-animated.json'
export default function ({ value, callFn, loading, jobSelection=null, blankModelData=null }) {
    const [errorMsg, setErrorMsg] = useState(null);
    const generateDelay=(timeout, callFn, value=null)=>{
        setTimeout(() => {value?callFn(value):callFn()}, timeout);
    };
    const modelCallingFn=async ()=>{
        if (value ==="candidates" && !jobSelection)return;
        const r = await callFn();
        console.log("recorded response", r)
        if(!r){
            setErrorMsg("Our recommmendation engine is facing some issues.Try again later");
        } 
        else if(blankModelData===true){setErrorMsg("No recommendations found")}
        console.log("blank model ", blankModelData);
        
    }

    useEffect(()=>{errorMsg && generateDelay(3000, setErrorMsg, null)}, [errorMsg])
    
    // const [loading, SetLoading] = useState(false);
    return (
        <div className="ai-btn-container">
            <h3 className='ai-btn-h3'>Let us Find the Best</h3>
            <p className='ai-btn-p'>{value} based on your choices and activities</p>
            <button className="ai-btn" onClick={!loading && modelCallingFn}>
                {loading ? <Lottie animationData={AiBtnAnimated} loop={true} /> : <img src={AiBtn} alt="Ai Button" />}
            </button>
            {
                errorMsg && <div><p>{errorMsg}</p></div>
            }
            {
                /*value==="candidates" && !jobSelection && <div className='prompt-text'><p>Select a job vacancy from the list</p></div>*/ //uncomment this for job vacancy selection prompt to appear inside AI button
            }
        </div>
    )
}