import { useState, useEffect } from 'react';
import getStorage from '../../storage/storage';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { userAPI } from '../../api/axios';
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
export default function ContactCard({ access, data, contactData, reloadFn, showSuccessMsg, showFailMsg }) {
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const [user, SetUser] = useState()
    const { register, formState: { errors }, getValues, trigger,watch,setError } = useForm({ mode: 'onChange' });
    useEffect(() => {
        SetUser(getStorage("userType"))
    })
    useEffect(() => {
        const watchedField = watch('website')
        if (watchedField !== undefined && watchedField !== null && watchedField.length > 128) {
            console.log("mow")
            'website' in errors ?"": setError("website", { message: "Link should not exceed 128 characters" })
            console.log("bow")
        }
    }, [watch(['website'])])
    async function updateContact(data) {
        SetIsNotEditing(true)
        console.log(data)
        try {
            const response = await userAPI.put(user === "seeker" ? '/seeker/details' : '/recruiter/details', data,
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
        <form className="feature-box" >
            < h4 className="feature-title" > {data.title}</h4 >
            <Stack direction="row" spacing={0} className='feature-actions'>
                {access !== "viewOnly" && (isNotEditing ? [data.editIcon] &&
                    <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                        <EditIcon />
                    </IconButton> :
                    <IconButton aria-label="check" onClick={() => {
                        if (shouldSubmit) {
                            SetIsNotEditing(false)
                            const data = user === "seeker" ? getValues() : { contact_email: getValues("contact_email"), website: getValues("website") };
                           Object.keys(errors).length===0&&updateContact(data)
                        }

                    }}>
                        <CheckRoundedIcon />
                    </IconButton>)}

            </Stack>
            {
                isNotEditing ?
                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <a target='_blank' href={contactData.contact_email !== "" ? `mailto:${contactData.contact_email}` : "#"} style={{ color: 'black' }} rel="noopener noreferrer">
                            <Stack direction="row" spacing={1} className='contact-medium'>
                                <IconButton aria-label="email" disabled>
                                    <EmailIcon />
                                </IconButton>
                                <p className="contact-p">{contactData.contact_email ? contactData.contact_email : <span className='data-not-present-handle'>not linked</span>}</p>
                            </Stack>
                        </a>
                        {user === "seeker" &&
                            <a target='_blank' href={contactData.github !== "" ? `https://github.com/${contactData.github}` : "#"} style={{ color: 'black' }} rel="noopener noreferrer">
                                <Stack direction="row" spacing={1} className='contact-medium'>
                                    <IconButton aria-label="github" disabled>
                                        <GitHubIcon />
                                    </IconButton>
                                    <p className="contact-p">{contactData.github ? contactData.github : <span className='data-not-present-handle'>not linked</span>}</p>
                                </Stack>
                            </a>
                        }
                        <a href={contactData.website ? contactData.website : "#"} target="_blank" rel="noopener noreferrer" style={{ color: 'black' }} >
                            <Stack direction="row" spacing={1} className='contact-medium'>
                                <IconButton aria-label="website" disabled>
                                    <PublicIcon />
                                </IconButton>
                                <p className="contact-p">{contactData.website ? (contactData.website.includes("https://") ? contactData.website.replace("https://", "") : contactData.website.replace("http://", "")) : <span className='data-not-present-handle'>not linked</span>}</p>
                            </Stack>
                        </a>
                    </Stack>

                    :

                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="email" disabled>
                                <EmailIcon />
                            </IconButton>
                            <div style={{ width: '80%' }}>
                                <TextField sx={{ width: '100%' }} className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
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
                                <p className="error-message" style={{ fontSize: '.8rem' }}>{errors.contact_email?.message || ""}</p>
                            </div>
                        </Stack>
                        {user === "seeker" &&
                            <Stack direction="row" spacing={1} className='contact-medium'>
                                <IconButton aria-label="github" disabled>
                                    <GitHubIcon />
                                </IconButton>
                                <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                    sx={{ width: '80%' }}
                                    defaultValue={contactData.github}
                                    placeholder='username'
                                    error={'github' in errors}
                                    {...register("github",
                                        {
                                            required: ""
                                        })}>
                                </TextField>
                            </Stack>
                        }
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="website" disabled>
                                <PublicIcon />
                            </IconButton>
                            <div style={{ width: '80%' }}>
                                <TextField sx={{ width: '100%' }} className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
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
                                <p className="error-message" style={{ fontSize: '.8rem' }}>{errors.website?.message || ""}</p>
                            </div>
                        </Stack>

                    </Stack>

            }
        </form >
    )
}