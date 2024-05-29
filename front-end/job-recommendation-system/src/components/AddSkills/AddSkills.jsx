import '../AddTags/AddTags.css';
import './AddSkills.css';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
export default function AddSkills({ availableSkills, data, updateFn, changeFn, deleteFn, value, tags }) {
    return (


        <div className='skills-container feature-box feature-box-middle-pane'>
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions skill-feature-actions'>
                <IconButton aria-label="add" onClick={() => updateFn(value)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
            </Stack>
            <Autocomplete
                options={availableSkills}
                value={{"Skill Name":value}}
                inputValue={value}
                autoHighlight
                getOptionLabel={(option) => option["Skill Name"]}
                isOptionEqualToValue={() => availableSkills.some(e => e["Skill Name"] === value )}
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
                        onChange={e=>changeFn(e.target.value)}
                    />
                )}
            />


            <Box className='tags-stack' >
                {
                    tags.map(e => {
                        return (
                            <Chip key={e.id} label={e.skill} color="primary" className='skill'
                                onDelete={() => deleteFn(e.id)} />
                        )
                    })
                }
            </Box>
        </div>

    )
}