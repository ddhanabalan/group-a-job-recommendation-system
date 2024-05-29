import { useForm } from 'react-hook-form';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import './LicenseCard.css';
export default function LicenseCard({ data, deleteFn, submitFn }) {
    const { register, formState: { errors }, handleSubmit, getValues } = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const editData = () => {
        //passing the edited values along with id of the data
        console.log("hello from editData")
        let values = getValues();
        values = { ...values, id: data.id }
        submitFn(values)
        SetIsNotEditing(true)
    }
    return (
        <>
            {isNotEditing ?
                <div className="qualification-card">
                    <div className="qualification-card-image">
                        <IconButton disabled>
                            <CorporateFareRoundedIcon fontSize='large' />
                        </IconButton>
                    </div>
                    <div className="qualification-card-content">
                        <h2 className='qualification-card-h2'>{data.certificate_name}</h2>
                        <h3 className='qualification-card-h3'>{data.certificate_issuer}</h3>
                        <div className='license-card-date-and-url'>
                            <p className='qualification-card-p'>{data.issue_date}</p>
                            {
                                data.credential_url &&
                                <button className='license-card-btn' href={data.credential_url}>
                                    <LinkRoundedIcon fontSize='small' />
                                    View Credential
                                </button>
                            }
                        </div>
                    </div>
                    <div className="qualification-card-action-btns">
                        <Stack direction="column" spacing={2}>
                            <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                                <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteFn(data.id)}>
                                <DeleteRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                            </IconButton>
                        </Stack>
                    </div>
                </div >
                :
                <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(editData)}>
                    <div className="qualification-card-image"></div>
                    <div className="qualification-card-content">
                        <TextField className='qualification-add-h2' defaultValue={data.certificate_name}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: Certified Ethical Hacker"
                            variant="outlined"
                            label="Name"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'certificate_name' in errors}
                            {...register("certificate_name", {
                                required: "Name cannot be empty"
                            })} />
                        <TextField className='qualification-add-h3' defaultValue={data.certificate_issuer}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: Google"
                            variant="outlined"
                            label="Issuing organization"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'certificate_issuer' in errors}
                            {...register("certificate_issuer", {
                                required: "Issuer name cannot be empty"
                            })} />
                        <div className='qualification-year'>
                            <TextField className='qualification-add-p' defaultValue={data.issue_date}
                                placeholder="Nov 2023"
                                variant="outlined"
                                label="Issue date"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'issue_date' in errors}
                                {...register("issue_date", {
                                    required: "cannot be empty"
                                })} />
                            <p>-</p>
                            <TextField className='qualification-add-p' defaultValue={data.credential_url}
                                variant="outlined"
                                label="Credential URL"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'credential_url' in errors}
                                {...register("credential_url", {
                                    required: "cannot be empty"
                                })} />
                        </div>
                    </div>
                    <div className="qualification-card-action-btns">
                        <Stack direction="column" spacing={2}>
                            <IconButton aria-label="check" type='submit'>
                                <CheckRoundedIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="edit" onClick={() => SetIsNotEditing(true)}>
                                <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                            </IconButton>
                        </Stack>
                    </div>
                </form>}
        </>
    )
}