import { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './LanguageCard.css';
export default function LanguageCard({  languages,data, deleteFn ,submitFn}) {
    const { register, formState: { errors }, handleSubmit, getValues,setValue} = useForm({ mode: 'onTouched' });
    const [isNotEditing, SetIsNotEditing] = useState(true)
    useEffect(()=>setValue('language',data.language),[])
    const [proficiency, setProficiency] = useState(data.language_proficiency)
    const editData = () => {
        //passing the edited values along with id of the data
        let values = getValues();
        console.log(values)
        values = { ...values, id: data.id }
        submitFn(values)
        SetIsNotEditing(true)
    }
    return (
        <>
            {isNotEditing ?
                <div className="qualification-card">

                    <div className="language-card">
                        <p>{data.language} - {data.language_proficiency}</p>
                    </div>
                    <div className="qualification-card-action-btns">
                        <Stack direction="row" spacing={2}>
                            <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                                <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteFn(data.id)}>
                                <DeleteRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                            </IconButton>
                        </Stack>
                    </div>
                </div >
                :
                <form className='qualification-add-form qualification-card' noValidate autoComplete='on' onSubmit={handleSubmit(editData)}>
                   
                    <div className="qualification-card-content">
                        <div className='language-div'>
                            <Autocomplete
                                sx={{ width: 300 }}
                                options={languages}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                defaultValue={{ name:data.language }}
                                isOptionEqualToValue={()=>languages.some(e=>e.name===data.language)}
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
                            <IconButton aria-label="edit" onClick={() => SetIsNotEditing(true)}>
                                <CloseRoundedIcon sx={{ color: 'red' }} fontSize='small' />
                            </IconButton>
                        </Stack>
                    </div>
                </form>
            }
        </>
    )
}