import { useState,useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import QualificationAdd from '../QualificationAdd/QualificationAdd';
import NothingToShow from '../NothingToShow/NothingToShow';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePane({ childData }) {
    useEffect(() => {
        if (childData) {
            SetQdata(childData)
        }
    }, [childData])
    const [qdata, SetQdata] = useState([]);
    const [newQual, SetNewQual] = useState(false)
    const addQualification = async (e) => {
        //accepts new qualification data and adds it into existing array of qualifications
        try {
            const data = { 'education_title': e.qualification, 'education_provider': e.qualification_provider, 'start_year': e.start_year, 'end_year': e.end_year }
            console.log(data)
            const response = await userAPI.post('/seeker/education', data, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log(response)
            SetNewQual(false)
            SetQdata([...childData, e])
        } catch (error) {
            console.log(error)
        }

    }
    const cancelQual = () => {
        //cancels addition of new qualification
        SetNewQual(false)
    };
    const deleteQual = (id) => {
        //deletes existing qualification from array by referring to the id passed in
        SetQdata(qdata.filter(e => { return id !== e.id }))
    };
    const updateQual = (data) => {
        //updates existing qualification data from array. new data is passed in along with existing data id
        SetQdata(qdata.map(e => {
            if (e.id === data.id) {
                e.qualification = data.qualification
                e.qualification_provider = data.qualification_provider
                e.start_year = data.start_year
                e.end_year = data.end_year
            }
            return (e)
        }))
    }
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Formal Education</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={() => { SetNewQual(true) }}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {
                    (qdata.length === 0 && !newQual) &&
                    <NothingToShow />
                }

                {
                    newQual && <QualificationAdd  submitFn={addQualification} cancelFn={cancelQual} />
                }

                {
                    childData && qdata.map(e => {

                        return (
                            <QualificationCard  data={e} key={uuid()} deleteFn={deleteQual} submitFn={updateQual} cancelFn={cancelQual} />)
                    })
                }

            </div>
        </div>
    )
}
