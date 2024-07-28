import { useState, useEffect } from 'react';
import { utilsAPI, userAPI } from '../../api/axios';
import getStorage from '../../storage/storage';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import './AddPOI.css';
export default function AddPOI({ callAPI, showSuccessMsg, showFailMsg }) {
    // poi-position of interests
    const [poi, SetPOI] = useState('');
    const [pois, SetPOIS] = useState([]);
console.log("user poi",pois)
    const [poisList, SetPoisList] = useState([])
    const poiAPI = async () => {
        try {
            const response = await userAPI.get('/seeker/poi', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("poi", response)
            SetPOIS([...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }
    const poiListAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/positions?q=${poi}`)
            SetPoisList([...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        poiAPI()
        poiListAPI()
    }, [])
    useEffect(() => {
        poiListAPI()
    }, [poi])
    const deleteFn = async (id) => {
        //accepts id of Domain tag and delete them from the array 
        try {
            const response = await userAPI.delete(`/seeker/poi/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetPOIS(prevPois =>
                prevPois.filter(e => e.id !== id))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };

    const changeFn = (v) => {
        //stores the poi value from the input field as user types
        SetPOI(v)
    };

    const updateFn = async (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        try {
            if (n !== "") {
                // SetPOIS([...pois, { tag: n, id: uuid() }]);
                console.log("data poi", poi)
                const response = await userAPI.post('/seeker/poi', { "position": poi }, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                })
                response.request.status === 201 && showSuccessMsg()
                SetPOI("")
                poiAPI()
                console.log("poi", response)
            }
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };
    return (

        <div className='feature-box'>
            <h4 className="feature-title">Position of Interests</h4>

            <Stack direction="row" spacing={0} className='feature-actions poi-feature-actions'>
                <IconButton aria-label="add" onClick={() => updateFn(poi)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
            </Stack>

            <Autocomplete
                options={poisList}
                value={{ "position": poi }}
                inputValue={poi}
                autoHighlight
                getOptionLabel={(option) => option["position"]}
                isOptionEqualToValue={() => poisList.some(e => e["position"] === poi)}
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
                    <TextField id="standard-controlled" placeholder={"Senior Accountant"} variant="standard"
                        className='tags-add-input pois-add-input'
                        {...params}
                        inputProps={{
                            ...params.inputProps
                        }}
                        onChange={e => changeFn(e.target.value)}
                    />
                )}
            />


            <Box className='tags-stack' >
                {
                    pois.map(e => {
                        return (
                            <Chip key={e.id} label={e.position} color="primary" className='skill poi'
                                onDelete={() => deleteFn(e.id)} />
                        )
                    })

                }
            </Box>
        </div>

    )
}