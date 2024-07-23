import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import './FeatureBox.css';
export default function FeatureBox({ data }) {
    return (
        <div className="feature-box">
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                {[data.editIcon] &&
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>}
                { data.addIcon &&
                    <IconButton aria-label="add">
                        <AddCircleRoundedIcon />
                    </IconButton>}
            </Stack>
        </div>
    )
}
