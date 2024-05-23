import { useState } from 'react';
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
export default function LicenseBox({ childData }) {

    const [licensedata, SetLicensedata] = useState(childData);
    const [newLic, SetNewLic] = useState(false)
    const addLicense = async (e) => {
        //accepts new License data and adds it into existing array of Licenses
        try {
            const response = await userAPI.post('/seeker/former-job', e, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log(response)
            SetNewLic(false)
            SetLicensedata([...childData, e])
        } catch (error) {
            console.log(error)
        }

    }
    const cancelLic = () => {
        //cancels addition of new License
        SetNewLic(false)
    };
    const deleteLic = (id) => {
        //deletes existing License from array by referring to the id passed in
        SetLicensedata(licensedata.filter(e => { return id !== e.id }))
    };

    const updateLic = (data) => {
        //updates existing License data from array. new data is passed in along with existing data id
        SetLicensedata(licensedata.map(e => {
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
