import './JobOpeningCard.css';
import { jobAPI } from '../../api/axios';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function JobOpeningCard({ data, type = null, highlighted=null, listToDescFunc = null, deleteJobFunc = null }, props) {
    //opening cards show in opening page    
    //console.log("data to opening card", data)



    return (
        <div className={`opening-card ${highlighted ? 'highlighted' : ''}`}>
            {data.length != 0 ?
                <>
                    <div className='opening-card-div1'>
                        <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                        <p className='opening-card-company-name-p'>{data.companyName}</p>

                        <p className='opening-card-salary'>{data.currency} {data.salary[0]} {data.salary[1] ? "- " + data.salary[1] : ""} per month</p>
                        {data.userType == "employer" && type!="invite"?
                            <div className="opening-vacancy-buttons">
                                <Button variant="contained" disableElevation onClick={deleteJobFunc ? () => deleteJobFunc(data.id) : undefined} className="opening-delete-button" sx={{ color: '#f6cacc', backgroundColor: '#ff0000', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<DeleteOutlineIcon />}>
                                    Delete
                                </Button>
                                <Link to="../employer/job-vacancy" state={{ ...data, edit: true }}>
                                    <Button variant="contained" disableElevation className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<EditIcon />}>
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <div className={`opening-card-div2${type === "review" ? " review" : ""}`}>
                        {type ?
                            <div className='feature-side'>
                                {data.applicationsReceived.length && (type!="invite")?
                                    <div className='application-indicator'>
                                        <p>{data.applicationsReceived.length}</p>
                                    </div>
                                    :
                                    <div></div>
                                }
                                {highlighted ?
                                    <Button variant="contained" onClick={listToDescFunc} sx={{ color: 'black', backgroundColor: 'white', width: 'fit-content', paddingY: "2px", paddingX: "0 10px", textTransform: "none" }} endIcon={<EditIcon />}>
                                        <p style={{ minWidth: '6rem' }}>View Job Info</p>
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

                </>
                :
                <></>
            }
        </div>
    )
}