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
export default function FeatureBoxMiddlePane({ access,childData,showSuccessMsg,showFailMsg,reloadFn }) {
    useEffect(() => {
        if (childData) {
            SetQdata(childData)
        }
    }, [childData])
    const [qdata, SetQdata] = useState([]);
    const [newQual, SetNewQual] = useState(false)
    const addQualification = async (e) => {
        //accepts new qualification data and adds it into existing array of qualifications
        console.log(e)
        try {
            const data = { 'education_title': e.education_title, 'education_provider': e.education_provider, 'start_year': e.start_year, 'end_year': e.end_year }
            console.log(data)
            const response = await userAPI.post('/seeker/education', data, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 201 && showSuccessMsg()
            reloadFn()
            console.log(response)
            SetNewQual(false)
            SetQdata([...qdata, e])
        } catch (error) {
            console.log(error)
              showFailMsg()
        }

    }
    const cancelQual = () => {
        //cancels addition of new qualification
        SetNewQual(false)
    };

    const deleteQual = async (id) => {
        //deletes existing Qualification from array by referring to the id passed in
        try {
           const response = await userAPI.delete(`/seeker/education/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
              response.request.status===200&&showSuccessMsg()
            response.request.status === 200 &&SetQdata(qdata.filter(e => { return id !== e.id }))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };

    const updateQual = async (data) => {
        //updates existing Education data from array. new data is passed in along with existing data id
        const { id, ...passData } = data
        console.log("passData", passData)
        try {
           const response = await userAPI.put(`/seeker/education/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status===200&&showSuccessMsg()
            SetQdata(qdata.map(e => {
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
            <h4 className="feature-title">Formal Education</h4>
            {access !== "viewOnly" &&
                <Stack direction="row" spacing={0} className='feature-actions'>
                    <IconButton aria-label="add" onClick={() => { SetNewQual(true) }}>
                        <AddCircleRoundedIcon />
                    </IconButton>
                </Stack>}
            
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
                            <QualificationCard access={access} data={e} key={uuid()} deleteFn={deleteQual} submitFn={updateQual} cancelFn={cancelQual} />)
                    })
                }

            </div>
        </div>
    )
}
