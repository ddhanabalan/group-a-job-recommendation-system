import { Link } from 'react-router-dom';
import './RedirectToRole.css';
export default function RedirectToRole() {

    return (
        <div className="WelcomeContainer">
            <h1 className='redirect-to-role-h1'>Welcome to <span>CareerGo</span></h1>
            <div className="d-grid gap-1 col-6 mx-auto div-btn">
                <p>Looking for a job?</p>
                <Link to="/login/seeker"><button className="btn btn-primary btn-lg" type="button">Job Seeker</button></Link>
            </div>
            <div className="d-grid gap-1 col-6 mx-auto div-btn">
                <p>Looking for potential candidates for your company?</p>
                <Link to="/login/employer"><button className="btn btn-primary btn-lg btn-green" type="button">Job Recruiter</button></Link>
            </div>
        </div>
    )
}