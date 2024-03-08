import './JobCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
export default function JobCard({ data }) {
    return (
        <div className="card">
            <div className='card-div1'>
                <h1 className='card-h1'>{data.jobTitle}</h1>
                <p className='card-company-name-p'>{data.companyName}</p>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.tags.map(e => {
                        return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    })}

                </Stack>
                <p className='card-salary'>{data.currency} {data.salary} per month</p>
            </div>
            <div className='card-div2'>
                <div className='card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
                <p className='card-time-p'>{data.postDate}</p>
            </div>
        </div>
    )
}