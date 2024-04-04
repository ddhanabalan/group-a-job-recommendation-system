import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Chip } from '@mui/material';
import './DetailsCard.css';
import { v4 as uuid} from 'uuid';
export default function DetailsCard({ data, companyInfo }) {
    return (
        <div className="details-box">
            {console.log(data.editIcon)}
            <h4 className="details-title">{data.title}</h4>
           
            <Stack direction="row" spacing={0} className='details-actions'>
                {[companyInfo.dataIcon] &&
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>}
            </Stack>
            <Stack direction="column" spacing={2.5} className='details-body'>
                <div>
                    <p className='stat-title'>Industry</p>
                    <p className='stat-body'>{companyInfo.industry}</p>
                </div>
                <div>
                    <p className='stat-title'>Company size</p>
                    <p className='stat-body'>{companyInfo.companysize}</p>
                </div>
                <div>
                    <p className='stat-title'>Headquarters</p>
                    <p className='stat-body'>{companyInfo.hq}</p>
                </div>
                <div>
                    <p className='stat-title'>Specialities</p>
                    <div className='stat-body company-tags'>
                            {companyInfo.specialities.map(e => {
                                return (<Chip key={uuid()} className="company-tags-child" label={e} size='small' />)
                            })}
                    </div>
                </div>
                <div>
                    <p className='stat-title'>Locations</p>
                    <p className='stat-body'>{companyInfo.locations}</p>
                </div>
            </Stack>
        </div>
    )
}