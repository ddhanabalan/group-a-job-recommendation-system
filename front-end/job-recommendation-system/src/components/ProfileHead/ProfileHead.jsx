import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { FastAverageColor } from 'fast-average-color';
import { Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import AccountSettingsBtn from '../AccountSettingsBtn/AccountSettingsBtn';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import './ProfileHead.css'
export default function ProfileHead({ data, blurFn, logOutFn, subForm, isNotEditing, setIsNotEditing }) {
    const [img, setImg] = useState('');
    const [bannerColor, setBannerColor] = useState('');
    useEffect(() => {
        if (data) {
            setImg(data.profile_picture)
            setBannerColor(data.profile_banner_color)
        }
    }, [data])
    const { register, formState: { errors }, getValues } = useForm({ mode: 'onTouched' | 'onSubmit' });
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const handleChange = (e) => {
        const fac = new FastAverageColor();
        const data = new FileReader();
        data.addEventListener('load', () => {
            setImg(data.result)
            fac.getColorAsync(data.result).then(color => setBannerColor(color.hex))
        })
        data.readAsDataURL(e.target.files[0])

    }

    return (
        <form noValidate autoComplete='on' className="profile-head-section"  >
            <div className="banner" style={{ backgroundColor: bannerColor }}>
                <Stack direction="column" spacing={7} className='feature-actions'>
                    <AccountSettingsBtn logOutFn={logOutFn} />
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
                            subForm({ ...getValues(), 'profile_banner_color': bannerColor, 'profile_picture': img })
                            console.log({ ...getValues(), 'profile_banner_color': bannerColor, 'profile_picture': img })
                        }}>
                            <CheckRoundedIcon />
                        </IconButton>}
                </Stack>
            </div>
            <div className="profile-head-info">
                <div className="profile-head-info-div profile-head-info-div1">
                    {!isNotEditing &&
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            startIcon={<EditIcon />}
                        >
                            <VisuallyHiddenInput type="file" onChange={handleChange} />
                        </Button>
                    }

                    <div className='profile-img-container p-image'>
                        <img src={data.profile_picture ? img : profilePlaceholder} alt="profile picture" />
                    </div>
                </div>
                {isNotEditing ?
                    <div className="profile-head-info-div profile-head-info-div2">
                        <h1 className="profile-name">{data.first_name && data.last_name ? data.first_name + ' ' + data.last_name : <Skeleton className="profile-name" variant="text" sx={{width:'20rem'}} />}</h1>
                        <p className="profile-location">{data.city && data.country ? data.city + ', ' + data.country : <Skeleton className="profile-location" variant="text" sx={{ width: '15rem' }} />}</p>
                        <p className="profile-bio">{data.bio ? data.bio : "Tell the world about yourself"}</p>
                    </div>
                    :
                    <div className="profile-head-info-div profile-head-info-div2">
                        <ProfileEdit data={data} register={register} errors={errors} />
                    </div>
                }
                <div className="profile-head-info-div profile-head-info-div3"></div>
            </div>
        </form>
    )
}