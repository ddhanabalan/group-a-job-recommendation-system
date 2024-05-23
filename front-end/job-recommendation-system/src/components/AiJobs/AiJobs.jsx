import JobCard from '../JobCard/JobCard';
import './AiJobs.css';
export default function AiJobs(cardData) {
    return (
        <div className="ai-jobs-container">
            {cardData.map(e)}
        </div>
    )
}