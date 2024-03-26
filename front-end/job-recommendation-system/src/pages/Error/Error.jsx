import Lottie from "lottie-react";
import './Error.css';
import Error404 from '../../images/error-animation.json';
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
export default function Error() {
    return (
        <div className="error-page" >
            <Lottie className="error-container" animationData={Error404} loop={true} />
            <p className="error-p">It looks like you are lost.</p>
            <Link to="/"> <Button variant="outlined" endIcon={<KeyboardReturnIcon fontSize="large" />}>
                Back to Home
            </Button></Link>
        </div>
    )
} 