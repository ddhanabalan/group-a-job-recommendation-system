import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import Lottie from "lottie-react";
import Turtle from '../../images/Turtle-in-space.json'
export default function LanguageBox({ languages, childData }) {

    const [ldata, SetLdata] = useState(childData);
    const [newLang, SetNewLang] = useState(false)
    const updateLang = (data) => {
        //updates existing qualification data from array. new data is passed in along with existing data id
        SetLdata(ldata.map(e => {
            if (e.id === data.id) {
                e.language = data.language
                e.language_proficiency = data.language_proficiency
            }
            return (e)
        }))
    }
    const deleteLang = (id) => {
        //deletes existing qualification from array by referring to the id passed in
        SetLdata(ldata.filter(e => { return id !== e.id }))
    };
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Languages</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={() => { SetNewLang(true) }}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {
                    (ldata.length === 0 && !newLang) &&
                    <div className='qualification-card-h3 data-exception-featurebox' style={{ fontFamily: 'Inter-light-italic' }}>
                        <Lottie className="data-exception-ani" animationData={Turtle} loop={true} />
                        <p>Your profile is like the vast expanse of space let's add some stars! 🌟</p></div>
                }

                {
                    newLang && <LanguageAdd languages={languages} submitFn={addQualification} cancelFn={cancelQual} />
                }

                {
                    childData && ldata.map(e => {
                        return (
                            <LanguageCard languages={languages} data={e} key={uuid()} deleteFn={deleteLang} submitFn={updateLang} />
                        )
                    })
                }

            </div>
        </div>
    )
}
