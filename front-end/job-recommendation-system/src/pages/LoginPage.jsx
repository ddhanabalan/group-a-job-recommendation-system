
import LoginForm from '../components/LoginForm/LoginForm';
import axios from '../api/axios';
import qs from 'qs';
import './pages.css';
export default function LoginPage({ updateState }) {

    const redirectFn = (response) => {
        console.log(response.data)
        response.status === 200 && updateState(true)

    }
    const callAPI = async (data) => {
        try {
            const response = await axios.post('/token', qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            redirectFn(response)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div id="page">
            <LoginForm callAPI={callAPI} />
        </div>
    )
}