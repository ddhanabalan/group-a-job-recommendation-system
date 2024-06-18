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
export default function ExperienceCard({ access,data, deleteFn, submitFn }) {
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
                        <h2 className='qualification-card-h2'>{data.job_name}</h2>
                        <h3 className='qualification-card-h3'>{data.company_name}</h3>
                        <p className='qualification-card-p'>{data.start_year + " - " + data.end_year}</p>
                    </div>
                    <div className="qualification-card-action-btns">
                        {access !== "viewOnly" &&
                            <Stack direction="column" spacing={2}>
                                <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                                    <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => deleteFn(data.id)}>
                                    <DeleteRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                                </IconButton>
                            </Stack>
                        }
                    </div>
                </div >
                :
                <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(editData)}>
                    <div className="qualification-card-image"></div>
                    <div className="qualification-card-content">
                        <TextField className='qualification-add-h2' defaultValue={data.job_name}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: Sales Manager"
                            variant="outlined"
                            label="Title"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'job_name' in errors}
                            {...register("job_name", {
                                required: "Job title cannot be empty"
                            })} />
                        <TextField className='qualification-add-h3' defaultValue={data.company_name}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: Google"
                            variant="outlined"
                            label="Company name"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'company_name' in errors}
                            {...register("company_name", {
                                required: "Company name cannot be empty"
                            })} />
                        <div className='qualification-year'>
                            <TextField className='qualification-add-p' defaultValue={data.start_year}
                                placeholder="2000"
                                variant="outlined"
                                label="Start year"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'start_year' in errors}
                                {...register("start_year", {
                                    required: "cannot be empty"
                                })} />
                            <p>-</p>
                            <TextField className='qualification-add-p' defaultValue={data.end_year} 
                                placeholder="2010"
                                variant="outlined"
                                label="End year"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'end_year' in errors}
                                {...register("end_year", {
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