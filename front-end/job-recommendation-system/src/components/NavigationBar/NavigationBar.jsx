import { Link } from 'react-router-dom';
import getStorage from '../../storage/storage';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import BackBtn from '../BackBtn/BackBtn';
import Stack from '@mui/material/Stack';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import './NavigationBar.css';
export default function NavigationBar({ active, redirect = null }) {
    console.log("present redirect", redirect);
    const [user, SetUser] = useState()
    useEffect(() => {
        SetUser(getStorage("userType"))
    }, [])

    return (

        //code below needs to be optimized, will focus on this later
        active === 'profile' ?
            <Stack direction="row" className='nav-bar'>
                {
                    redirect ?
                        <div className="nav-back">
                            <Link to={redirect.link} state={{ highlightedId: redirect.presentjobId }}>

                                <BackBtn />

                            </Link>
                        </div>
                        :
                        <></>

                }
                <IconButton aria-label="profile" className='nav-btn-profile nav-btn-active' >
                    <AccountCircleRoundedIcon fontSize='large' />
                </IconButton>
                {user === "seeker" ?
                    <Link to="/jobs">
                        <IconButton aria-label="job/candidate" className='nav-btn-explore'>
                            <WorkRoundedIcon fontSize='large' />
                        </IconButton>
                    </Link> :
                    <Link to="/candidates">
                        <IconButton aria-label="job/candidate" className='nav-btn-explore'>
                            <WorkRoundedIcon fontSize='large' />
                        </IconButton>
                    </Link>
}
            </Stack>
            :
            <Stack direction="row" className='nav-bar'>
                {
                    redirect ?
                        <div className="nav-back">
                            <Link to={redirect.link} state={{ highlightedId: redirect.presentjobId }}>

                                <BackBtn />

                            </Link>
                        </div>
                        :
                        <></>

                }
                <Link to="/profile">
                    <IconButton aria-label="profile" className='nav-btn-profile' >
                        <AccountCircleRoundedIcon fontSize='large' />
                    </IconButton>
                </Link>
                <IconButton aria-label="job/candidate" className='nav-btn-explore nav-btn-active'>
                    <WorkRoundedIcon fontSize='large' />
                </IconButton>

            </Stack>

    )
}