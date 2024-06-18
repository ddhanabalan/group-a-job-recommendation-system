import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import '../QualificationAdd/QualificationAdd.css';
export default function LanguageAdd({ languages, submitFn, cancelFn }) {
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onTouched' });
    const [proficiency, setProficiency] = useState("Beginner")

    return (

        <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(submitFn)}>
            <div className="qualification-card-content">

                <div className='qualification-year'>
                    <Autocomplete
                        sx={{ width: 300 }}
                        options={languages}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        componentsProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'flip',
                                        enabled: false
                                    }
                                ]
                            }
                        }}
                        renderInput={(params) => (
                            <TextField className=' qualification-add-h3' placeholder="English" variant="outlined"
                                label="Language" autoComplete='off'
                                {...params}
                                inputProps={{
                                    ...params.inputProps
                                }}
                                error={'language' in errors}
                                {...register("language", {
                                    required: "cannot be empty"
                                })} />
                        )}
                    />

                    <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                        <InputLabel>Proficiency</InputLabel>
                        <Select
                            className=' qualification-add-h3' placeholder="proficiency"
                            error={'language_proficiency' in errors}
                            {...register("language_proficiency", {
                                required: "cannot be empty"
                            })}
                            value={proficiency}
                            label="Language proficiency"
                            onChange={(e) => setProficiency(e.target.value)}
                        >
                            <MenuItem value={"Beginner"}>Beginner</MenuItem>
                            <MenuItem value={"Elementary"}>Elementary</MenuItem>
                            <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                            <MenuItem value={"Proficient"}>Proficient</MenuItem>
                            <MenuItem value={"Native or Bilingual Proficiency"}>Native or Bilingual Proficiency</MenuItem>
                        </Select>
                    </FormControl>
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