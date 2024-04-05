import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import QualificationCard from '../QualificationCard/QualificationCard';
import { v4 as uuid } from 'uuid';
import './FeatureBoxMiddlePane.css';
import LanguageCard from '../LanguageCard/LanguageCard';
export default function FeatureBoxMiddlePane({ data, childData }) {
   
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                {data.editIcon &&
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>}
                <IconButton aria-label="add">
                    <AddCircleRoundedIcon />
                </IconButton>
            </Stack>
            <div className="feature-box-container">
                {
                    childData.map(e => {

                        return (
                            data.isLanguage === true ?
                                <LanguageCard data={e} key={uuid()} />
                                : <QualificationCard data={e} key={uuid()} />)

                    })
                }

            </div>
        </div>
    )
}
