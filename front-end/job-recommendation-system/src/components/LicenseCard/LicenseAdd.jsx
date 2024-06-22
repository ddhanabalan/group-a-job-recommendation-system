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
export default function LicenseAdd({ submitFn, cancelFn }) {
    const { control, register, formState: { errors }, handleSubmit, setValue } = useForm({ mode: 'onTouched' });

    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(submitFn)}>
            <div className="qualification-card-image"></div>
            <div className="qualification-card-content">
                <TextField sx={{ marginBottom: '.7rem' }} className='qualification-add-h2'
                    label="Name"
                    variant="outlined"
                    placeholder="Ex: Certified Ethical Hacker"
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    error={'certificate_name' in errors}
                    {...register("certificate_name", {
                        required: "Name cannot be empty"
                    })} />
                <TextField sx={{ marginBottom: '.7rem' }} className='qualification-add-h3'
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
                    {/* <TextField className='qualification-add-p'
                        placeholder="Nov 2023"
                        variant="outlined"
                        label="Issue date"
                        InputLabelProps={{ shrink: true }}
                        size='small'
                        error={'issue_date' in errors}
                        {...register("issue_date", {
                            required: "cannot be empty"
                        })} /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="issue_date"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker label="Issue date" views={['month', 'year']}
                                    disableFuture
                                    value={value}
                                // onChange={onChange}
                                    onChange={(date) => {
                                        console.log("date", date)
                                        const formattedDate = date ? format(new Date(date["$y"], date["$M"]), 'MMMM yyyy') : '';
                                        console.log("formattedDate", formattedDate)
                                        setValue('issue_date', formattedDate);
                                        onChange(formattedDate);
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
                    <TextField className='qualification-add-p'
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