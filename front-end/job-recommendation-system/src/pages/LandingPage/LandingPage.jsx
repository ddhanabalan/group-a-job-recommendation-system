import '../pages.css';
import RedirectToRole from '../../components/RedirectToRole/RedirectToRole';
import logo from '../../images/careergo_logo.svg'
import './LandingPage.css'
export default function LandingPage() {
    return (
        <div id="page" className='landing-page'>
            <div className='landing-page-logo'>
                <div className='landing-page-logo-image'>
                    <img src={logo} alt="logo" />
                </div>
                <h3>CareerGO</h3>
            </div>
           
            <div className='intro-heading'>
                <p>Level up your career with CareerGO</p>
                <h1>Ready to take the leap?</h1>
            </div>
            <RedirectToRole/>
        </div>
    )
}