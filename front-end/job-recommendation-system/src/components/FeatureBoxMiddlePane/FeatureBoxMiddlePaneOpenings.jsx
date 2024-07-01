import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import JobCard from '../JobCard/JobCard';
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import {getStorage} from '../../storage/storage';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePaneOpenings({data, childData}) {
    const demoInfo = { jobTitle: "Python Developer", companyName: "Google LLC",workStyle:"on-site",workingDays:"Monday-Friday", skills: ["python","javascript"], currency: "₹", salary: "50k", postDate: "13/9/23" };
    
    const companyOpenings = data?.vacancies || [];

    
    
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">{data.title}</h4>
            
            <div className="feature-box-container">
            {Object.keys(companyOpenings).length?
            <>
            {Object.keys(companyOpenings).map((card) => (<JobCard key={companyOpenings[card]["id"]} id={companyOpenings[card]["id"]}  data={{ ...companyOpenings[card], 'userType': "seeker" }} />)).slice(0,2)}
            <hr className="line-separator"/>
                <div className='see-openings-footer'>
                    <Link to={data.userType == "employer"?"/employer/review-applications": `/seeker/openings/${getStorage("guestUserID")}/all`} state={{user_id: data.user_id}}>
                        <a className="openings-redirect-button">See all openings<ArrowForwardIcon/></a>
                    </Link>
                </div>
            </>
            :
            <p className='openings-exception-msg'>The organisation doesn't have any job openings at the moment.</p>
        }
                 
            </div>
        </div>
    )
}