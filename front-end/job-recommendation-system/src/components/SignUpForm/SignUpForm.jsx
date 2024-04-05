import './SignUpForm.css'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Mail from '@mui/icons-material/Mail'
import Lock from '@mui/icons-material/Lock'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, TextField, Stack } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircleIcon from '@mui/icons-material/Circle';
import { useLocation, useNavigate, Link } from 'react-router-dom';



function SignUpForm() {

  const { register, formState: { errors }, handleSubmit, watch } = useForm({ mode: 'onTouched' });
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location["pathname"].includes("employer") ? "employer" : "seeker";

  //const userType = location.state["userType"];
  // const { info, setInfo } = useState(); 

  // console.log("errors", { errors })

  function handleVisibility() {
    //Passsword Visibility toggle
    setVisible(!visible);
  }


  function subForm(data) {
    //Form data submission and passing it to sign up page part 2
    console.log(data)
    navigate("../signup2/" + userType, { state: { "email": data.email, "password": data.password, "userType": userType } })
  }
  const color = watch("password") === watch("cpassword") ? "#07F407" : "#ff2d00"

  return (
    <>
      {/*SignUp Form*/}
      <div className="signup-container">
          <h3 className="signup-header">SignUp</h3>
          {/*<Box sx={{ boxShadow: 2, paddingBottom: 4, paddingTop: 3, paddingX: 3, borderRadius: 5, width: 800 ,height: 580, display:'flex', flexDirection:'column', alignItems:'center',backgroundColor: 'white'}}>*/}
        
          <br />
          {/*<Box sx={{ boxShadow: 7, paddingBottom: 6, paddingTop: 3, paddingX: 3, borderRadius: 5, width: 340 ,display:'flex',alignItems: 'center', flexDirection:'column'}}>*/}
          <div className="details-container">
          <form noValidate autoComplete='on' onSubmit={handleSubmit(subForm)}>
            <Stack spacing={2}>

              {/*email box validation checking*/}
              <Box sx={{ display: 'flex', alignItems: 'email' in errors ? 'center' : 'flex-end', gap: 1 }}>
                <Mail />
                <TextField variant="standard"
                  label="Email"
                  type='email'
                  helperText={'email' in errors ? errors.email?.message : ""}
                  error={'email' in errors}
                  {...register("email",
                    {
                      required: "please enter email",
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email not valid"
                      }
                    })}
                  sx={{ width: 230 }} />

              </Box>

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
                  sx={{ width: 230 }} />
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
                  sx={{ width: 230, position: 'relative', left: -12 }} />
              </Box>
            </Stack>

            <Button variant="contained" type="submit" sx={{ backgroundColor: 'black', borderRadius: 2 ,marginTop:'1rem'}} endIcon={<ArrowForwardIcon />}>
              <p>Continue</p>
            </Button>
            </form>
          </div>

        
          <div className="login-redirect">
            <Link to={'../login/' + userType} state={{ "userType": userType }}><p>Already a user? Sign in</p></Link>
          </div>
      </div>
    </>
  )
}

export default SignUpForm;