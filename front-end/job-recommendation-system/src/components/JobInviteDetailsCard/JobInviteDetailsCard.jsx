import './JobInviteDetailsCard.css'
import { jobAPI } from '../../api/axios';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function JobInviteDetailsCard({ data, type=null, highlighted = null, listToDescFunc=null, deleteJobFunc=null }, props) {
    //job-invite-details cards show in job-invite-details page    
    //console.log("data to job-invite-details card", data)

   

    return (
        <div className={`job-invite-details-card ${highlighted ? 'highlighted' : ''}`}>
            {data.length!=0?
                <>
                <div className='job-invite-details-card-div1'>
                    <h1 className='job-invite-details-card-h1'>{data.jobTitle}</h1>
                    <p className='job-invite-details-card-company-name-p'>{data.companyName}</p>

                    <p className='job-invite-details-card-salary'>{data.currency} {data.salary[0]} {data.salary[1]?"- "+data.salary[1]:""} per month</p>
                    {data.userType == "employer" && type!="invite" ?
                        <div className="job-invite-details-vacancy-buttons">
                            <Button variant="contained" disableElevation onClick={deleteJobFunc?()=>deleteJobFunc(data.id):undefined} className="job-invite-details-delete-button" sx={{ color: 'black', backgroundColor: '#fc2828', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<DeleteOutlineIcon />}>
                                <p>Delete</p>
                            </Button>
                            <Link to="../employer/job-vacancy" state={{...data,edit: true}}>
                                <Button variant="contained" disableElevation className="job-invite-details-edit-button" sx={{ color: 'black', backgroundColor: '#38b000', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<EditIcon />}>
                                    <p>Edit</p>
                                </Button>
                            </Link>
                        </div>
                        :
                        <></>
                    }
                </div>
                <div className={`job-invite-details-card-div2`}>
                    
                    <div className='details-side'>
                    <p><span >Location:</span> {data.location}</p>
                    <p><span >Employment type: </span>{data.empType}</p>
                    <p><span >Experience:</span> {data.exp}</p>
                    <p><span >Work Style:</span> {data.workStyle}</p>
                    <p><span >Working Days:</span> {data.workingDays}</p> 
                        
                    </div>
                    
                </div>
            
            </>
            :
            <></>
            }
        </div>
    )
}