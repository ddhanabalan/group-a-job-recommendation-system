import { useForm,Controller } from 'react-hook-form';
import { useState } from 'react';
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
import './QualificationCard.css';
export default function QualificationCard({ access, data, deleteFn, submitFn }) {
    const { register, formState: { errors }, handleSubmit, getValues,control } = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const editData = () => {
        //passing the edited values along with id of the data
        let values = getValues();
        const formattedStartYear = values.start_year ? format(new Date(values.start_year.year(), values.start_year.month()), 'yyyy') : '';
        // console.log("formattedstart", formattedStartYear)
        const formattedEndYear = values.end_year ? format(new Date(values.end_year.year(), values.end_year.month()), 'yyyy') : '';
        // console.log("formattedEND", formattedEndYear)
        values = { ...values, id: data.id, start_year: formattedStartYear, end_year: formattedEndYear }
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
                        <h2 className='qualification-card-h2'>{data.education_title}</h2>
                        <h3 className='qualification-card-h3'>{data.education_provider}</h3>
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
                        <TextField className='qualification-add-h2' defaultValue={data.education_title}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: B.Tech in Electronics"
                            variant="outlined"
                            label="Course/Degree"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'education_title' in errors}
                            {...register("education_title", {
                                required: "qualification cannot be empty"
                            })} />
                        <TextField className='qualification-add-h3' defaultValue={data.education_provider}
                            sx={{ marginBottom: '.7rem' }}
                            placeholder="Ex: Harvard University"
                            variant="outlined"
                            label="School/College"
                            InputLabelProps={{ shrink: true }}
                            size='small'
                            error={'education_provider' in errors}
                            {...register("education_provider", {
                                required: "qualification cannot be empty"
                            })} />
                        <div className='qualification-year'>
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
                        {access !== "viewOnly" &&
                            <Stack direction="column" spacing={2}>
                                <IconButton aria-label="check" type='submit'>
                                    <CheckRoundedIcon fontSize='small' />
                                </IconButton>
                                <IconButton aria-label="edit" onClick={() => SetIsNotEditing(true)}>
                                    <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                                </IconButton>
                            </Stack>}

                    </div>
                </form>}
        </>
    )
}