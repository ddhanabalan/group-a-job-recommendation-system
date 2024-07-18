import './JobOpeningCard.css';
import { Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
export default function JobOpeningCard({ data, type = null, highlighted = null, listToDescFunc = null, deleteJobFunc = null, invite = null }, props) {
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
                        {data.userType == "employer" && type != "invite" ?
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
                            (data.id == invite ?
                                <div className="job-status-div job-status-reject job-status-opening-card">
                                    <p>Invite</p>
                                    <div className="skill-status blue"></div>
                                </div>
                                : <>
                                    {data.status === "rejected" &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Rejected</p>
                                            <div className="skill-status red"></div>
                                        </div>
                                    }
                                    {data.status === "approved" &&
                                        <div className="job-status-div job-status-approve job-status-opening-card">
                                            <p>Approved</p>
                                            <div className="skill-status green"></div>
                                        </div>
                                    }
                                    {data.status === "Applied" &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Applied</p>
                                            <div className="skill-status yellow"></div>
                                        </div>
                                    }
                                </>
                            )

                        }
                    </div>
                    <div className={`opening-card-div2${type === "review" ? " review" : ""}`}>
                        {type ?
                            <div className='feature-side'>
                                {data.applicationsReceived.length && (type != "invite") ?
                                    <div className='application-indicator'>
                                        <p>{data.applicationsReceived.length}</p>
                                    </div>
                                    :
                                    <div></div>
                                }
                                {highlighted &&
                                    <Tooltip title="View job description" enterDelay={500} leaveDelay={200}>
                                        <IconButton onClick={listToDescFunc} className='view-description-btn'
                                            sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black' }}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                            :
                            <div className='card-img-container qualification-card-image opening-card-img' >
                                <IconButton disabled>
                                    <CorporateFareRoundedIcon fontSize='large' />
                                </IconButton>
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