import './JobOpeningCard.css';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import {  Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function JobOpeningCard({ data, highlighted}, props) {
    //opening cards show in opening page    
    
    return (
        <div className={`opening-card ${highlighted?'highlighted':''}`}>
            <div className='opening-card-div1'>
                <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                <p className='opening-card-company-name-p'>{data.companyName}</p>
                
                <p className='opening-card-salary'>{data.currency} {data.salary[0]} - {data.salary[1]} per month</p>
                {data.userType=="employer"?
                    <div className="opening-vacancy-buttons">
                        <Button variant="contained" className="opening-delete-button" sx={{color: 'black', backgroundColor: 'red',width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none"}} endIcon={<DeleteOutlineIcon />}>
                        <p>Delete</p>
                        </Button>
                        <Link to="../employer/job-vacancy" state={data}>
                            <Button variant="contained"  className="opening-edit-button" sx={{color: 'black', backgroundColor: 'green',width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none"}} endIcon={<EditIcon />}>
                            <p>Edit</p>
                            </Button>
                        </Link>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className='opening-card-div2'>
                <div className='opening-card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
            </div>
        </div>
    )
}