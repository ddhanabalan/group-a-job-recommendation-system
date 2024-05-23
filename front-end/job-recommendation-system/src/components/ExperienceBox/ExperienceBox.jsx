import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ExperienceCard from '../ExperienceCard/ExperienceCard';
import ExperienceAdd from '../ExperienceCard/ExperienceAdd';
import Lottie from "lottie-react";
import Turtle from '../../images/Turtle-in-space.json'
export default function ExperienceBox({childData }) {

    const [expdata, SetExpdata] = useState(childData);
    const [newExp, SetNewExp] = useState(false)
    const addExperience = async (e) => {
        //accepts new Experience data and adds it into existing array of Experiences
        try {
            const response = await userAPI.post('/seeker/former-job', e, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log(response)
            SetNewExp(false)
            SetExpdata([...childData, e])
        } catch (error) {
            console.log(error)
        }

    }
    const cancelExp = () => {
        //cancels addition of new Experience
        SetNewExp(false)
    };
    const deleteExp = (id) => {
        //deletes existing Experience from array by referring to the id passed in
        SetExpdata(expdata.filter(e => { return id !== e.id }))
    };

    const updateExp = (data) => {
        //updates existing Experience data from array. new data is passed in along with existing data id
        SetExpdata(expdata.map(e => {
            if (e.id === data.id) {
                e.job_name = data.job_name
                e.company_name = data.company_name
                e.start_year = data.start_year
                e.end_year = data.end_year
            }
            return (e)
        }))
    }
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Professional Experience</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={() => { SetNewExp(true) }}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {
                    (expdata.length === 0 && !newExp) &&
                    <div className='qualification-card-h3 data-exception-featurebox' style={{ fontFamily: 'Inter-light-italic' }}>
                        <Lottie className="data-exception-ani" animationData={Turtle} loop={true} />
                        <p>Your profile is like the vast expanse of space let's add some stars! 🌟</p></div>
                }

                {newExp && <ExperienceAdd  submitFn={addExperience} cancelFn={cancelExp} />}

                {
                    childData && expdata.map(e => {

                        return (
                            <ExperienceCard data={e} key={uuid()} deleteFn={deleteExp} submitFn={updateExp} cancelFn={cancelExp} />
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}
