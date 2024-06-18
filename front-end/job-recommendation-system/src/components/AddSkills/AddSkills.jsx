import '../AddTags/AddTags.css';
import './AddSkills.css';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
export default function AddSkills({ access, availableSkills, data, updateFn, changeFn, deleteFn, value, tags, onChange = () => { } }) {
    function updateSkills(tags) {
        //console.log(tagType)
        onChange(tags, "skills");
    }

    useEffect(() => { updateSkills(tags) }, [tags]);
    return (


        <div className='skills-container feature-box feature-box-middle-pane'>
            {data.pageType?
                <></>
                :
                <h4 className="feature-title">{data.title}</h4>
            }
            {access !== "viewOnly" &&
            <Stack direction="row" spacing={0} className='feature-actions skill-feature-actions'>
                <IconButton aria-label="add" onClick={() => updateFn(value)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
            </Stack>}
            {access !== "viewOnly" &&
                <Autocomplete
                    options={availableSkills}
                    value={{ "name": value }}
                    inputValue={value}
                    autoHighlight
                    getOptionLabel={(option) => option["name"]}
                    isOptionEqualToValue={() => availableSkills.some(e => e["name"] === value)}
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
                    onInputChange={(event, newInputValue) => {
                        changeFn(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField id="standard-controlled" placeholder={data.inputPlaceholder} variant="standard"
                            className='tags-add-input skills-add-input'
                            {...params}
                            inputProps={{
                                ...params.inputProps
                            }}
                            onChange={e => changeFn(e.target.value)}
                        />
                    )}
                />
            }

            <Box className='tags-stack' >
                { access!== "viewOnly" ?
                    tags.map(e => {
                        return (
                            <Chip key={e.id} label={e.skill || e.tag} color="primary" className='skill'
                                onDelete={() => deleteFn(e.id)}  />
                        )
                    })
                    :
                    tags.map(e => {
                        return (
                            <Chip key={e.id} label={e.skill || e.tag} color="primary" className='skill' />
                        )
                    })
                }
            </Box>
        </div>

    )
}