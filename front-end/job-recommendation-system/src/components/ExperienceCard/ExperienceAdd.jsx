import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
export default function ExperienceAdd({ submitFn, cancelFn }) {
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onTouched' });

    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(submitFn)}>
            <div className="qualification-card-image"></div>
            <div className="qualification-card-content">
                <TextField sx={{ marginBottom: '.7rem' }} className='qualification-add-h2'
                    label="Title"
                    variant="outlined"
                    placeholder="Ex: Sales Manager"
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    error={'job_name' in errors}
                    {...register("job_name", {
                        required: "Job title cannot be empty"
                    })} />
                <TextField sx={{ marginBottom: '.7rem' }} className='qualification-add-h3'
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
                    <TextField className='qualification-add-p'
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
                    <TextField className='qualification-add-p'
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