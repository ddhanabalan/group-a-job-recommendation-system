import './AddTags.css';
import { Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import GoogleLocationSearch from '../GoogleLocationSearch/GoogleLocationSearch';
import { useEffect } from 'react';

export default function AddTags({ data, availableDomains, updateFn, changeFn, deleteFn, value, tags, locationFieldAutoValue, updatelocationFieldAutoValue, tagType = null, onChange = () => { }, fSize = "auto" }) {
    //component for selecting tags
    function updateTags(tags) {
        //console.log(tagType)
        { tagType ? onChange(tags, tagType) : onChange(tags) }
    }

    useEffect(() => { console.log("updated with", tags);
                        updateTags(tags); }, [tags]);
    return (
        <div>
            {/*Optional heading*/}
            {data.heading == "" ? <></> : <p className="tags-heading">{data.heading}</p>}
            <div className='tags-container'>
                <IconButton aria-label="add"
                    className='add-btn'
                    onClick={() => { updateFn(value) }}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>

                {/*textfield with or without google location search for tagging places*/}
                {data.isLocation
                    ? <GoogleLocationSearch data={data} changeFn={changeFn} locationValue={value} value={locationFieldAutoValue} updateValue={updatelocationFieldAutoValue} />
                    : <Autocomplete
                        options={availableDomains}
                        value={{ "name": value }}
                        inputValue={value}
                        autoHighlight
                        getOptionLabel={(option) => option["name"]}
                        isOptionEqualToValue={() => availableDomains.some(e => e["name"] === value)}
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

                {/*final tags layout*/}
                <Box className='tags-stack' >
                    {
                        tags.map(e => {
                            if (e.tag !== "") {
                                return (
                                    <Chip key={e.id} label={e.tag} color="primary" className='tag' sx={{ '& .MuiChip-label': { fontSize: fSize } }}
                                        onDelete={() => { deleteFn(e.id) }} />
                                )
                            }
                        })
                    }
                </Box>
            </div>
        </div>
    )
}