import './Jobs.css';
import CandidateCard from './CandidateCard';
export default function Candidates() {
    const demoInfo = { candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience:2};
    return (
        <div className="cards-container">
            <CandidateCard data={demoInfo} />
        </div>
    )
}