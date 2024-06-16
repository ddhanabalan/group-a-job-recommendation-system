import TextField from '@mui/material/TextField';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import ConfBox from '../ConfirmMsgBox/ConfirmMsgBox';
import { Button } from '@mui/material';
import LogoRedirect from '../LogoRedirect/LogoRedirect';
import './DeleteAccount.css';
import successAnim from '../../images/green-confirm.json'
export default function DeleteAccount() {
    const navigate = useNavigate();
    const [userPassword, SetUserPassword] = useState('')
    const [showBanner, SetShowBanner] = useState(false)
    const [validationError, SetValidationError] = useState(false)
    const deleteAccount = async () => {
        console.log(userPassword)
        try {
            const validate = await axios.post('/token', qs.stringify({ "username": "backupsreyas@gmail.com", "password": userPassword }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            validate.data.access_token &&
                await userAPI.delete('/seeker/details', {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }).then(
                    sessionStorage.clear(),
                     SetShowBanner(true)
                )
           
            SetValidationError(false)
            setTimeout(() => {
                navigate(`/login`)
            }, 5000)
        } catch (e) {
            console.log(e);
            SetValidationError(true)
        }
    }
    return (
        <div id="page">
            <LogoRedirect />
            <div className='confirm-delete-message'>
                {showBanner && <ConfBox message={"Account has been deleted"} animation={successAnim} bgcolor="#99FF99" />}
            </div>

            <div className="delete-container">
                <h3 style={{ color: 'red' }}>Delete Account</h3>
                <p>Upon proceeding, your CareerGo account will be permanently deleted and cannot be recovered</p>
                <TextField
                    error={validationError ? true : false}
                    className='delete-textbox'
                    type='password'
                    label="To verify it's really you"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '3rem' }}
                    variant="outlined"
                    placeholder='Confirm password'
                    size='small'
                    onChange={(e) => SetUserPassword(e.target.value)}
                    helperText={validationError ? 'Incorrect password' : ""}
                />
                <Button variant="contained"
                    disableElevation
                    className='delete-btn'
                    onClick={deleteAccount}
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}