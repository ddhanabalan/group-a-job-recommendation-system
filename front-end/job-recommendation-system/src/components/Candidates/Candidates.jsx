import { userAPI } from '../../api/axios';
import { useEffect,useState } from 'react';
import getStorage from '../../storage/storage';
import CandidateCard from '../CandidateCard/CandidateCard';
import AiCandidates from '../AiCandidates/AiCandidates';
import '../Jobs/Jobs.css';
export default function Candidates({ type }) {
    const [candidateList, setCandidateList] = useState([]);
    const candidateAPI = async () => {
        try {
            const response = await userAPI.get('/seeker/details/list', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
           setCandidateList(response.data)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        candidateAPI()
    }, [])
    console.log(candidateList)
    const demoInfo = { candidateName: "Amy Williams", location: "Kerala, India", tags: ["on-site", "software / IT", "Monday-Friday"], experience: 2 };
    return (
        <div className="cards-container">
            {/* <AiCandidates childData={[demoInfo]} /> */}
            {candidateList.map((e) => <CandidateCard data={e} type={type} />)}
        </div>
    )
}