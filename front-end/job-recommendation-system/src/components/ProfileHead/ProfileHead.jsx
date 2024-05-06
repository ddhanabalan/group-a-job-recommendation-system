import { useForm} from 'react-hook-form'
import { useState} from 'react'
import ProfileEdit from '../ProfileEdit/ProfileEdit'
import AccountSettingsBtn from '../AccountSettingsBtn/AccountSettingsBtn';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import './ProfileHead.css'
export default function ProfileHead({ data, blurFn, subForm,isNotEditing,setIsNotEditing}) {
    
    const { register, formState: { errors },getValues } = useForm({ mode: 'onTouched' | 'onSubmit' });
   
  
  
    return (
        <form noValidate autoComplete='on' className="profile-head-section"  >
            <div className="banner">
                <Stack direction="column" spacing={7} className='feature-actions'>
                    <AccountSettingsBtn />
                    {isNotEditing ?
                        <IconButton aria-label="edit" onClick={() => {
                            setIsNotEditing(false)
                            blurFn(true)
                         }}>
                            <EditIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="check" onClick={() => {
                            setIsNotEditing(true)
                            blurFn(false)
                            subForm({...data, ...getValues() })
                         }}>
                            <CheckRoundedIcon />
                        </IconButton>}
                </Stack>
            </div>
            <div className="profile-head-info">
                <div className="profile-head-info-div profile-head-info-div1">
                    <div className='profile-img-container p-image'>
                        <img src={data.profile_picture ? data.profile_picture : profilePlaceholder} alt="profile picture" />
                    </div>
                </div>
                {isNotEditing ?
                    <div className="profile-head-info-div profile-head-info-div2">
                        <h1 className="profile-name">{data.first_name} {data.last_name}</h1>
                        <p className="profile-location">{data.city}, {data.country}</p>
                        <p className="profile-bio">{data.bio?data.bio:"Tell the world about yourself"}</p>
                    </div>
                    :
                    <div className="profile-head-info-div profile-head-info-div2">
                        <ProfileEdit data={data}  register={register} errors={errors} />
                    </div>
                }
                <div className="profile-head-info-div profile-head-info-div3"></div>
            </div>
        </form>
    )
}