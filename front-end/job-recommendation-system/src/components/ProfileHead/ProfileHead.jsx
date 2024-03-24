import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import './ProfileHead.css'
export default function ProfileHead({ data }) {
    return (
        <div className="profile-head-section">
            <div className="banner">
                <Stack direction="column" spacing={7} className='feature-actions'>
                    <IconButton aria-label="settings">
                        <SettingsRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>
                </Stack>
            </div>
            <div className="profile-head-info">
                <div className="profile-head-info-div profile-head-info-div1">
                    <div className='profile-img-container'>
                        {/* <img src="" alt="" /> */}
                    </div>
                </div>
                <div className="profile-head-info-div profile-head-info-div2">
                    <h1 className="profile-name">{data.userName}</h1>
                    <p className="profile-location">{data.userLocation}</p>
                    <p className="profile-bio">{data.userBio}</p>
                </div>
                <div className="profile-head-info-div profile-head-info-div3"></div>
            </div>
        </div>
    )
}