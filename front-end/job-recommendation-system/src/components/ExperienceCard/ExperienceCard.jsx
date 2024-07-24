import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import dayjs from 'dayjs';
export default function ExperienceCard({ access, data, deleteFn, submitFn }) {
    const { register, formState: { errors }, handleSubmit, getValues, control, setError, watch } = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const editData = () => {
        //passing the edited values along with id of the data
        let values = getValues();
        const formattedStartYear = values.start_year ? format(new Date(values.start_year.year(), values.start_year.month()), 'yyyy') : '';
        // console.log("formattedstart", formattedStartYear)
        const formattedEndYear = values.end_year ? format(new Date(values.end_year.year(), values.end_year.month()), 'yyyy') : '';
        // console.log("formattedEND", formattedEndYear)
        values = { ...values, id: data.id, start_year: formattedStartYear, end_year: formattedEndYear }
        
        if (parseInt(values.start_year) <= parseInt(values.end_year)) {
            submitFn(values)
            SetIsNotEditing(true)
        }
    }
    useEffect(() => {
        const watchFields = watch(["start_year", "end_year"]);
        watchFields[0] !== null && watchFields[0] !== undefined && watchFields[1] !== null && watchFields[1] !== undefined && (watchFields[0]['$y'] > watchFields[1]['$y']) && setError("end_year", { message: "End year must be later than start year." })
    }, [watch(["start_year", "end_year"])])
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
                        <div style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}>
                        <TextField className='qualification-add-h2' defaultValue={data.job_name}
                            sx={{ width: '100%' }}
                            placeholder="Ex: Sales Manager"
                            variant="outlined"
                            label="Title"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'job_name' in errors}
                            {...register("job_name", {
                                required: "Job title cannot be empty",
                                pattern: {
                                    value: /^.{0,128}$/,
                                    message: "Title should be at most 128 characters long."
                                }
                            })} />
                            <p style={{ color: 'red' }}>{errors.job_name && errors.job_name.message !== "cannot be empty" && errors.job_name.message}</p>
                        </div>
                        <div style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}>
                        <TextField className='qualification-add-h3' defaultValue={data.company_name}
                            sx={{ width: '100%' }}
                            placeholder="Ex: Google"
                            variant="outlined"
                            label="Company name"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'company_name' in errors}
                            {...register("company_name", {
                                required: "Company name cannot be empty",
                                pattern: {
                                    value: /^.{0,128}$/,
                                    message: "Company name should be at most 128 characters long."
                                }
                            })} />
                            <p style={{ color: 'red' }}>{errors.company_name && errors.company_name.message !== "cannot be empty" && errors.company_name.message}</p>
                        </div>
                        <div className='qualification-year' style={{ marginBottom: '.5rem' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="start_year"
                                    control={control}
                                    defaultValue={data.start_year && dayjs(data.start_year, "YYYY")}
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
                                        defaultValue={data.end_year && dayjs(data.end_year, "YYYY")}
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