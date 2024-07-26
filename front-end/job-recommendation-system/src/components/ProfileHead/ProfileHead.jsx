import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { setStorage, getStorage } from '../../storage/storage';
import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import { FastAverageColor } from 'fast-average-color';
import { Button } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import Skeleton from '@mui/material/Skeleton';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import AccountSettingsBtn from '../AccountSettingsBtn/AccountSettingsBtn';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import './ProfileHead.css'
export default function ProfileHead({ access, data, blurFn, logOutFn, subForm, isNotEditing, setIsNotEditing }) {
    const [img, setImg] = useState(null);
    const [user, SetUser] = useState()
    useEffect(() => {
        access !== "viewOnly" ? SetUser(getStorage("userType")) :
            SetUser(getStorage("guestUserType"))
    }, [getStorage("guestUserType")])
    console.log("access", access)
    console.log("user", user)
    const [bannerColor, setBannerColor] = useState('');
    useEffect(() => {
        if (data) {
            data.profile_picture && setImg(data.profile_picture)
            setBannerColor(data.profile_banner_color)
        }
    }, [data])
    const { register, formState: { errors }, getValues, handleSubmit } = useForm({ mode: 'onTouched' | 'onChange' });
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
        setStorage("profile_pic", data.result)
        data.addEventListener('load', () => {
            setImg(data.result)
            fac.getColorAsync(data.result).then(color => setBannerColor(color.hex))
        })
        data.readAsDataURL(e.target.files[0])

    }
    const navigate = useNavigate()
    const methods = useForm({
        mode: 'all', // Optional: Validate on change
    });
    const [errorChild, setErrorChild] = useState(false)
    const isErrorChild = (data) => {
        console.log("receieved error", data)
        setErrorChild(data)
    }
    return (
        <FormProvider {...methods}>
            <form noValidate autoComplete='on' className="profile-head-section"  >
                <div className="banner" style={{ backgroundColor: bannerColor }}>
                    {access === "viewOnly" &&
                        <IconButton aria-label="back" className='banner-back-btn' onClick={() => navigate(-1)}>
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                    }
                    <Stack direction="column" spacing={7} className='feature-actions'>
                        <AccountSettingsBtn logOutFn={logOutFn} access={access} />
                        {access !== "viewOnly" && (
                            isNotEditing ?
                                <IconButton aria-label="edit" onClick={() => {
                                    setIsNotEditing(false)
                                    blurFn(true)
                                }}>
                                    <EditIcon />
                                </IconButton>
                                :
                                <IconButton aria-label="check" onClick={() => {
                                    if (errorChild === false) {
                                        setIsNotEditing(true)
                                        blurFn(false)
                                        subForm({ ...getValues(), 'profile_banner_color': bannerColor, 'profile_picture': img })
                                        console.log({ ...getValues(), 'profile_banner_color': bannerColor, 'profile_picture': img })
                                    }
                                }}>
                                    <CheckRoundedIcon />
                                </IconButton>)
                        }

                    </Stack>
                </div>
                <div className="profile-head-info">
                    <div className="profile-head-info-div profile-head-info-div1">
                        {!isNotEditing &&
                            img === null ?
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                startIcon={<EditIcon />}
                            >
                                <VisuallyHiddenInput type="file" onChange={handleChange} />
                            </Button> :
                            !isNotEditing &&
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                startIcon={<DeleteRoundedIcon />}
                                sx={{
                                    color: 'red'
                                }}
                                onClick={() => {
                                    setImg(null)
                                    setBannerColor('')
                                }}
                            >
                            </Button>

                        }

                        <div className='profile-img-container p-image'>
                            {data.profile_picture || img ? <img src={data.profile_picture || img ? img : profilePlaceholder} alt="profile picture" /> : <Skeleton className="profile-img-container-skeleton" variant="circular" />}
                        </div>
                    </div>
                    {isNotEditing ?
                        (user === "seeker" ?
                            <div className="profile-head-info-div profile-head-info-div2">
                                <h1 className="profile-name">{data.first_name && data.last_name ? data.first_name + ' ' + data.last_name : <Skeleton className="profile-name" variant="text" sx={{ width: '20rem' }} />}</h1>
                                {getStorage("userType") === "recruiter" && access === "viewOnly" && user === "seeker" &&
                                    <Link to="/employer/job-invite" state={{ ...data }}>
                                        <button className='continue-btn send-job-invite-button' >
                                            Invite
                                            <PersonAddAlt1RoundedIcon fontSize='small' />
                                        </button>
                                    </Link>
                                }
                                <p className="profile-location"><FmdGoodRoundedIcon fontSize='small' sx={{ marginRight: '.1rem' }} />{data.city && data.country ? data.city + ', ' + data.country : <Skeleton className="profile-location" variant="text" sx={{ width: '15rem' }} />}</p>
                                <p className="profile-bio">{data.bio ? data.bio : "Tell the world about yourself"}</p>
                            </div>
                            :
                            <div className="profile-head-info-div profile-head-info-div2">
                                <h1 className="profile-name">{data.company_name ? data.company_name : <Skeleton className="profile-name" variant="text" sx={{ width: '20rem' }} />}</h1>
                                <p className="profile-location"><FmdGoodRoundedIcon fontSize='small' sx={{ marginRight: '.1rem' }} />{data.city && data.country ? data.city + ', ' + data.country : <Skeleton className="profile-location" variant="text" sx={{ width: '15rem' }} />}</p>
                                <p className="profile-bio">{data.bio ? data.bio : "Tell the world about yourself"}</p>
                            </div>)
                        :
                        <div className="profile-head-info-div profile-head-info-div2">
                            <ProfileEdit data={data} register={register}  isErrorChild={isErrorChild} />
                        </div>
                    }

                    <div className="profile-head-info-div profile-head-info-div3"></div>
                </div>
            </form >
        </FormProvider>
    )
}