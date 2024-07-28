import { Link } from 'react-router-dom';
import getStorage from '../../storage/storage';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import BackBtn from '../BackBtn/BackBtn';
import Stack from '@mui/material/Stack';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded';
import Tooltip from '@mui/material/Tooltip';
import './NavigationBar.css';
export default function NavigationBar({ active, redirect = null }) {
    console.log("present redirect", redirect);
    const [user, SetUser] = useState()
    useEffect(() => {
        SetUser(getStorage("userType"))
    }, [])

    return (

        //code below needs to be optimized, will focus on this later

        <Stack direction="row" className='nav-bar'>
            <Link to="/profile">
                <Tooltip title="Profile" enterDelay={500} leaveDelay={100}>
                    <IconButton aria-label="profile" className={`nav-btn-profile ${active == "profile" ? "nav-btn-active" : ""}`} >
                        <AccountCircleRoundedIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
            </Link>
            {user === "seeker" ?
                <>
                    <Link to="/jobs">
                        <Tooltip title="Explore Jobs" enterDelay={500} leaveDelay={100}>
                            <IconButton aria-label="job/candidate" className={`nav-btn-explore ${active == "jobs" ? "nav-btn-active" : ""}`}>
                                <WorkRoundedIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Link to="/seeker/applications">
                        <Tooltip title="Job Activity" enterDelay={500} leaveDelay={100}>
                            <IconButton aria-label="job/candidate" className={`nav-btn-application-approval ${active == "job-applications" ? "nav-btn-active" : ""}`}>
                                <ArticleRoundedIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </>
                :
                <>
                    <Link to="/candidates">
                        <Tooltip title="Explore Candidates" enterDelay={500} leaveDelay={100}>
                            <IconButton aria-label="job/candidate" className={`nav-btn-explore ${active == "candidates" ? "nav-btn-active" : ""}`}>
                                <WorkRoundedIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Link to="/employer/review-applications">
                        <Tooltip title="Candidate Management" enterDelay={500} leaveDelay={100}>
                        <IconButton aria-label="job/candidate" className={`nav-btn-review-applications ${active == "review-applications" ? "nav-btn-active" : ""}`}>
                            <ContactPageRoundedIcon fontSize='large' />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </>
            }
        </Stack>


    )
}