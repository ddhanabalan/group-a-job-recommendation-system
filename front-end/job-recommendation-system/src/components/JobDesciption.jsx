import './JobDescription.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@mui/material';
import { useState } from 'react';

export default function JobDesciptionForm({ data, userType }) {
    
    const [submit, setSubmit] = useState(data.applied);
    const [tag_state,setTagState] = useState(false);
    
    //function for senting applicant details from the form to company
    function handleApplication(){
        setSubmit(true);
    }

    return (
        <>
        <div className="job-desc-container">
            <div className="job-desc-header">
                <div className='job-desc-div1'>
                    <h1 className='job-desc-h1'>{data.jobTitle}</h1>
                    <p className='job-desc-company-name-p'>{data.companyName}</p>
                    {data.tags?
                        <Stack className="job-desc-tags" direction="row" spacing={1}>
                            {data.tags.map(e => {
                                return (<Chip key={uuid()} className="job-desc-tags-child" label={e} size='small' />)
                            })}

                        </Stack>
                        :
                        <></>
                    }
                    <p className='job-desc-salary'>{data.currency} {data.salary[0]} - {data.salary[1]} per month</p>
                </div>
                <div className='job-desc-div2'>
                    <div className='job-desc-img-container'>
                        {/* <img src="" alt="" /> */}
                    </div>
                    <p className='job-desc-time-p'>{data.postDate}</p>
                </div>
            </div>
            <hr className="separator"/>
            <div className="job-desc-body">
                <div className="job-details">
                    <p><span >Location:</span> {data.location}</p>
                    <p><span >Employment type:</span>{data.empType}</p>
                    <p><span >Experience:</span> {data.exp}</p>
                </div>

                <div className="job-description">
                    <h6>Job Description</h6>
                    <p className="desc">{data.jobDesc}</p>
                </div> 

                <div className="job-requirements">
                    <h6>Job Requirements</h6>
                    <p className='desc'>{data.jobReq}</p>
                </div> 

                <div className="job-skills">
                    <h6>Skills</h6>
                    {/*skill tags */}
                    <div className='desc'><Stack className="job-desc-tags" direction="row" spacing={1}>
                        {data.skills.map(e => {
                            return (<div className="job-desc-skill-tags-child" key={uuid()}>
                                    {e} {userType=="employer"?
                                            <></>
                                            :
                                            <div className={tag_state?"skill-status red":"skill-status green"}></div>
                                         }
                                    </div>)
                        })}

                    </Stack>
                    </div>
                </div>    
            </div>
            {userType=="employer"?
                <></>
                :
                <div className="apply-button">
                <Button variant="outlined" onClick={handleApplication} sx={{color: submit?"gray":"black", border: "2px solid #254CE1"}} startIcon={submit?<DoneIcon/>:<MailIcon />}>
                <p>{submit?"Applied":"Apply for the job"}</p>
                </Button>
                </div>
            }
        </div>
        </>
    )
}