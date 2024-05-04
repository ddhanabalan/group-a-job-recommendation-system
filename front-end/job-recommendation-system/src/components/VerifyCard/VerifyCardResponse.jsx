import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from '../../pages/LoginPage/LoginPage'
export default function VerifyCardResponse({ status }) {
    console.log(status)
    const [message, setMessage] = useState();
    const [info, setInfo] = useState();
    useEffect(() => {
        if (status === 200) {
            setMessage(< h2 style={{ color: '#38b000' }}>Account successfully verified</h2 >)
            setInfo(<p>Welcome aboard! Your verification is complete. You will be automatically redirected to login after 5 seconds or click  <a href='/'>here</a></p>)
        } else if (status === 400) {
            setMessage(< h2 style={{ color: '#e85d04' }}>Account already verified</h2 >)
            setInfo(<p>You will be automatically redirected to login after 5 seconds or click  <a href='/'>here</a></p>)
        } else if (status === 401) {
            setMessage(<h2 style={{ color: '#e70e02' }}>Link has been expired</h2>)
            setInfo(<p>Request a new verification link by clicking <a href='#'>here</a></p>)
        }
    }, [])
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/login/seeker')
        }, 5000)
    }, [])
    return (
        <div className="verification-body">
            {message}
            {info}

        </div>
    )
}