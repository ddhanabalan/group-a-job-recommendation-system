import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import './LogoRedirect.css';
import logo from '../../images/careergo_logo.svg'
export default function LogoRedirect() {
    const [toHome, SetToHome] = useState(false)
    return (
        <div className='c-logo-container' onClick={() => SetToHome(true)}>
            {toHome && <Navigate to='/' />}
            <div className='c-logo-image'>
                <img src={logo} alt="logo" />
            </div>
            <h3>CareerGO</h3>
        </div>
    )
}