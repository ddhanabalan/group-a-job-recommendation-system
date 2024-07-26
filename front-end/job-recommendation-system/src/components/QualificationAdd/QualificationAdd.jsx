import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import './QualificationAdd.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import dayjs from 'dayjs';
export default function QualificationAdd({ submitFn, cancelFn }) {
    const { register, formState: { errors }, handleSubmit, control, setError, watch } = useForm({ mode: 'onTouched' });
    const formatData = (data) => {
        const formattedStartYear = data.start_year ? format(new Date(data.start_year.year(), data.start_year.month()), 'yyyy') : '';
        // console.log("formattedstart", formattedStartYear)
        const formattedEndYear = data.end_year ? format(new Date(data.end_year.year(), data.end_year.month()), 'yyyy') : '';
        // console.log("formattedEND", formattedEndYear)
        const watchFields = watch(["start_year", "end_year"]);
        (watchFields[0]['$y'] <= watchFields[1]['$y']) && submitFn({ ...data, start_year: formattedStartYear, end_year: formattedEndYear })

    }
    useEffect(() => {
        const watchFields = watch(["start_year", "end_year"]);
        watchFields[0] !== null && watchFields[0] !== undefined && watchFields[1] !== null && watchFields[1] !== undefined && (watchFields[0]['$y'] > watchFields[1]['$y']) && setError("end_year", { message: "End year must be later than start year." })
    }, [watch(["start_year", "end_year"])])
    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(formatData)}>
            <div className="qualification-card-image">
                <IconButton disabled>
                    <CorporateFareRoundedIcon fontSize='large' />
                </IconButton>
            </div>
            <div className="qualification-card-content">
                <div style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}>
                    <TextField sx={{ width: '100%' }} className='qualification-add-h2'
                    label="Course/Degree"
                    variant="outlined"
                    placeholder="Ex: B.Tech in Electronics"
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    error={'education_title' in errors}
                    {...register("education_title", {
                        required: "qualification cannot be empty",
                        pattern: {
                            value: /^.{0,128}$/,
                            message: "Course/Degree should be at most 128 characters long."
                        }
                    })} />
                    <p style={{ color: 'red' }}>{errors.education_title && errors.education_title.message !== "cannot be empty" && errors.education_title.message}</p>
                </div>
                <div style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}>
                    <TextField sx={{ width: '100%' }} className='qualification-add-h3'
                    placeholder="Ex: Harvard University"
                    variant="outlined"
                    label="School/College"
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    error={'education_provider' in errors}
                    {...register("education_provider", {
                        required: "qualification provider cannot be empty",
                        pattern: {
                            value: /^.{0,128}$/,
                            message: "School/College should be at most 128 characters long."
                        }
                    })} />
                    <p style={{ color: 'red' }}>{errors.education_provider && errors.education_provider.message !== "cannot be empty" && errors.education_provider.message}</p>
                </div>
                <div className='qualification-year' style={{ marginBottom: '.5rem' }}>
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
                                        textField: {
                                            size: 'small', InputLabelProps: { shrink: true }, placeholder: "2000", error: 'start_year' in errors,
                                            ...register("start_year", {
                                                required: "cannot be empty"
                                            })
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField className='qualification-add-p'
                                            {...params}
                                            variant="outlined"
                                        />
                                    }
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <p>-</p>
                    <div style={{ width: '45%' }}>
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
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            textField: {
                                                size: 'small', InputLabelProps: { shrink: true }, placeholder: "2000", error: 'end_year' in errors,
                                                ...register("end_year", {
                                                    required: "cannot be empty"
                                                })
                                            }
                                        }}
                                        renderInput={(params) =>
                                            <TextField className='qualification-add-p'
                                                {...params}
                                                variant="outlined"
                                            />
                                        }
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <p style={{ color: 'red', position: 'absolute' }}>{errors.end_year && errors.end_year.message !== "cannot be empty" && errors.end_year.message}</p>
                    </div>
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