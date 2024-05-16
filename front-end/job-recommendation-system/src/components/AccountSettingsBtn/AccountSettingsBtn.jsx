import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import './AccountSettingsBtn.css';
export default function AccountSettingsBtn() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
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
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={handleClose}><LogoutRoundedIcon />Logout</MenuItem>
                <Divider orientation="horizontal" variant="middle" flexItem />
                <MenuItem onClick={handleClose}><SupportAgentRoundedIcon />Help</MenuItem>
                <Divider orientation="horizontal" variant="middle" flexItem />
                <MenuItem sx={{ color: 'red' }} onClick={handleClose}><DeleteOutlineRoundedIcon />Delete Account</MenuItem>
            </Menu>
        </div>
    );
}