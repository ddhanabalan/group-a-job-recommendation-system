import './AddTags.css';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import GoogleLocationSearch from './GoogleLocationSearch';
import { useEffect } from 'react';

export default function AddTags({ data, updateFn, changeFn, deleteFn, value, tags, locationFieldAutoValue, updatelocationFieldAutoValue, onChange=()=>{}, fSize="auto" }) {
    //component for selecting tags
    function updateTags(tags){
        onChange(tags)
    }

    useEffect(() => {updateTags(tags)}, [tags]);
    return (
        <div>
            {/*Optional heading*/}
            {data.heading==""?<></>:<p className="tags-heading">{data.heading}</p>}
            <div className='tags-container'>
                <IconButton aria-label="add" 
                            className='add-btn' 
                            onClick={() => {updateFn(value)}}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>

            {/*textfield with or without google location search for tagging places*/}
                {data.isLocation
                    ? <GoogleLocationSearch data={data} changeFn={changeFn} locationValue={value} value={locationFieldAutoValue} updateValue={updatelocationFieldAutoValue} />
                    : <TextField id="standard-controlled" placeholder={data.inputPlaceholder} value={value} variant="standard" className='tags-add-input'
                        onChange={(event) => {
                            changeFn(event.target.value);
                        }} />}

            {/*final tags layout*/}
                <Box className='tags-stack' >
                    {
                        tags.map(e => {
                            return (
                                <Chip key={e.id} label={e.tag} color="primary" className='tag' sx={{'& .MuiChip-label': {fontSize: fSize}}}
                                 onDelete={() => {deleteFn(e.id)}} />
                            )
                        })
                    }
                </Box>
            </div>
        </div>
    )
}