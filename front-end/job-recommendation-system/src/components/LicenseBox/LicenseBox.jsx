import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LicenseAdd from '../LicenseCard/LicenseAdd';
import LicenseCard from '../LicenseCard/LicenseCard';
import Lottie from "lottie-react";
import Turtle from '../../images/Turtle-in-space.json'
export default function LicenseBox({ childData, reloadFn }) {
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
            console.log(response)
            SetNewLic(false)
            reloadFn()
            SetLicensedata([...childData, e])
        } catch (error) {
            console.log(error)
        }

    }
    const cancelLic = () => {
        //cancels addition of new License
        SetNewLic(false)
    };
    const deleteLic = async(id) => {
        //deletes existing License from array by referring to the id passed in
        try {
            await userAPI.delete(`/seeker/certificate/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            SetLicensedata(licensedata.filter(e => { return id !== e.id }))
        } catch (e) {
            console.log(e)
        }

    };

    const updateLic = async (data) => {
        //updates existing License data from array. new data is passed in along with existing data id
        const { id, ...passData } = data
        console.log("passData", passData)
        try {
            await userAPI.put(`/seeker/certificate/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            SetLicensedata(licensedata.map(e => {
                if (e.id === data.id) {
                    e = data
                }
                return (e)
            }))
        } catch (e) {
            console.log(e)
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
                    <div className='qualification-card-h3 data-exception-featurebox' style={{ fontFamily: 'Inter-light-italic' }}>
                        <Lottie className="data-exception-ani" animationData={Turtle} loop={true} />
                        <p>Your profile is like the vast expanse of space let's add some stars! 🌟</p></div>
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
