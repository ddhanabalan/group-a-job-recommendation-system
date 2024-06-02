import './JobCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
export default function JobCard({ data, id, expandView, background }) {

    return (
        <div className="card" onClick={() => expandView(data.id)} style={background}>
            <div className='card-div1'>
                <h1 className='card-h1'>{data.jobTitle}</h1>
                <p className='card-company-name-p'>{data.companyName}</p>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.tags.map(e => {
                        return (<Chip key={e.id} className="card-tags-child" label={e.tags} size='small' />)
                    })}

                </Stack>
                <p className='card-salary'>{data.currency}{data.salary[0]} - {data.salary[1]} per month</p>
            </div>
            <div className='card-div2'>
                <div className='card-img-container qualification-card-image'>
                    <IconButton disabled>
                        <CorporateFareRoundedIcon fontSize='large' />
                    </IconButton>
                </div>
                <p className='card-time-p'>{data.postDate}</p>
            </div>
        </div>
    )
}