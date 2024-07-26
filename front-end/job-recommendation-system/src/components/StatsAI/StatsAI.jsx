import './StatsAI.css';
import AiButton from '../AiButton/AiButton';
import OpeningsListBar from '../OpeningsListBar/OpeningsListBar';
export default function StatsAI({ value, callFn, aiBtnloading,jobs=[], chooseEntryFunc, jobSearchFunc, listToDescParentFunc, selectedEntry=null, blankModelData=null }) {
    
    return (
        <div className="StatsAIContainer">
            <AiButton value={value} callFn={callFn} loading={aiBtnloading}  jobSelection={selectedEntry} blankModelData={blankModelData}/>
            {value==="candidates" && !selectedEntry && <div className='prompt-text'><p>Select a job vacancy from the list</p></div>}
            {value==="candidates" && <OpeningsListBar data={jobs} userType={"employer"} pageType={"candidates"} chooseEntry={chooseEntryFunc} searchBar={jobSearchFunc} listToDescParentFunc={listToDescParentFunc} revertibleSelection={true}   />}

        </div>
    )
}