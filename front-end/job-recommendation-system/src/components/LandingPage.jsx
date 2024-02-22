import Button from 'react-bootstrap/Button';
import './LandingPage.css'
export default function LandingPage() {

    return (
        <div className="WelcomeContainer">
            <h1>Welcome to <span>CareerGo</span></h1>
            <div className="d-grid gap-1 col-6 mx-auto div-btn">
                <p>Looking for a job?</p>
                <button class="btn btn-primary btn-lg" type="button">Job Seeker</button>
            </div>
            <div className="d-grid gap-1 col-6 mx-auto div-btn">
                <p>Looking for potential candidates for your company?</p>
                <button className="btn btn-primary btn-lg btn-green" type="button">Job Recruiter</button>
            </div>
        </div>
    )
}