import { useForm, Controller } from 'react-hook-form';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import './LicenseCard.css';
export default function LicenseCard({ access, data, deleteFn, submitFn }) {
    const { register, formState: { errors }, handleSubmit, getValues, control } = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const editData = () => {
        //passing the edited values along with id of the data
        console.log("hello from editData")
        let values = getValues();
        const formattedDate = values.issue_date ? format(new Date(values.issue_date["$y"], values.issue_date["$M"]), 'MMMM yyyy') : '';
        console.log("formattedDate", formattedDate)
        values = { ...values, id: data.id, issue_date: formattedDate }
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
                                <a href={data.credential_url} rel="noopener noreferrer" target="_blank">
                                    <button className='license-card-btn'>
                                        <LinkRoundedIcon fontSize='small' />
                                        View Credential
                                    </button>
                                </a>
                            }
                        </div>
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
                            {/* <TextField className='qualification-add-p' defaultValue={data.issue_date}
                                placeholder="Nov 2023"
                                variant="outlined"
                                label="Issue date"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'issue_date' in errors}
                                {...register("issue_date", {
                                    required: "cannot be empty"
                                })} /> */}{console.log("dayjsdate", dayjs(data.issue_date, 'MMMM YYYY'))}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="issue_date"
                                    control={control}
                                    defaultValue={data.issue_date && dayjs(data.issue_date, 'MMMM YYYY')}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker label="Issue date" views={['year', 'month']}
                                            disableFuture
                                            value={value}
                                            openTo='year'
                                            onChange={(date) => {
                                                onChange(dayjs(date));
                                            }}
                                            sx={{ width: '50%' }}
                                            slotProps={{
                                                textField: { size: 'small', InputLabelProps: { shrink: true }, placeholder: "Nov 2023" }
                                            }}
                                            renderInput={(params) =>
                                                <TextField className='qualification-add-p'
                                                    {...params}
                                                    variant="outlined"
                                                    error={'issue_date' in errors}
                                                    {...register("issue_date", {
                                                        required: "cannot be empty"
                                                    })} />
                                            }
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            <p>-</p>
                            <TextField className='qualification-add-p' defaultValue={data.credential_url}
                                variant="outlined"
                                label="Credential URL - include https://"
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                error={'credential_url' in errors}
                                {...register("credential_url", {
                                    required: "cannot be empty"
                                })} />
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
                            </Stack>
                        }
                    </div>
                </form>}
        </>
    )
}