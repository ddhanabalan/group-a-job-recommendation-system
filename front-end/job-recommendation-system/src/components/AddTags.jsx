import './AddTags.css';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import GoogleLocationSearch from './GoogleLocationSearch';
export default function AddTags({ data, updateFn, changeFn, deleteFn, value, tags, locationFieldAutoValue, updatelocationFieldAutoValue }) {
    return (
        <div>
            <p className="tags-heading">{data.heading}</p>
            <div className='tags-container'>
                <IconButton aria-label="add" className='add-btn' onClick={() => updateFn(value)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
                {data.isLocation
                    ? <GoogleLocationSearch data={data} changeFn={changeFn} locationValue={value} value={locationFieldAutoValue} updateValue={updatelocationFieldAutoValue} />
                    : <TextField id="standard-controlled" placeholder={data.inputPlaceholder} value={value} variant="standard" className='tags-add-input'
                        onChange={(event) => {
                            changeFn(event.target.value);
                        }} />}

                <Box className='tags-stack' >
                    {
                        tags.map(e => {
                            return (
                                <Chip key={e.id} label={e.tag} color="primary" className='tag'
                                    onDelete={() => deleteFn(e.id)} />
                            )
                        })
                    }
                </Box>
            </div>
        </div>
    )
}