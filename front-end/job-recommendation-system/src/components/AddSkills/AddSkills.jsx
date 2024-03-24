import '../AddTags.css';
import './AddSkills.css';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
export default function AddSkills({ data, updateFn, changeFn, deleteFn, value, tags }) {
    return (
       
            
        <div className='skills-container feature-box feature-box-middle-pane'>
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions skill-feature-actions'>
                <IconButton aria-label="add" onClick={() => updateFn(value)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
                </Stack>
            <TextField id="standard-controlled" placeholder={data.inputPlaceholder} value={value} variant="standard"
                className='tags-add-input skills-add-input'
                    onChange={(event) => {
                        changeFn(event.target.value);
                    }} />

                <Box className='tags-stack' >
                    {
                        tags.map(e => {
                            return (
                                <Chip key={e.id} label={e.tag} color="primary" className='skill'
                                    onDelete={() => deleteFn(e.id)} />
                            )
                        })
                    }
                </Box>
            </div>
       
    )
}