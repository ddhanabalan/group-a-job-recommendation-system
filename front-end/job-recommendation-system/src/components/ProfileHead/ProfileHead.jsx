import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ProfileEdit from '../ProfileEdit/ProfileEdit'
import AccountSettingsBtn from '../AccountSettingsBtn/AccountSettingsBtn';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import './ProfileHead.css'
export default function ProfileHead({ data, blurFn }) {
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onTouched' | 'onSubmit' });
    const [isNotEditing, SetIsNotEditing] = useState(true)
    isNotEditing === false ? blurFn(true) : blurFn(false)
    return (
        <form noValidate autoComplete='on' onSubmit={handleSubmit()} className="profile-head-section"  >
            <div className="banner">
                <Stack direction="column" spacing={7} className='feature-actions'>
                    <AccountSettingsBtn />
                    {isNotEditing ?
                        <IconButton aria-label="edit" onClick={() => { SetIsNotEditing(false) }}>
                            <EditIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="check" onClick={() => { SetIsNotEditing(true) }}>
                            <CheckRoundedIcon />
                        </IconButton>}
                </Stack>
            </div>
            <div className="profile-head-info">
                <div className="profile-head-info-div profile-head-info-div1">
                    <div className='profile-img-container'>
                        <img src={data.profile_picture ? data.profile_picture : profilePlaceholder} alt="profile picture" />
                    </div>
                </div>
                {isNotEditing ?
                    <div className="profile-head-info-div profile-head-info-div2">
                        <h1 className="profile-name">{data.first_name} {data.last_name}</h1>
                        <p className="profile-location">{data.location}, {data.country}</p>
                        <p className="profile-bio">{data.bio}</p>
                    </div>
                    :
                    <div className="profile-head-info-div profile-head-info-div2">
                        {/* <TextField className="profile-name qualification-add profile_info_edit" defaultValue={data.userName} placeholder="Amy Williams" variant="filled"
                            error={'profile_name' in errors}
                            {...register("profile_name", {
                                required: "cannot be empty"
                            })} />
                        <TextField className="profile-location qualification-add  profile_info_edit" defaultValue={data.userLocation} placeholder="Kerala" variant="filled"
                            error={'profile_location' in errors}
                            {...register("profile_location", {
                                required: "cannot be empty"
                            })} />
                        <TextField className="profile-bio qualification-add  profile_info_edit" multiline maxRows="2" defaultValue={data.userBio} placeholder="something about yourself" variant="filled"
                            error={'profile_bio' in errors}
                            {...register("profile_bio", {
                                required: "cannot be empty"
                            })} /> */}
                        <ProfileEdit data={data} />
                    </div>
                }
                <div className="profile-head-info-div profile-head-info-div3"></div>
            </div>
        </form>
    )
}