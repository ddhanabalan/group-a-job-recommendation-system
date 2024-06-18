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
export default function AddPOI({ callAPI, showSuccessMsg, showFailMsg }) {
    const [skill, SetSkill] = useState('');
    const [skills, SetSkills] = useState([]);
    // useEffect(() => {
    //     if (newData.skill) {
    //         SetSkills(newData.skill)
    //     }
    // }, [newData.skill])
    const [skillsList, setSkillsList] = useState([])
    const skillsAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/skills?q=${skill}`)
            setSkillsList([{ "name": "" }, ...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }
    const deleteFn = async (id) => {
        //accepts id of Domain tag and delete them from the array 
        try {
            const response = await userAPI.delete(`/seeker/skill/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetSkills(prevSkills =>
                prevSkills.filter(e => e.id !== id))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };

    const changeFn = (v) => {
        //stores the Domain value from the input field as user types
        SetSkill(v)
    };
    useEffect(() => {
        skillsAPI()
    }, [skill])
    const updateFn = async (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        try {
            if (n !== "") {
                // SetSkills([...skills, { tag: n, id: uuid() }]);
                const response = await userAPI.post('/seeker/skill', { "skill": skill }, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                })
                response.request.status === 201 && showSuccessMsg()
                SetSkill("")
                callAPI()
                console.log("skill", response)
            }
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };
    return (

        <div className='feature-box'>
            <h4 className="feature-title">Position of Interests</h4>
          
                <Stack direction="row" spacing={0} className='feature-actions skill-feature-actions'>
                    <IconButton aria-label="add" onClick={() => updateFn(skill)}>
                        <AddCircleRoundedIcon sx={{ color: 'black' }} />
                    </IconButton>
                </Stack>
           
                <Autocomplete
                    options={skillsList}
                    value={{ "name": skill }}
                    inputValue={skill}
                    autoHighlight
                    getOptionLabel={(option) => option["name"]}
                    isOptionEqualToValue={() => skillsList.some(e => e["name"] === skill)}
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
                            className='tags-add-input skills-add-input'
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
                    skills.map(e => {
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