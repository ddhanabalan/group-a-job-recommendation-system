import CandidateCard from '../CandidateCard/CandidateCard';
import './AiCandidates.css';
export default function AiCandidates({ childData, expandView }) {

    return (
        <div className='ai-jobs-container'>
            {childData.map(e => {
                return <CandidateCard data={e} 
                    profilePictureStyle={{backgroundColor:'white'}}
                    background={{ backgroundImage: 'linear-gradient(60deg, rgba(255,255,255,1.00) 0%,rgba(229,153,242,1.00) 100%)', backgroundPosition: 'center center' }} />
            })}
        </div>
    )
}