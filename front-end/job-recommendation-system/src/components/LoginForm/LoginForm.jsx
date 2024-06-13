import { useState } from 'react'
import './LoginForm.css'
import { useForm } from 'react-hook-form'
import Mail from '@mui/icons-material/Mail'
import Lock from '@mui/icons-material/Lock'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, TextField, Stack } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';

function LoginForm({ callAPI }) {

  const { register, formState: { errors }, handleSubmit } = useForm();
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const userType = location["pathname"].includes("organization") ? "employer" : "seeker";
  function handleVisibility() {
    setVisible(!visible);
  }


  return (
    <>
      {/*Login Form*/}
      <div className="login_container">

        
          <h3 className="login-header">Login</h3>

          <div className="login-details">
          {/*<Box sx={{ boxShadow: 2, paddingBottom: 4, paddingTop: 3, paddingX: 3, borderRadius: 5, width: '90%', display: 'flex', flexDirection: 'column' }}>*/}
          <form noValidate autoComplete='on' onSubmit={handleSubmit((data) => callAPI(data))}>
            <p className="lg">Login with Credentials</p><br />
            <Stack spacing={2}>

              {/*username box validation checking*/}
              <Box sx={{ display: 'flex', alignItems: 'username' in errors ? 'center' : 'flex-end', gap: 1 }}>
                <Mail />
                <TextField variant="standard"
                  label="Email"
                  type='email'
                  helperText={'username' in errors ? errors.username?.message : ""}
                  error={'username' in errors}
                  {...register("username",
                    {
                      required: "email cannot be empty",
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "invalid email"
                      }
                    })} />
              </Box>

              {/*password box validation checking*/}
              <Box sx={{ display: 'flex', alignItems: 'password' in errors ? 'center' : 'flex-end', gap: 1 }}>
                <Lock sx={{ position: 'relative', top: 0 }} />
                <TextField variant="standard"
                  label="Password"
                  type={visible ? "text" : "password"}
                  helperText={'password' in errors ? errors.password?.message : ""}
                  error={'password' in errors}
                  {...register("password",
                    {
                      required: "password is required",
                    })}
                />
                <Box onClick={handleVisibility}>{visible ? <VisibilityIcon sx={{ fontSize: 'medium', position: 'relative', top: -2 }} /> : <VisibilityOffIcon sx={{ fontSize: 'medium', position: 'relative', top: -2 }} />}</Box>
              </Box>

            </Stack>
            <IconButton type="submit" sx={{ borderRadius: 50, backgroundColor: '#E7E4E4', position: 'relative', top: 20, alignSelf: 'center', width: 45, height: 45 }}>
              <ArrowForwardRoundedIcon sx={{ color: 'black' }} />
            </IconButton>
          </form>
          </div>

        


        <a href="" className="lk">forgot your password?</a>
        <a className="sigup-redirect" href={userType==="employer"?"/signup/organization":"/signup"}>New User? SignUp</a>
        {/* <Link to={'../signup/' + userType} state={{ "userType": userType }}></Link> */}



      </div>
    </>
  )
}

export default LoginForm;