import '../Jobs/Jobs.css';
import CandidateCard from '../CandidateCard/CandidateCard';
import AiCandidates from '../AiCandidates/AiCandidates';
export default function Candidates({type}) {
    const demoInfo = { candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2};
    return (
        <div className="cards-container">
            <AiCandidates childData={[demoInfo]} />
            <CandidateCard data={demoInfo} type={type}/>
        </div>
    )
}