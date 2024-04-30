import { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import axios from '../../api/axios';
import qs from 'qs';
import '../pages.css';
export default function LoginPage({ updateState }) {
    const [loading, SetLoading] = useState(false)
    const redirectFn = (response) => {
        console.log(response.data)
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
        }
    }

    return (
        <div id="page">
            {loading&&<LoaderAnimation/>}
            <LoginForm callAPI={callAPI} />
        </div>
    )
}