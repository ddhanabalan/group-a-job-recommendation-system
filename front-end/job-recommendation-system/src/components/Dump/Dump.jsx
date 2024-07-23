import { useState } from 'react';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Chip } from '@mui/material';
import './DetailsCard.css';
import { v4 as uuid } from 'uuid';
export default function DetailsCard({ data, companyInfo }) {
    const [isNotEditing, SetIsNotEditing] = useState(true);
    return (
        <form className="details-box">
            <h4 className="details-title">{data.title}</h4>

            <Stack direction="row" spacing={0} className='details-actions'>
                {[companyInfo.dataIcon] &&
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>}
            </Stack>
            {
                isNotEditing ?
                    <Stack direction="column" spacing={2.5} className='details-body'>
                        <div>
                            <p className='stat-title'>Industry</p>
                            <p className='stat-body'>{companyInfo.industry ? companyInfo.industry : <span className='data-not-present-handle'>not linked</span>}</p>
                        </div>
                        <div>
                            <p className='stat-title'>Company size</p>
                            <p className='stat-body'>{companyInfo.companysize ? companyInfo.companysize : <span className='data-not-present-handle'>not linked</span>}</p>
                        </div>
                        <div>
                            <p className='stat-title'>Headquarters</p>
                            <p className='stat-body'>{companyInfo.hq ? companyInfo.hq : <span className='data-not-present-handle'>not linked</span>}</p>
                        </div>
                        <div>
                            <p className='stat-title'>Specialities</p>
                            <div className='stat-body company-tags'>
                                {companyInfo.specialities ? companyInfo.specialities.map(e => {
                                    return (<Chip key={uuid()} className="company-tags-child" label={e} size='small' />)
                                }) :
                                    <span className='data-not-present-handle' style={{ fontSize: ".813rem" }}>not linked</span>}
                            </div>
                        </div>
                        <div>
                            <p className='stat-title'>Locations</p>
                            <p className='stat-body'>{companyInfo.locations ? companyInfo.locations : <span className='data-not-present-handle'>not linked</span>}</p>
                        </div>
                    </Stack>

                    :
                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='contact-medium'>
                            <IconButton aria-label="email" disabled>
                                <EmailIcon />
                            </IconButton>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.industry}
                                placeholder='Automobile'
                                error={'industry' in errors}
                                {...register("industry",
                                    {
                                        required: "",
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