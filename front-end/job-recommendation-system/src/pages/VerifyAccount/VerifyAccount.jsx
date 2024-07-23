import { useState } from 'react';
import VerifyCardInitial from '../../components/VerifyCard/VerifyCardInitial';
import VerifyCardResponse from '../../components/VerifyCard/VerifyCardResponse';
import authAPI from '../../api/axios';
import Button from '@mui/material/Button';
import './VerifyAccount.css';
import { Link, useParams } from 'react-router-dom';
export default function VerifyAccount() {
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(false)
    const params = useParams();
    const toLink = params.accessToken;
    const redirectFn = (status) => {
        setMessage(status)
        setResponse(true)
    }
    const callAPI = async () => {
        setLoading(true)
        try {
            const response = await authAPI.get(`/email/verify/${toLink}`);
            console.log(response)
            redirectFn(response.status)
        } catch (e) {
            console.log(e)
            redirectFn(e.response.status)
            setLoading(false)
        }
    }
    return (
        <div id="page">
            <div className="verification-header">
                <Link to='/'><Button variant="text">CareerGO</Button></Link>
            </div>
            {response ?
                <VerifyCardResponse status={message} /> :
                <VerifyCardInitial callAPI={callAPI} loading={loading} />
            }
        </div>
    )
}