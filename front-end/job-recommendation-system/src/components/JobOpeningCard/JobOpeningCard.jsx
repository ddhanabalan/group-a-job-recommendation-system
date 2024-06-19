import './JobOpeningCard.css';
import { jobAPI } from '../../api/axios';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function JobOpeningCard({ data, type=null, highlighted, listToDescFunc=null, deleteJobFunc=null }, props) {
    //opening cards show in opening page    
    //console.log("data to opening card", data)

   

    return (
        <div className={`opening-card ${highlighted ? 'highlighted' : ''}`}>
            <div className='opening-card-div1'>
                <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                <p className='opening-card-company-name-p'>{data.companyName}</p>

                <p className='opening-card-salary'>{data.currency} {data.salary[0]} {data.salary[1]?"- "+data.salary[1]:""} per month</p>
                {data.userType == "employer" ?
                    <div className="opening-vacancy-buttons">
                        <Button variant="contained" disableElevation onClick={deleteJobFunc?()=>deleteJobFunc(data.id):undefined} className="opening-delete-button" sx={{ color: 'black', backgroundColor: '#fc2828', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<DeleteOutlineIcon />}>
                            <p>Delete</p>
                        </Button>
                        <Link to="../employer/job-vacancy" state={{...data,edit: true}}>
                            <Button variant="contained" disableElevation className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#38b000', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none" }} endIcon={<EditIcon />}>
                                <p>Edit</p>
                            </Button>
                        </Link>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className={`opening-card-div2${type==="review"?" review":""}`}>
                {type?
                <div className='feature-side'>
                    <div className='application-indicator'>
                        <p>{data.applicationsReceived.length}</p>
                    </div>
                    {highlighted?
                        <Button variant="contained"  onClick={listToDescFunc} sx={{ color: 'black', backgroundColor: 'white', width: 'fit-content', paddingY: "2px", paddingX: "0 10px", textTransform: "none" }} endIcon={<EditIcon />}>
                            <p style={{minWidth:'6rem'}}>View Job Info</p>
                        </Button>
                        :
                        <></>
                    }
                </div>
                :
                <div className='opening-card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
                }
            </div>
        </div>
    )
}