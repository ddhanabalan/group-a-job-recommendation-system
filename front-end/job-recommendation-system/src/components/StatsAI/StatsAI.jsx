import './StatsAI.css';
import AiButton from '../AiButton/AiButton';
export default function StatsAI({ value, callFn, aiBtnloading }) {
    const callingFn = () => {
       callFn()
    }
    return (
        <div className="StatsAIContainer">
            <AiButton value={value} callFn={callingFn} loading={aiBtnloading} />
        </div>
    )
}