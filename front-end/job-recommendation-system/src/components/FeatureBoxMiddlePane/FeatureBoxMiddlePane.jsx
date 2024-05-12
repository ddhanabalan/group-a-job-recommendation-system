import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import QualificationAdd from '../QualificationAdd/QualificationAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePane({ languages,data, childData }) {
 

    const [qdata, SetQdata] = useState(childData);
    const [newQual, SetNewQual] = useState(false)
    const addQualification = (e) => {
        //accepts new qualification data and adds it into existing array of qualifications
        SetNewQual(false)
        SetQdata([...childData, e])
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
                e.language = data.language
                e.language_proficiency = data.language_proficiency
            }
            return (e)
        }))
    }
    const updateLang = (data) => {
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
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={() => { SetNewQual(true) }}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {(qdata.length === 0 && !newQual) && <div className='qualification-card-h3 data-exception-featurebox' style={{ fontFamily: 'Inter-light-italic' }}>It seems you haven't entered any information yet, so there's nothing to display at the moment.</div>}
                {newQual && (data.isLanguage ? <LanguageAdd languages={languages} submitFn={addQualification} cancelFn={cancelQual} /> : <QualificationAdd submitFn={addQualification} cancelFn={cancelQual} />)}
                {
                    childData && qdata.map(e => {

                        return (
                            data.isLanguage === true ?
                                <LanguageCard languages={languages} data={e} key={uuid()} deleteFn={deleteQual} submitFn={updateQual} />
                                : <QualificationCard data={e} key={uuid()} deleteFn={deleteQual} submitFn={updateQual} cancelFn={cancelQual} />)

                    })
                }

            </div>
        </div>
    )
}
