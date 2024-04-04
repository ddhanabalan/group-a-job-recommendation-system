import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import QualificationAdd from '../QualificationAdd/QualificationAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import CreateFormTextFields from '../CreateJobVacancyForm/CreateFormTextFields';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePaneText({data, childData}) {
    const [edit, setEdit] = useState(data.edit);
    
    
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                <IconButton aria-label="add" onClick={()=>{setEdit(!edit)}}>
                    {edit?
                    <CheckCircleRoundedIcon/>  
                    :
                    <EditIcon/>
                    }
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {edit?
                    <div className="feature-text"><CreateFormTextFields inputPlaceholder="Title" fontsz="14px" wparam="100%" fullWidth defaultValue={"" || ""} multipleLine={true} minrows={8} /></div>
                    :
                    <div className="feature-text">
                        <p>{childData.text}</p>
                    </div>
                }
            </div>
        </div>
    )
}
