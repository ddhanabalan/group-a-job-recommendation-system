import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ExperienceCard from '../ExperienceCard/ExperienceCard';
import ExperienceAdd from '../ExperienceCard/ExperienceAdd';
import NothingToShow from '../NothingToShow/NothingToShow';
export default function ExperienceBox({ access, childData, reloadFn, showSuccessMsg, showFailMsg }) {
    useEffect(() => {
        if (childData) {
            SetExpdata(childData)
        }
    }, [childData])
    const [expdata, SetExpdata] = useState([]);
    const [newExp, SetNewExp] = useState(false)
    const [totalExp, SetTotalExp] = useState(0)
    useEffect(() => {
        updateProfile()
    }, [totalExp])
    const updateProfile = async () => {
        try {

        }
        catch (e) {
            console.log(e)
        }
    }
    const updateTotalExperience = async(data) => {
        try {
            const response = await userAPI.put('/seeker/details', {"experience": data },
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );


        } catch (e) {
            console.log(e)
            // alert(e.message)
        }
    }

    useEffect(() => {
        console.log("totalExp", totalExp)
        updateTotalExperience(totalExp)
    },[totalExp])
    
    const addExperience = async (e) => {
        //accepts new Experience data and adds it into existing array of Experiences
        try {
            const response = await userAPI.post('/seeker/former-job', e, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            // SetTotalExp(parseInt(totalExp) + (parseInt(e.end_year) - parseInt(e.start_year)))
            response.request.status === 201 && showSuccessMsg()
            console.log(response)
            SetNewExp(false)
            reloadFn()
            SetExpdata([...childData, e])
        } catch (error) {
            console.log(error)
            showFailMsg()
        }

    }
    const cancelExp = () => {
        //cancels addition of new Experience
        SetNewExp(false)
    };
    const deleteExp = async (id) => {
        //deletes existing Experience from array by referring to the id passed in
        try {
            const response = await userAPI.delete(`/seeker/former-job/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetExpdata(expdata.filter(e => { return id !== e.id }))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };

    const updateExp = async (data) => {
        //updates existing Experience data from array. new data is passed in along with existing data id
        const { id, ...passData } = data
        console.log("passData", passData)
       
        try {
            const response = await userAPI.put(`/seeker/former-job/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetExpdata(expdata.map(e => {
                if (e.id === data.id) {
                    e = data
                }
                return (e)
            }))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }

    }
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Professional Experience</h4>
            {access !== "viewOnly" &&
                <Stack direction="row" spacing={0} className='feature-actions'>
                    <IconButton aria-label="add" onClick={() => { SetNewExp(true) }}>
                        <AddCircleRoundedIcon />
                    </IconButton>
                </Stack>}

            <div className="feature-box-container">
                {
                    (expdata.length === 0 && !newExp) &&
                    <NothingToShow />
                }

                {newExp && <ExperienceAdd submitFn={addExperience} cancelFn={cancelExp} />}

                {
                    childData && expdata.map(e => {

                        return (
                            <ExperienceCard access={access} data={e} key={uuid()} deleteFn={deleteExp} submitFn={updateExp} cancelFn={cancelExp} />
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}
