import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './QualificationAdd.css';
export default function QualificationAdd({submitFn,cancelFn}) {
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onTouched' });
   
    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(submitFn)}>
            <div className="qualification-card-image"></div>
            <div className="qualification-card-content">
                <TextField className='qualification-add qualification-add-h2' placeholder="Qualification title" variant="filled"
                error={'qualification' in  errors}
                    {...register("qualification", {
                        required:"qualification cannot be empty"
                    })} />
                <TextField className='qualification-add qualification-add-h3' placeholder="Certifying institution" variant="filled"
                    error={'qualification_provider' in errors}
                    {...register("qualification_provider", {
                        required: "qualification cannot be empty"
                    })} />
                <div className='qualification-year'>
                    <TextField className='qualification-add qualification-add-p'  placeholder="2000" variant="filled"
                        error={'start_year' in errors}
                        {...register("start_year", {
                            required: "cannot be empty"
                        })} />
                    <p>-</p>
                    <TextField className='qualification-add qualification-add-p'  placeholder="2010" variant="filled"
                        error={'end_year' in errors}
                        {...register("end_year", {
                            required: "cannot be empty"
                        })} />
                </div>

            </div>
            <div className="qualification-card-action-btns">
                <Stack direction="column" spacing={2}>
                    <IconButton aria-label="edit" type='submit'>
                        <CheckRoundedIcon fontSize='small' />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={()=>{cancelFn()}}>
                        <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small'/>
                    </IconButton>
                </Stack>
            </div>
        </form>

    )
}