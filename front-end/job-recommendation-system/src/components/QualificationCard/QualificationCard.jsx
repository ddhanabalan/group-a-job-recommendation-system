import './QualificationCard.css';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
export default function QualificationCard({data}) {
    return (
        <div className="qualification-card">
            <div className="qualification-card-image"></div>
            <div className="qualification-card-content">
                <h2 className='qualification-card-h2'>{ data.qualification}</h2>
                <h3 className='qualification-card-h3'>{data.qualificationProvider}</h3>
                <p className='qualification-card-p'>{data.qualifiedYear}</p>
            </div>
            <div className="qualification-card-action-btns">
                <Stack direction="column" spacing={0}>
                    <IconButton aria-label="edit">
                        <ExpandMoreRoundedIcon />
                    </IconButton>
                </Stack>
            </div>
        </div>
    )
}