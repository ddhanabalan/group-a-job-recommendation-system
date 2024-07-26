import TextField from '@mui/material/TextField';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import ConfBox from '../ConfirmMsgBox/ConfirmMsgBox';
import { Button } from '@mui/material';
import LogoRedirect from '../LogoRedirect/LogoRedirect';
import './DeleteAccount.css';
import successAnim from '../../images/green-confirm.json'
import failanim from '../../images/fail-animation.json'
export default function DeleteAccount() {
    const navigate = useNavigate();
    const [userPassword, SetUserPassword] = useState('')
    const [showBanner, SetShowBanner] = useState(false)
    const [validationError, SetValidationError] = useState(false);
    const [deletionError, SetDeletionError] = useState(false);

    const verifiedDeletion = async ()=>{
        try{
            const validate = await axios.post('/token', qs.stringify({ "username": getStorage("userEmail"), "password": userPassword }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        if(validate.data.access_token){
            
            SetValidationError(false)};
            deleteAccount();
        }
        catch(e){
            console.log(e)
            SetValidationError(true);
        }
    }
    const deleteAccount = async () => {
        console.log(userPassword)
        try {
            
            
             
               await axios.delete('/user', {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                })
                sessionStorage.clear(),
                SetShowBanner(true)
                
           
            SetDeletionError(false)
            setTimeout(() => {
                navigate(`/`)
            }, 2000)
            
            
        } catch (e) {
            console.log(e);
            SetShowBanner(true);
            SetDeletionError(true);
            setTimeout(() => {
                SetShowBanner(false);
                SetDeletionError(false);
            }, 2000)
            
        }
    }
    
    return (
        <div id="page">
            <LogoRedirect />
            <div className='confirm-delete-message'>
                {showBanner?(deletionError? <ConfBox message={"We are facing some issues.Try again later"} animation={failanim} bgcolor="#FFE5B4" />:<ConfBox message={"Account has been deleted"} animation={successAnim} bgcolor="#99FF99" />):<></>}
            </div>

            <div className="delete-container">
                <h3 style={{ color: 'red' }}>Delete Account</h3>
                <p>Upon proceeding, your CareerGo account will be permanently deleted and cannot be recovered</p>
                <TextField
                    error={validationError ? true : false}
                    className='delete-textbox'
                    type='password'
                    fullWidth
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
                    onClick={verifiedDeletion}
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}