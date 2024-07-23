import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { forwardRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.


const autocompleteService = { current: null };

const GoogleLocationSearch = forwardRef(function GoogleLocationSearch({ data, changeFn, locationValue, value, updateValue, textFieldType = "standard", disUnderline = false, textBgColor = "#D9D9D9", textPad = "0px", bordRad = "0px", fntFam = "auto", fntSize = "auto", use="jobs", ...props }, ref) {
    const MAPS_API_KEY = 'pk.0da703607c1469e631ae01d8480aa43e';
    const [query, setQuery] = useState(locationValue || '');
    const [options, setOptions] = useState([]);

    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        
        loaded.current = true;
    }

    const fetch = async () => {
        
        const response = await axios.get(
            `https://api.locationiq.com/v1/autocomplete?key=${MAPS_API_KEY}&q=${query}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        console.log("query", query,"location only", response.data);
        response.status === 200 && setOptions(response.data);
    };

    React.useEffect(() => {
        if(query !== '') {
        fetch();}
    }, [query]);

    return (
        <Autocomplete
            id="google-map-demo"
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
                {console.log("option type", typeof(option))
                return option.display_name}
                /*{if(typeof(option) === "object"){
                    console.log("received", typeof(option), option)
                    return option.display_name;
                }
                else {
                    console.log("received", typeof(option), option)
                    return option;
                }}*/
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No locations"
            onChange={(event, newValue) => {
                //setOptions(options);
                console.log("new", newValue)
                updateValue(newValue.address? (newValue.address.name?(newValue.address.name + ","):"") + (newValue.address.state?(newValue.address.state + ","):"")  + (newValue.address.country?(newValue.address.state):""): null) || "";
            }}
            onInputChange={(event, newInputValue) => {
                setQuery(newInputValue);
                setOptions(options);
                console.log("added", newInputValue)
                changeFn(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} placeholder={data.inputPlaceholder} value={locationValue} variant={textFieldType} className='tags-add-input'
                    InputProps={{
                        ...params.InputProps,
                        disableUnderline: disUnderline,
                    }}
                    inputRef={ref}
                    sx={{
                        backgroundColor: textBgColor,
                        paddingX: textPad,
                        borderRadius: bordRad,
                        '.MuiInputBase-input': { fontFamily: fntFam, fontSize: fntSize },
                    }}
                    {...props} />

            )}
            renderOption={(props, option) => {
                
                const match = (option.address?option.address.name + "," + (option.address.state?option.address.state + ",":"")  + option.address.country: null) || "";
                const place_index = option.place_id;
                console.log("passed options", option, place_index)

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44 }}>
                                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                        
                                    <Box
                                        key={uuid()}
                                        component="span"
                                        sx={{ fontWeight: 'regular' }}
                                    >
                                        {match}
                                    </Box>
        
                                
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
})

export default GoogleLocationSearch;