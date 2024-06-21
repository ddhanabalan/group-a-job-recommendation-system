import { useState } from 'react';
import { useForm } from 'react-hook-form';
import getStorage from '../../storage/storage';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import LanguageAdd from '../LanguageAdd/LanguageAdd';
import QualificationAdd from '../QualificationAdd/QualificationAdd';
import LanguageCard from '../LanguageCard/LanguageCard';
import CreateFormTextFields from '../CreateJobVacancyForm/CreateFormTextFields';
import './FeatureBoxMiddlePane.css';
export default function FeatureBoxMiddlePaneText({ access, data, childData, reloadFn, showSuccessMsg, showFailMsg }) {
    const { register, formState: { errors }, getValues, trigger, setError } = useForm({});
    const [edit, setEdit] = useState(data.edit);
    const updateDetails = async (data) => {
        try {
            const response = await userAPI.put('/recruiter/details', data,
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );
            response.request.status === 200 && showSuccessMsg()
            reloadFn()
        }
        catch (e) {
            console.log(e)
            showFailMsg()
        }
    }

    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                {access !== "viewOnly" && (edit ?
                    <IconButton aria-label="add" onClick={() => {
                        setEdit(!edit)
                        const data = getValues();
                        console.log(data)
                        updateDetails(data)
                    }}>
                        <CheckCircleRoundedIcon />
                    </IconButton>
                    :
                    <IconButton aria-label="add" onClick={() => { setEdit(!edit) }}>
                        <EditIcon />
                    </IconButton>
                )}
            </Stack>
            <div className="feature-box-container">
                {edit ?
                    <TextField className="personal-details-input profile-edit-bio overview-edit-input" variant="outlined" fullWidth
                        multiline
                        defaultValue={data.overview}
                        error={'overview' in errors}
                        {...register("overview",
                            {
                                required: ""
                            })}>
                    </TextField>
                    :
                    <div className="feature-text">
                        <pre className='overview-formatted'>{childData}</pre>
                    </div>
                }
            </div>
        </div>
    )
}
