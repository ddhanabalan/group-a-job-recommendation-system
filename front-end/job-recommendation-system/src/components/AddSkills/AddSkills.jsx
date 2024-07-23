import '../AddTags/AddTags.css';
import './AddSkills.css';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import {useState, useEffect } from 'react';
import { userAPI, utilsAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
export default function AddSkills({ access, data, newData,reloadFn,showSuccessMsg, showFailMsg,onChange = () => { } }) {
    const [skillsList, setSkillsList] = useState([])
    const [skill, SetSkill] = useState('');
    const [skills, SetSkills] = useState([]);
    
    useEffect(() => {
        const skillsAPI = async () => {
            try {
                const response = await utilsAPI.get(`/api/v1/skills?q=${skill}`)
                console.log(response.data)
                setSkillsList([ ...response.data])
            }
            catch (e) {
                console.log(e)
            }
        }
        skillsAPI()
    }, [skill])

   
    useEffect(() => {
        if (newData.skill) {
            SetSkills(newData.skill)
        }
    }, [newData.skill])
    const deleteFn = async (id) => {
        //accepts id of skill and delete them from the array 
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
        //stores the  skill from the input field as user types
        SetSkill(v)
    };

    const updateFn = async (n) => {
        //accepts a new  skill from the input field and updates the  array to display the newly added skill and resets the input box skill when user clicks the add button
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
                reloadFn()
                console.log("skill", response)
            }
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };
    function updateSkills(skills) {
        onChange(skills, "skills");
    }

    useEffect(() =>  updateSkills(skills) , [skills]);
    return (


        <div className='skills-container feature-box feature-box-middle-pane'>
            {data.pageType?
                <></>
                :
                <h4 className="feature-title">{data.title}</h4>
            }
            {access !== "viewOnly" &&
            <Stack direction="row" spacing={0} className='feature-actions skill-feature-actions'>
                <IconButton aria-label="add" onClick={() => updateFn(skill)}>
                    <AddCircleRoundedIcon sx={{ color: 'black' }} />
                </IconButton>
            </Stack>}
            {access !== "viewOnly" &&
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

            <Box className='tags-stack' >
                { access!== "viewOnly" ?
                    skills.map(e => {
                        return (
                            <Chip key={e.id} label={e.skill || e.tag} color="primary" className='skill'
                                onDelete={() => deleteFn(e.id)}  />
                        )
                    })
                    :
                    skills.map(e => {
                        return (
                            <Chip key={e.id} label={e.skill || e.tag} color="primary" className='skill' />
                        )
                    })
                }
            </Box>
        </div>

    )
}