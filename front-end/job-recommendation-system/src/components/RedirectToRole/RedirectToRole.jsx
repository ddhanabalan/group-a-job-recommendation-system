import { Link } from 'react-router-dom';
import './RedirectToRole.css';
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
export default function RedirectToRole() {

    return (
        <div className="WelcomeContainer">
            <h1 className='redirect-to-role-h1'>Let's Get Started</h1>
            <h4>Select the account type that best suits your needs</h4>
            <div className="d-grid gap-1 col-7 mx-auto div-btn">
                <Link to="/login"><button className="btn btn-primary btn-lg" type="button"><FaceRoundedIcon/> Personal</button></Link>
            </div>
            <div className="d-grid gap-1 col-7 mx-auto div-btn">
                <Link to="/login/organization"><button className="btn btn-primary btn-lg btn-green" type="button"><LanguageRoundedIcon /> Organization</button></Link>
            </div>
        </div>
    )
}