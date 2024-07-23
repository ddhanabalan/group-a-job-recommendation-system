import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import NothingToShow from '../NothingToShow/NothingToShow';
export default function LanguageBox({ access, languages, childData, reloadFn, showSuccessMsg, showFailMsg }) {
    useEffect(() => {
        if (childData) {
            SetLdata(childData)
        }
    }, [childData])
    const [ldata, SetLdata] = useState([]);
    const [newLang, SetNewLang] = useState(false)
    const addLang = async (data) => {
        try {
            console.log(data)
            const response = await userAPI.post('/seeker/language/', data, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 201 && showSuccessMsg()
            SetNewLang(false)
            reloadFn()
        }
        catch (e) {
            console.log(e)
            showFailMsg()
        }
    }
    const updateLang = async (data) => {
        //updates existing qualification data from array. new data is passed in along with existing data id
        try {
            const { id, ...passData } = data
            const response = await userAPI.put(`/seeker/language/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            reloadFn()
        }
        catch (e) {
            console.log(e)
            showFailMsg()
        }
    }
    const deleteLang = async (id) => {
        //deletes existing qualification from array by referring to the id passed in
        try {
            const response = await userAPI.delete(`/seeker/language/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            reloadFn()
        }
        catch (e) {
            console.log(e)
            showFailMsg()
        }
        // SetLdata(ldata.filter(e => { return id !== e.id }))
    };
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Languages</h4>
            {access !== "viewOnly" &&
                <Stack direction="row" spacing={0} className='feature-actions'>
                    <IconButton aria-label="add" onClick={() => { SetNewLang(true) }}>
                        <AddCircleRoundedIcon />
                    </IconButton>
                </Stack>
            }
            <div className="feature-box-container">
                {
                    (ldata.length === 0 && !newLang) &&
                    <NothingToShow />
                }

                {
                    newLang && <LanguageAdd languages={languages} submitFn={addLang} cancelFn={() => SetNewLang(false)} />
                }

                {
                    childData && ldata.map(e => {
                        return (
                            <LanguageCard access={access} languages={languages} data={e} key={uuid()} deleteFn={deleteLang} submitFn={updateLang} />
                        )
                    })
                }

            </div>
        </div>
    )
}
