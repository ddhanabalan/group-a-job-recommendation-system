import './CandidateCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { v4 as uuid } from 'uuid';
export default function CandidateCard({ data }) {
    return (
        <div className="card job-card">
            <div className='job-card-div1'>
                <h1 className='card-h1'>{data.candidateName}</h1>
                <Stack direction="row" spacing={1}>
                    <Chip className="chip-with-icon" icon={<LocationOnIcon />} label={data.location} />
                    <Chip className="chip-with-icon" icon={<WorkIcon />} label={data.experience + " years"} />
                </Stack>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {data.tags.map(e => {
                        return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    })}

                </Stack>
                <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Education</p>
                    <p>B.Tech CSE , IIT Madras</p>
                </div>
                <div className='job-card-info-div'>
                    <p className='job-card-info-div-parameter'>Preferred Work location</p>
                    <p>Chennai</p>
                </div>
            </div>
            <div className='job-card-div2'>
                <div className='card-img-container job-card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
            </div>
        </div>
    )
}