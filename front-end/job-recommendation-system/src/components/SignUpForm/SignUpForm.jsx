import './SignUpForm.css'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Mail from '@mui/icons-material/Mail'
import Lock from '@mui/icons-material/Lock'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, TextField, Stack } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircleIcon from '@mui/icons-material/Circle';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from "../../api/axios"



function SignUpForm() {

  const { register, formState: { errors }, handleSubmit, watch, trigger } = useForm({ mode: 'onTouched' });
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location["pathname"].includes("organization") ? "employer" : "seeker";
   const color = watch("password") === watch("cpassword") ? "#07F407" : "#ff2d00"
  const [fetchingErrors, setFetchingErrors] = useState({'email': false})

  //const userType = location.state["userType"];
  // const { info, setInfo } = useState(); 

  // console.log("errors", { errors })

  const handleVisibility = () => {
    //Passsword Visibility toggle
    setVisible(!visible);
  }


  const subForm = (data) => {
    //Form data submission and passing it to sign up page part 2
    console.log(data)
    navigate(userType==="employer"?"/signup/organization/personal-details":"/signup/personal-details", { state: { "email": data.email, "password": data.password, "userType": userType, "verified": true } })
  }
  const emailVerify= async(email)=>{
    console.log("hello")
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return "out of constraints";
    }
    try{
      const r = await (axios.post(`/email/check/${email}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }))
      console.log("email verification", r)
      setFetchingErrors({...fetchingErrors, "email": false})

      return r.data;
     }
     catch(e){
      console.log("email verify error", e)
      alert("email verification failed")
      setFetchingErrors({...fetchingErrors, "email": true})

      return "error"
     }
  }
 
  const parallelRetryFn = (delay) =>{
    setTimeout(() => {
      if(fetchingErrors.email)trigger(['email']);
    }, delay);
    console.log(delay, " ms over")
  return () => clearInterval(parallelRetryFn);
  }
  useEffect(()=>
    {console.log("fetching errors", fetchingErrors)
    if(Object.keys(fetchingErrors).some((e)=>fetchingErrors[e] === true))parallelRetryFn(RETRY_DELAY);

    }, [fetchingErrors])
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
                      validate: async (email) => {
                        const r = await emailVerify(email)
                        console.log("reasponse",r)
                          if(r==="error") return "Email couldnt be verified";
                          else if(!r) return "Email id already in use"
                          else if(r === "out of constraints") return "Email not in valid format";
                      },
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
                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,32}$/,
                        message: "Your password should have one lowercase, one uppercase, one number, one special symbol from [!@#$%^&*_=+-], and be 8 to 32 characters long"
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

            {/* <Button variant="contained" type="submit" sx={{ backgroundColor: 'black', borderRadius: 2 ,marginTop:'1rem'}} endIcon={<ArrowForwardIcon />}>
              <p>Continue</p>
            </Button> */}
            <button className='continue-btn'>
              Continue
              <div class="arrow-wrapper">
                <div class="arrow"></div>

              </div>
            </button>
            </form>
          </div>

        
          <div className="login-redirect">
          <Link to={'../login'} state={{ "userType": userType }}><p className='link-login-signup'>Already a user? Sign in</p></Link>
          </div>
      </div>
    </>
  )
}

export default SignUpForm;