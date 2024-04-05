import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import QualificationAdd from '../QualificationAdd/QualificationAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import CreateFormTextFields from '../CreateJobVacancyForm/CreateFormTextFields';
import JobCard from '../JobCard/JobCard';
import { Button } from '@mui/material';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePaneOpenings({data, childData}) {
    const demoInfo = { jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: "50k", postDate: "13/9/23" };
 
    
    
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">{data.title}</h4>
            
            <div className="feature-box-container">
                <JobCard data={demoInfo}/>
                <JobCard data={demoInfo}/>
                <JobCard data={demoInfo}/>
                <hr className="line-separator"/>
                <div>
                    <a className="openings-redirect-button" href="/employer/openings">See all openings<ArrowForwardIcon/></a>
                </div> 
            </div>
        </div>
    )
}