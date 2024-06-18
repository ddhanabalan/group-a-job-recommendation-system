import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import './AccountSettingsBtn.css';
export default function AccountSettingsBtn({ access,logOutFn }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteAcc, SetDeleteAcc] = useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = () => {
        SetDeleteAcc(true)
    }
    return (
        <div>
            {deleteAcc && <Navigate to='/delete' />}
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <SettingsRoundedIcon />
            </IconButton>
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 20,
                    horizontal: 180,
                }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={logOutFn}><LogoutRoundedIcon />Logout</MenuItem>
                <Divider orientation="horizontal" variant="middle" flexItem />
                <MenuItem onClick={handleClose}><SupportAgentRoundedIcon />Help</MenuItem>
                {access !== "viewOnly" &&
                    <Divider orientation="horizontal" variant="middle" flexItem />
                }
                {access !== "viewOnly" && 
                <MenuItem sx={{ color: 'red' }} onClick={handleDelete}><DeleteOutlineRoundedIcon />Delete Account</MenuItem>
                }
            </Menu>
        </div>
    );
}