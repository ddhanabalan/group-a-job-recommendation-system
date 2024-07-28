import Lock from '@mui/icons-material/Lock'
import { Box, Button, TextField, Stack } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircleIcon from '@mui/icons-material/Circle';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import ConfBox from '../ConfirmMsgBox/ConfirmMsgBox';
import LogoRedirect from '../LogoRedirect/LogoRedirect';
import './ForgetPassword.css';
import failAnim from '../../images/fail-animation.json'
import successAnim from '../../images/green-confirm.json'
export default function ForgetPasswordResponse() {

    const params = useParams();
    const token = params.token;
    const { register, formState: { errors }, handleSubmit, watch, getValues } = useForm();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [validationError, SetValidationError] = useState(false)
    const [visible, setVisible] = useState(false);
    function handleVisibility() {
        setVisible(!visible);
    }

    const forgetPassword = async (data) => {
        console.log(data)
        try {
            const response = await axios.post(`/forgot_password/verify/${token}`, { new_password: getValues("cpassword") })
            if (response.status === 200) {
                setSuccess(true)
                setTimeout(() => {
                    navigate(`/`)
                }, 2000)
            }
            SetValidationError(false)
        } catch (e) {
            console.log(e);
            SetValidationError(true)
        }
    }
    const color = watch("password") === watch("cpassword") ? "#07F407" : "#ff2d00"
    return (
        <div id="page">
            <LogoRedirect />
            <div className='confirm-delete-message'>
                {success && <ConfBox message={"password has been changed successfully"} animation={successAnim} bgcolor="#99FF99" />}
                {validationError && <ConfBox message={"an error occured, please try again"} animation={failAnim} bgcolor="#FFE5B4" />}
            </div>

            <form className="delete-container" onSubmit={handleSubmit((data) => forgetPassword(data))}>
                <h3 style={{ color: 'blue' }}>Reset Password</h3>
                <p>Please enter your new password below. Ensure that it is strong and unique, containing a mix of letters,
                    numbers, and special characters for better security.</p>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    {/*password box validation checking*/}
                    <Box sx={{ display: 'flex', alignItems: 'password' in errors ? 'baseline' : 'flex-end', gap: 1 }}>
                        <Lock sx={{ position: 'relative', top: 0 }} />
                        <TextField variant="standard"
                            label="Password"
                            type={visible ? "text" : "password"}
                            helperText={'password' in errors ? errors.password?.message : ""}
                            error={'password' in errors}
                            {...register("password",
                                {
                                    required: "password is required",
                                    pattern: {
                                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,16}$/,
                                        message: "Your password should have one lowercase, one uppercase, one number, one special symbol from [!@#$%^&*_=+-], and be 8 to 16 characters long"
                                    }
                                })}
                            sx={{ width: "60%" }} />
                        <Box onClick={handleVisibility}>{visible ? <VisibilityIcon sx={{ fontSize: 'medium', position: 'relative', top: -2, left: -3 }} /> : <VisibilityOffIcon sx={{ fontSize: 'medium', position: 'relative', top: -3 }} />}</Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'cpassword' in errors ? 'center' : 'flex-end', gap: 1 }}>
                        <Box sx={{}}>
                            <Lock sx={{ position: 'relative', top: 0 }} />
                            <CircleIcon sx={{ color: color, fontSize: "small", position: "relative", bottom: -8, left: -10 }} />
                        </Box>

                        <TextField variant="standard"
                            label="Confirm Password"
                            type='password'
                            helperText={'cpassword' in errors ? errors.cpassword?.message : ""}
                            error={'cpassword' in errors}

                            {...register("cpassword",
                                {
                                    required: "password is required",
                                    validate: (val) => val === watch("password") || "The passwords don't match",
                                })}
                            sx={{ width: '60%', position: 'relative', left: -12 }} />
                    </Box>
                </Stack>
                <Button variant="contained"
                    disableElevation
                    className='forget-btn'
                    type='submit'
                >
                    reset
                </Button>
            </form>
        </div>
    )
}