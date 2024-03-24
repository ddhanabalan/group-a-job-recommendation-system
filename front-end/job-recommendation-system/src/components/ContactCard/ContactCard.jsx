import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PublicIcon from '@mui/icons-material/Public';
import '../FeatureBox/FeatureBox.css';
import './ContactCard.css';
export default function ContactCard({ data, contactInfo }) {
    return (
      
        <div className="feature-box">
            {console.log(data.editIcon)}
            <h4 className="feature-title">{data.title}</h4>
            <Stack direction="row" spacing={0} className='feature-actions'>
                {[data.editIcon] &&
                    <IconButton aria-label="edit">
                        <EditIcon />
                    </IconButton>}
                {data.addIcon &&
                    <IconButton aria-label="add">
                        <AddCircleRoundedIcon />
                    </IconButton>}
            </Stack>
            <Stack direction="column" spacing={1} className='contact-cards'>
                {contactInfo.mail && <Stack direction="row" spacing={1} className='contact-medium'>
                    <IconButton aria-label="email" disabled>
                        <EmailIcon />
                    </IconButton>
                    <p className="contact-p">{contactInfo.mail}</p>
                </Stack>}
                {contactInfo.github && <Stack direction="row" spacing={1} className='contact-medium'>
                    <IconButton aria-label="email" disabled>
                        <GitHubIcon />
                    </IconButton>
                    <p className="contact-p">{contactInfo.github}</p>
                </Stack>}
                {contactInfo.website && <Stack direction="row" spacing={1} className='contact-medium'>
                    <IconButton aria-label="email" disabled>
                        <PublicIcon />
                    </IconButton>
                    <p className="contact-p">{contactInfo.website}</p>
                </Stack>}
            </Stack>
        </div>
    )
}