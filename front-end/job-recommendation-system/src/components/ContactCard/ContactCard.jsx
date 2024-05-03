import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
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
export default function ContactCard({ data, contactData }) {
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const [contactInfo, SetContactInfo] = useState({ ...contactData })
    const { register, formState: { errors }, getValues } = useForm({ mode: 'onTouched' | 'onSubmit' });
    function updateContact(data) {
        SetContactInfo(data)
        SetIsNotEditing(true)
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
                        SetIsNotEditing(false)
                        const data = getValues();
                        console.log(data)
                        updateContact(data)
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
                            <p className="contact-p">{contactInfo.mail ? contactInfo.mail : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="github" disabled>
                                <GitHubIcon />
                            </IconButton>
                            <p className="contact-p">{contactInfo.github ? contactInfo.github : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="website" disabled>
                                <PublicIcon />
                            </IconButton>
                            <p className="contact-p">{contactInfo.website ? contactInfo.website : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                    </Stack>

                    :

                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="email" disabled>
                                <EmailIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={contactInfo.mail}
                                placeholder='example@mail.com'
                                error={'mail' in errors}
                                {...register("mail",
                                    {
                                        required: ""
                                    })}>
                            </TextField>
                        </Stack>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="github" disabled>
                                <GitHubIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={contactInfo.github}
                                placeholder='github username'
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
                                defaultValue={contactInfo.website}
                                placeholder='website url'
                                error={'website' in errors}
                                {...register("website",
                                    {
                                        required: ""
                                    })}>
                            </TextField>
                        </Stack>
                    </Stack>

            }
        </form>
    )
}