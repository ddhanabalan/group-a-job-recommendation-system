import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const GoogleLocationSearch = forwardRef(({ data, textFieldType = "standard", changeFn, locationValue, disUnderline = false, style = null, register, ...props }, ref) => {
    const MAPS_API_KEY = 'pk.0da703607c1469e631ae01d8480aa43e';
    const [query, setQuery] = useState(locationValue || '');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions([]);
        const fetch = async () => {
            const response = await axios.get(
                `https://api.locationiq.com/v1/autocomplete?key=${MAPS_API_KEY}&q=${query}`
            );
            console.log("location", response.data);
            response.status === 200 && setOptions(response.data);
        };
        query !== '' && fetch();
    }, [query]);

    return (
        <Autocomplete
            {...props}
            sx={{ width: 300 }}
            options={options}
            autoHighlight
            getOptionLabel={(option) => option.address.name}
            noOptionsText="No locations"
            value={options.find(option => option.address.name === locationValue) || null}
            onInputChange={(event, newInputValue) => {
                setQuery(newInputValue);
            }}
            onChange={(event, newValue) => {
                if (newValue) {
                    setQuery(newValue.address.name);
                    changeFn(newValue.address.name);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={data.inputPlaceholder}
                    variant={textFieldType}
                    autoComplete='off'
                    inputProps={{
                        ...params.inputProps,
                        ...register // Apply register function
                    }}
                    sx={style || {
                        backgroundColor: '#D9D9D9',
                        paddingX: '0px',
                        borderRadius: '0px',
                         }}
                    ref={ref} // Attach ref to input element
                />
            )}
        />
    );
});

export default GoogleLocationSearch;
