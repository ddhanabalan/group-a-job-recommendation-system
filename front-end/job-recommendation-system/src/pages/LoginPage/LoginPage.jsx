import { useState } from 'react';
import './LoginPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import failanim from '../../images/fail-animation.json'
import axios from '../../api/axios';
import {setStorage} from '../../storage/storage';
import qs from 'qs';
import ConfBox from '../../components/ConfirmMsgBox/ConfirmMsgBox';
import '../pages.css';
export default function LoginPage({ updateState }) {
    const [loading, SetLoading] = useState(false)
    const [serverMsg, SetServerMsg] = useState(null);
    const redirectFn = (response) => {
        console.log(response.data)
        setStorage("userToken",response.data);
        response.status === 200 && updateState(true)
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
            alert(e.message)
            SetServerMsg(e.response.data.detail);
        }
    }

    return (
        <div id="page">
            {serverMsg?
                <div className='message-box-login'>
                    <ConfBox message={serverMsg} animation={failanim} bgcolor="#FFE5B4"/>
                </div>
                :
                <></>
            }
            {loading&&<LoaderAnimation/>}
            <LoginForm callAPI={callAPI} />
        </div>
    )
}