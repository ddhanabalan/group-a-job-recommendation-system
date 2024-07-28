import { userAPI } from '../../api/axios';
import { useEffect,useState } from 'react';
import getStorage from '../../storage/storage';
import CandidateCard from '../CandidateCard/CandidateCard';
import AiCandidates from '../AiCandidates/AiCandidates';
import '../Jobs/Jobs.css';
export default function Candidates({ type, candidateData, modelData=[], setAiCandidates=null }) {
    
    const demoInfo = [{ candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 }];
    console.log("model data candidates", modelData)
    return (
        <div className="cards-container">
            {modelData.length? <AiCandidates childData={modelData} setAiCandidates={setAiCandidates}/>:<></>}
            {candidateData.map((e) => <CandidateCard data={e} type={type} />)}
        </div>
    )
}

