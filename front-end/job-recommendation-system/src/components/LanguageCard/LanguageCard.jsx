import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './LanguageCard.css';
export default function LanguageCard({ data, deleteFn ,submitFn}) {
    const { register, formState: { errors }, handleSubmit, getValues } = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const editData = () => {
        //passing the edited values along with id of the data
        let values = getValues();
        values = { ...values, id: data.id }
        submitFn(values)
        SetIsNotEditing(true)
    }
    return (
        <>
            {isNotEditing ?
                <div className="qualification-card">

                    <div className="language-card">
                        <p>{data.language} - {data.language_proficiency}</p>
                    </div>
                    <div className="qualification-card-action-btns">
                        <Stack direction="row" spacing={2}>
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
                   
                    <div className="qualification-card-content">
                        <div className='language-div'>
                            <TextField className='qualification-add qualification-add-h3 language' defaultValue={data.language} placeholder="English" variant="filled"
                                error={'language' in errors}
                                {...register("language", {
                                    required: "cannot be empty"
                                })} />
                            <p>-</p>
                            <TextField className='qualification-add qualification-add-h3 language-pro' defaultValue={data.language_proficiency}  variant="filled"
                                error={'language_proficiency' in errors}
                                {...register("language_proficiency", {
                                    required: "cannot be empty"
                                })} />
                        </div>
                    </div>
                    <div className="qualification-card-action-btns">
                        <Stack direction="row" spacing={2}>
                            <IconButton aria-label="edit" type='submit'>
                                <CheckRoundedIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="edit" onClick={() => SetIsNotEditing(true)}>
                                <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                            </IconButton>
                        </Stack>
                    </div>
                </form>
            }
        </>
    )
}