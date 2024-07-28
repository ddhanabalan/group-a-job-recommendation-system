import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { userAPI } from '../../api/axios';
import getStorage from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PublicIcon from '@mui/icons-material/Public';
import './DetailsCard.css';
// import '../FeatureBox/FeatureBox.css';
// import './ContactCard.css';
export default function ContactCard({access, data, companyInfo, reloadFn, showSuccessMsg, showFailMsg }) {
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const { register, formState: { errors }, getValues, trigger, setError } = useForm({});
    async function updateContact(data) {
        SetIsNotEditing(true)
        console.log(data)
        try {
            const response = await userAPI.put('/recruiter/details', data,
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );
            response.request.status === 200 && showSuccessMsg()
            reloadFn()
        } catch (e) {
            console.log(e)
            showFailMsg()
        }

    }
    const [shouldSubmit, setShouldSubmit] = useState(true)
    const onTrigger = async () => {
        const result = await trigger(["website", "contact_email"])
        result ? setShouldSubmit(true) : setShouldSubmit(false)
    }
    return (
        <form className="feature-box detail-box" >
            < h4 className="feature-title" > {data.title}</h4 >
            <Stack direction="row" spacing={0} className='feature-actions'>
                {access!=="viewOnly"&& (isNotEditing ? [data.editIcon] &&
                    <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                        <EditIcon />
                    </IconButton> :
                    <IconButton aria-label="check" onClick={() => {
                        if (shouldSubmit) {
                            SetIsNotEditing(false)
                            const data = getValues();
                            updateContact(data)
                        }

                    }}>
                        <CheckRoundedIcon />
                    </IconButton>)}
            </Stack>
            {
                isNotEditing ?
                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="industry" disabled>
                                    <FactoryRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Industry</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.industry ? companyInfo.industry : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>

                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="company size" disabled>
                                    <GroupsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Company size</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.company_size ? companyInfo.company_size : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="headquarters" disabled>
                                    <LocationCityRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Headquarters</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.headquarters ? companyInfo.headquarters : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        {/* <Stack direction="row" spacing={1} className='contact-medium detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="specialities" disabled>
                                    <StarsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Specialities</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.specialities ? companyInfo.specialities : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack> */}
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="locations" disabled>
                                    <AddLocationAltRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Locations</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.locations ? companyInfo.locations : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                    </Stack>

                    :

                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="industry" disabled>
                                    <FactoryRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Industry</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.industry}
                                placeholder='Automobile'
                                error={'industry' in errors}
                                {...register("industry")}>
                            </TextField>
                        </Stack>

                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="company size" disabled>
                                    <GroupsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Company size</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.company_size}
                                placeholder='10000+'
                                error={'company_size' in errors}
                                {...register("company_size", {
                                    pattern: {
                                        value: /^\d+$/,
                                        message: "only numbers allowed"
                                    },
                                    onChange: onTrigger
                                })}>
                            </TextField>
                        </Stack>
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="headquarters" disabled>
                                    <LocationCityRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Headquarters</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.headquarters}
                                placeholder='Tampa, FL'
                                error={'headquarters' in errors}
                                {...register("headquarters")}>
                            </TextField>
                        </Stack>
                        {/* <Stack direction="row" spacing={1} className='contact-medium detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="email" disabled>
                                    <StarsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Specialities</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.specialities}
                                error={'specialities' in errors}
                                {...register("specialities")}>
                            </TextField>
                        </Stack> */}
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="locations" disabled>
                                    <AddLocationAltRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Locations</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.locations}
                                placeholder='8+'
                                error={'locations' in errors}
                                {...register("locations",
                                    {
                                        pattern: {
                                            value: /^\d+$/,
                                            message: "only numbers allowed"
                                        },
                                        onChange: onTrigger
                                    })}>
                            </TextField>
                        </Stack>
                    </Stack>

            }
        </form>
    )
}