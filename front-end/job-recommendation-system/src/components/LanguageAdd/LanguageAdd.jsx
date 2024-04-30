import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import '../QualificationAdd/QualificationAdd.css';
export default function LanguageAdd({ submitFn, cancelFn }) {
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onTouched' });

    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(submitFn)}>
            <div className="qualification-card-content">
                
                <div className='qualification-year'>
                    <TextField className='qualification-add qualification-add-h3' placeholder="English" variant="filled"
                        error={'language' in errors}
                        {...register("language", {
                            required: "cannot be empty"
                        })} />
                    <p>-</p>
                    <TextField className='qualification-add qualification-add-h3' placeholder="proficiency" variant="filled"
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
                    <IconButton aria-label="edit" onClick={() => { cancelFn() }}>
                        <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                    </IconButton>
                </Stack>
            </div>
        </form>

    )
}