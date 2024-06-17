import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import failanim from '../../images/fail-animation.json'
import axios from '../../api/axios';
import { getStorage,setStorage } from '../../storage/storage';
import qs from 'qs';
import ConfBox from '../../components/ConfirmMsgBox/ConfirmMsgBox';
import '../pages.css';
export default function LoginPage({fixUser}) {
    const [redirect, SetRedirect] = useState(false)
    // const [redirectEmployer, SetRedirectEmployer] = useState(false)
    const [loading, SetLoading] = useState(false)
    const [serverMsg, SetServerMsg] = useState(null);
    const redirectFn = (response) => {
        console.log(response.data)
        setStorage("userToken", response.data.access_token);
        setStorage("refToken", response.data.refresh_token);
        response.status === 200 && userType()
    }
    const userType = async () => {
        try {
            const response = await axios.get('/me' , {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            fixUser(response.data.type)
            // response.data.type === "seeker" ? SetRedirectSeeker(true) : SetRedirectEmployer(true)
            SetRedirect(true)
        } catch (e) {
            console.log(e)
        }
    }
    const callAPI = async (data) => {
        SetLoading(true)
        try {
            const response = await axios.post('/token', qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            redirectFn(response)
        } catch (e) {
            console.log(e)
            SetLoading(false)
            // alert(e.message)
            const received_error = e.response?.data.detail || (e.message == "Network Error" ? "We are facing some issues, please try again later." : e.message);
            SetServerMsg(received_error);
        }
    }

    return (
        <div id="page">
            {redirect && < Navigate to="/profile" />}
            {serverMsg ?
                <div className='message-box-login'>
                    <ConfBox message={serverMsg} animation={failanim} bgcolor="#FFE5B4" />
                </div>
                :
                <></>
            }
            {loading && <LoaderAnimation />}
            <div className='login-form-wrapper'>
                <LoginForm callAPI={callAPI} />
            </div>
        </div>
    )
}