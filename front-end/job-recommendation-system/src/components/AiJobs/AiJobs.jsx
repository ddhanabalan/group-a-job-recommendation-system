import JobCard from '../JobCard/JobCard';
import './AiJobs.css';
export default function AiJobs({ childData, expandView }) {

    return (
        <div className='ai-jobs-container'>
            {childData.map(e => {
                return <JobCard data={e} expandView={expandView}
                    profilePictureStyle={{backgroundColor:'white'}}
                    background={{ backgroundImage: 'linear-gradient(60deg, rgba(255,255,255,1.00) 0%,rgba(229,153,242,1.00) 100%)', backgroundPosition: 'center center' }} />
            })}
        </div>
    )
}