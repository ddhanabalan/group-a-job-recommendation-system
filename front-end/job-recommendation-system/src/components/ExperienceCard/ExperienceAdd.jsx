import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
export default function ExperienceAdd({ submitFn, cancelFn }) {
    const { register, formState: { errors }, handleSubmit, setValue, control } = useForm({ mode: 'onTouched' });
    const formatData = (data) => {
        const formattedStartYear = data.start_year ? format(new Date(data.start_year.year(), data.start_year.month()), 'yyyy') : '';
        // console.log("formattedstart", formattedStartYear)
        const formattedEndYear = data.end_year ? format(new Date(data.end_year.year(), data.end_year.month()), 'yyyy') : '';
        // console.log("formattedEND", formattedEndYear)
        submitFn({ ...data, start_year: formattedStartYear, end_year: formattedEndYear })

    }
    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(formatData)}>
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
                    {/* <TextField className='qualification-add-p'
                        placeholder="2000"
                        variant="outlined"
                        label="Start year"
                        InputLabelProps={{ shrink: true }}
                        size='small'
                        error={'start_year' in errors}
                        {...register("start_year", {
                            required: "cannot be empty"
                        })} /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="start_year"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker label="Start year" views={['year']}
                                    disableFuture
                                    value={value}
                                    onChange={(date) => {
                                        onChange(date);
                                    }}
                                    sx={{ width: '45%' }}
                                    slotProps={{
                                        textField: { size: 'small', InputLabelProps: { shrink: true }, placeholder: "2000" }
                                    }}
                                    renderInput={(params) =>
                                        <TextField className='qualification-add-p'
                                            {...params}
                                            variant="outlined"
                                            error={'start_year' in errors}
                                            {...register("start_year", {
                                                required: "cannot be empty"
                                            })} />
                                    }
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <p>-</p>
                    {/* <TextField className='qualification-add-p'
                        placeholder="2010"
                        variant="outlined"
                        label="End year"
                        InputLabelProps={{ shrink: true }}
                        size='small'
                        error={'end_year' in errors}
                        {...register("end_year", {
                            required: "cannot be empty"
                        })} /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="end_year"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker label="End year" views={['year']}
                                    disableFuture
                                    value={value}
                                    onChange={(date) => {
                                        onChange(date);
                                    }}
                                    sx={{ width: '45%' }}
                                    slotProps={{
                                        textField: { size: 'small', InputLabelProps: { shrink: true }, placeholder: "2000" }
                                    }}
                                    renderInput={(params) =>
                                        <TextField className='qualification-add-p'
                                            {...params}
                                            variant="outlined"
                                            error={'end_year' in errors}
                                            {...register("end_year", {
                                                required: "cannot be empty"
                                            })} />
                                    }
                                />
                            )}
                        />
                    </LocalizationProvider>
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