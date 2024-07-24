import TextField from '@mui/material/TextField';
import qs from 'qs';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import ConfBox from '../ConfirmMsgBox/ConfirmMsgBox';
import { Button } from '@mui/material';
import LogoRedirect from '../LogoRedirect/LogoRedirect';
import './ForgetPassword.css';
import failAnim from '../../images/fail-animation.json'
import successAnim from '../../images/green-confirm.json'
export default function ForgetPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [validationError, SetValidationError] = useState(false)
    const forgetPassword = async (data) => {
        console.log(data)
        try {
            const response = await axios.post('/forgot_password', data)
            response.status===200&&setSuccess(true)&&
            setTimeout(() => {
                navigate(`/`)
            }, 2000)
            SetValidationError(false)
        } catch (e) {
            console.log(e);
            SetValidationError(true)
        }
    }
    return (
        <div id="page">
            <LogoRedirect />
            <div className='confirm-delete-message'>
                {success && <ConfBox message={"request has been sent to your registered email"} animation={successAnim} bgcolor="#99FF99" />}
                {validationError && <ConfBox message={"account with this email does not exist"} animation={failAnim} bgcolor="#FFE5B4" />}
            </div>

            <form className="delete-container" onSubmit={handleSubmit((data) => forgetPassword(data))}>
                <h3 style={{ color: 'blue' }}>Forget Password</h3>
                <p>Forgot your password? No worries! Please enter your email address associated with your CareerGo account,
                    and we'll send you instructions on how to reset your password.
                    If you don't receive an email within a few minutes, be sure to check your spam folder.</p>
                <TextField
                    error={'email' in errors}
                    className='delete-textbox'
                    type='email'
                    fullWidth
                    label="Confirm your email"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '3rem' }}
                    variant="outlined"
                    placeholder='example@gmail.com'
                    size='small'
                    helperText={'email' in errors ? errors.email?.message : ""}
                    {...register("email",
                        {
                            required: "email cannot be empty",
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "invalid email"
                            }
                        })}
                />
                <Button variant="contained"
                    disableElevation
                    className='forget-btn'
                    type='submit'
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}