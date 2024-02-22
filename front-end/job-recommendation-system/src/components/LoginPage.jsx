import React, { useState } from 'react'
import './LoginPage.css'
import { useForm } from 'react-hook-form'
import Mail from '@mui/icons-material/Mail'
import Lock from '@mui/icons-material/Lock'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, IconButton,  Button, TextField, Stack } from '@mui/material'

function Login(){

  const { register, formState: {errors}, handleSubmit} = useForm();
  const { info, setInfo} = useState();

  console.log("errors", {errors})
  return (
    <>
      <div className="login_container">
        <div className="form_container b-2">
          <form noValidate autoComplete='off' onSubmit={handleSubmit((data) => console.log(data))}>
            <h3 className="text-center login-header">Login</h3>
            <br/>
            <Box sx={{boxShadow: 2, paddingBottom: 4, paddingTop: 3, paddingX: 3, borderRadius: 5, width: 250}}>
              <p className="lg">Login with Credentials</p><br/>
              <Stack spacing={2}>
                
                
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <Mail sx={{position: 'relative', top: -3}} />
                  <TextField  variant="standard" 
                              label="Email" 
                              type='email'
                              helperText={'email' in errors? errors.email?.message: ""}
                              error = {'email' in errors}
                              {...register("email", 
                                           {required: "please enter email",
                                            pattern: {
                                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    message: "Email not valid"
                                            }})}/>
                              
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <Lock sx={{position: 'relative', top: -3}} />
                  <TextField variant="standard" 
                             label="Password" 
                             type='password'
                             helperText={'password' in errors? errors.password?.message: ""}
                             error = {'password' in errors}
                             {...register("password", 
                                           {required: "password is required",
                                            pattern: {
                                                    value:  /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$/,
                                                    message: "Wrong password"
                                            }})}/>
                </Box>
              </Stack>
              <IconButton type="submit" sx={{borderRadius: 50, backgroundColor: '#bdb6b6', position: 'relative', left: 80, top: 20}}>
                <ArrowForwardRoundedIcon sx={{color:'black'}}/>
              </IconButton>
            </Box>

          </form>
        </div>
        <p className="text-center">
          <br/><a href="" className="lk">Forgot Password?</a><br/>
          <a href="" className="lg foot">New User?Sign up</a>
        </p>

          
      </div>
    </>
  )
}

export default Login