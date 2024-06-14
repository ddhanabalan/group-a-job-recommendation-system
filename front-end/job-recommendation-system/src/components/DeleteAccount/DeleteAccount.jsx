import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import LogoRedirect from '../LogoRedirect/LogoRedirect';
import './DeleteAccount.css';
export default function DeleteAccount() {
    return (
        <div id="page">
            <LogoRedirect/>
            <div className="delete-container">
                <h3 style={{ color: 'red' }}>Delete Account</h3>
                <p>Upon proceeding, your CareerGo account will be permanently deleted and cannot be recovered</p>
                <TextField
                    className='delete-textbox'
                    label="To verify it's really you"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '3rem' }}
                    variant="outlined"
                    placeholder='Confirm password'
                    size='small'
                // helperText='Incorrect password'
                />
                <Button variant="contained"
                    disableElevation
                    className='delete-btn'
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}