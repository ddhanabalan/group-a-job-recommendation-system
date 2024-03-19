import './JobOpeningCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuid } from 'uuid';
export default function JobOpeningCard({ data }) {
    return (
        <div className="opening-card">
            <div className='opening-card-div1'>
                <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                <p className='opening-card-company-name-p'>{data.companyName}</p>
                
                <p className='opening-card-salary'>{data.currency} {data.salary} per month</p>
                {data.usertype=="employer"?
                    <div className="opening-vacancy-buttons">
                        <Button variant="contained" className="opening-delete-button" sx={{color: 'black', backgroundColor: 'red',width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none"}} endIcon={<DeleteOutlineIcon />}>
                        <p>Delete</p>
                        </Button>
                        <Button variant="contained" className="opening-edit-button" sx={{color: 'black', backgroundColor: 'green',width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none"}} endIcon={<EditIcon />}>
                        <p>Edit</p>
                        </Button>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className='opening-card-div2'>
                <div className='opening-card-img-container'>
                    {/* <img src="" alt="" /> */}
                </div>
            </div>
        </div>
    )
}