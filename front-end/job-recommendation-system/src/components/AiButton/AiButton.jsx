import './AiButton.css';
import AiBtn from '../../images/AI-Icon.svg';
import { useState } from 'react';
import Lottie from "lottie-react";
import AiBtnAnimated from '../../images/Ai-btn-animated.json'
export default function ({ value, callFn, loading, jobSelection=null }) {
    // const [loading, SetLoading] = useState(false);
    return (
        <div className="ai-btn-container">
            <h3 className='ai-btn-h3'>Let us Find the Best</h3>
            <p className='ai-btn-p'>{value} based on your choices and activities</p>
            <button className="ai-btn" onClick={() => { callFn() }}>
                {loading ? <Lottie animationData={AiBtnAnimated} loop={true} /> : <img src={AiBtn} alt="Ai Button" />}
            </button>
            {
                /*value==="candidates" && !jobSelection && <div className='prompt-text'><p>Select a job vacancy from the list</p></div>*/ //uncomment this for job vacancy selection prompt to appear inside AI button
            }
        </div>
    )
}