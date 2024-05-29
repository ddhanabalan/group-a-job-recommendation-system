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
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PublicIcon from '@mui/icons-material/Public';
import '../FeatureBox/FeatureBox.css';
import './ContactCard.css';
export default function ContactCard({ data, contactData, subForm }) {
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const { register, formState: { errors }, getValues, trigger, setError } = useForm({ });
    async function updateContact(data) {
        SetIsNotEditing(true)
        console.log(data)
        // try {
        //     await userAPI.put('/seeker/details', data);

        // } catch (e) {
        //     console.log(e)
        //     alert(e.message)
        // }
        subForm({ ...contactData, ...data })
    }
    const [shouldSubmit, setShouldSubmit] = useState(true)
    const onTrigger = async () => {
        const result = await trigger(["website", "contact_email"])
        result ? setShouldSubmit(true) : setShouldSubmit(false)
    }
    return (
        <form className="feature-box" >
            < h4 className="feature-title" > {data.title}</h4 >
            <Stack direction="row" spacing={0} className='feature-actions'>
                {isNotEditing ? [data.editIcon] &&
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
                    </IconButton>}
                {/* {data.addIcon &&
                    <IconButton aria-label="add">
                        <AddCircleRoundedIcon />
                    </IconButton>} */}
            </Stack>
            {
                isNotEditing ?
                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="email" disabled>
                                <EmailIcon />
                            </IconButton>
                            <p className="contact-p">{contactData.contact_email ? contactData.contact_email : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="github" disabled>
                                <GitHubIcon />
                            </IconButton>
                            <p className="contact-p">{contactData.github ? contactData.github : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="website" disabled>
                                <PublicIcon />
                            </IconButton>
                            <p className="contact-p">{contactData.website ? contactData.website : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                    </Stack>

                    :

                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="email" disabled>
                                <EmailIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={contactData.contact_email}
                                placeholder='example@mail.com'
                                error={'contact_email' in errors}
                                {...register("contact_email",
                                    {
                                        pattern: {
                                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                            message: "Email not valid"
                                        },
                                        onChange: onTrigger
                                    })}>
                            </TextField>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="github" disabled>
                                <GitHubIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={contactData.github}
                                placeholder='username'
                                error={'github' in errors}
                                {...register("github",
                                    {
                                        required: ""
                                    })}>
                            </TextField>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="website" disabled>
                                <PublicIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                onInput={onTrigger}
                                defaultValue={contactData.website}
                                placeholder='website url'
                                error={'website' in errors}
                                {...register("website",
                                    {
                                        pattern: {
                                            value: /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9_\-.]+\.[a-zA-Z]{2,5}(\/\S*)?$/,
                                            message: "invalid website"
                                        },
                                        onChange: onTrigger
                                    })}>
                            </TextField>
                        </Stack>
                        <p className="error-message">{errors.website?.message || ""}</p>
                    </Stack>

            }
        </form>
    )
}