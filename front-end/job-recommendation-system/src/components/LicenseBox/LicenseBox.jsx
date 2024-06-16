import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LicenseAdd from '../LicenseCard/LicenseAdd';
import LicenseCard from '../LicenseCard/LicenseCard';
import NothingToShow from '../NothingToShow/NothingToShow';
export default function LicenseBox({ childData, reloadFn,showSuccessMsg,showFailMsg }) {
    useEffect(() => {
        if (childData) {
            SetLicensedata(childData)
        }
    }, [childData])
    const [licensedata, SetLicensedata] = useState([]);
    const [newLic, SetNewLic] = useState(false)
    const addLicense = async (e) => {
        //accepts new License data and adds it into existing array of Licenses
        console.log(e)
        try {
            const response = await userAPI.post('/seeker/certificate/', e, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
              response.request.status===201&&showSuccessMsg()
            console.log(response)
            SetNewLic(false)
            reloadFn()
            SetLicensedata([...childData, e])
        } catch (error) {
            console.log(error)
            showFailMsg()
        }

    }
    const cancelLic = () => {
        //cancels addition of new License
        SetNewLic(false)
    };
    const deleteLic = async(id) => {
        //deletes existing License from array by referring to the id passed in
        try {
             const response = await userAPI.delete(`/seeker/certificate/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
              response.request.status===200&&showSuccessMsg()
            SetLicensedata(licensedata.filter(e => { return id !== e.id }))
        } catch (e) {
            console.log(e)
             showFailMsg()
        }

    };

    const updateLic = async (data) => {
        //updates existing License data from array. new data is passed in along with existing data id
        const { id, ...passData } = data
        console.log("passData", passData)
        try {
            const response = await userAPI.put(`/seeker/certificate/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
              response.request.status===200&&showSuccessMsg()
            SetLicensedata(licensedata.map(e => {
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
            <h4 className="feature-title">Licenses and certifications</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={() => { SetNewLic(true) }}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {
                    (licensedata.length === 0 && !newLic) &&
                    <NothingToShow />
                }

                {newLic && <LicenseAdd submitFn={addLicense} cancelFn={cancelLic} />}

                {
                    childData && licensedata.map(e => {

                        return (
                            <LicenseCard data={e} key={uuid()} deleteFn={deleteLic} submitFn={updateLic} cancelFn={cancelLic} />
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}
