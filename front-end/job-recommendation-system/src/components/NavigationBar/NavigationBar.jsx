import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import './NavigationBar.css';
export default function NavigationBar({ active }) {


    return (

        //code below needs to be optimized, will focus on this later
        active === 'profile' ?
            <Stack direction="row" className='nav-bar'>
                <IconButton aria-label="profile" className='nav-btn-profile nav-btn-active' >
                    <AccountCircleRoundedIcon fontSize='large' />
                </IconButton>
                <Link to="/jobs">
                    <IconButton aria-label="job/candidate" className='nav-btn-explore'>
                        <WorkRoundedIcon fontSize='large' />
                    </IconButton>
                </Link>
            </Stack>
            : <Stack direction="row" className='nav-bar'>
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