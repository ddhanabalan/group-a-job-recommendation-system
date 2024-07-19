import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';


export default function GoogleLocationSearch({ data, textFieldType = "standard", changeFn, disUnderline = false }) {
    const MAPS_API_KEY = 'pk.0da703607c1469e631ae01d8480aa43e';
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions([]);
        const fetch = async () => {
            const response = await axios.get(
                ` https://api.locationiq.com/v1/autocomplete?key=${MAPS_API_KEY}&q=${query}`
            );
            console.log("location", response.data);
            response.status = 200 && setOptions(response.data);
        };
        query !== '' && fetch();

    }, [query])


    return (

        <Autocomplete
            sx={{ width: 300 }}
            options={options}
            autoHighlight
            getOptionLabel={(option) => option.address.name}
            noOptionsText="No locations"
            onInputChange={(event, newInputValue) => {
                setQuery(newInputValue)
                changeFn(newInputValue);
            }}
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
                <TextField className='tags-add-input' placeholder={data.inputPlaceholder} variant={textFieldType}
                    autoComplete='off'
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        disableUnderline: disUnderline
                    }}
                    sx={{
                        backgroundColor: '#D9D9D9',
                        paddingX: '0px',
                        borderRadius:'0px',
                        '.MuiInputBase-input': { fontFamily: 'auto', fontSize:'auto' },
                    }}
                />
            )}
        />
    )
}