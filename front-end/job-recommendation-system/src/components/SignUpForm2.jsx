import './SignUpForm2.css'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ConfBox from "./ConfirmMsgBox.jsx"
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Grid, Button, TextField, MenuItem } from '@mui/material'


function SignUpForm2() {

  const { register, formState: { errors }, handleSubmit, watch } = useForm({ mode: 'onTouched' });
  
  const countries = ['India','USA','Australia','China','Japan']
  const genders = ['Male', 'Female', 'Transgender', 'Others']
  const industries = ['Automobile', 'Agriculture', 'Medical', 'Defense', 'Aeronautical', 'Chemical']
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location["pathname"].includes("employer")?"employer":"seeker";
  //const userType = location.state.userType;
  const [success, setSuccess] = useState(false)




  // const { info, setInfo } = useState(); 

  
  function subForm(data){
    //form data submission and redirecting to login
    const newdata = {...data,...location.state,};
    console.log("full data", newdata);
    setSuccess(true);
    navigate("/login/" + userType);

  }

  return (
    <>
      {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
      
      <div className="confirmed-box" style={{visibility:success?"visible":"hidden"}}><ConfBox/></div> {/*Final Registration confirmed message box*/}
      <div className="signup_container">
        
        <Box sx={{ boxShadow: 0, paddingBottom: 1, paddingTop: 3, paddingX: 4, borderRadius: 5, width: 800, height: 580, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(subForm)}>
            <h3 className="display-flex align-items-start signup-header">{userType==="seeker"?"Personal":"Company"} information</h3>
            <br />
            {/*form has separate textboxes displayed according to who is signing up*/}
            <Grid container spacing={3} sx={{ width: 680 }}>
              {
              userType==="seeker"?
                  /*First Name*/
                  <Grid item xs>
                    <p className="text-head">First Name<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} type='text'
                      error={'fname' in errors}
                      {...register("fname",
                        {
                          required: "please enter first name",
                          pattern: {
                            value: /^[a-zA-Z]+$/,
                            message: "Only letters allowed"
                          }
                        })}/>
                    <p className="error-message">{errors.fname?.message || ""}</p>
                  </Grid>
                    :
                  /*Company Name*/
                  <Grid item xs>
                  <p className="text-head">Company Name<span className="text-danger"> *</span></p>
                  <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} type='text'
                    error={'cname' in errors}
                    {...register("cname",
                      {
                        required: "please enter company name",
                      })}/>
                  <p className="error-message">{errors.cname?.message || ""}</p>
                  </Grid>
              }
              {
              userType==="seeker"?
                  /*last name*/
                  <Grid item xs>
                    <p className="text-head">Last Name<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }}

                      error={'lname' in errors}
                      {...register("lname",
                        {
                          required: "please enter last name",
                          pattern: {
                            value: /^[a-zA-Z]+$/,
                            message: "Only letters allowed"
                          }
                        })} />
                    <p className="error-message">{errors.lname?.message || ""}</p>
                  </Grid>
                  :
                  /*Address*/
                  <Grid item xs>
                    <p className="text-head">Address<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }}

                      error={'address' in errors}
                      {...register("address",
                        {
                          required: "please enter address",
                        })} />
                    <p className="error-message">{errors.address?.message || ""}</p>
                  </Grid>
              }
                {/*Country*/}
              <Grid item xs>
                <p className="text-head">Country<span className="text-danger"> *</span></p>
                <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} select
                  defaultValue=""

                  error={'country' in errors}
                  {...register("country",
                    {
                      required: "please select country",
                    })}>
                  {countries.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                </TextField>
                <p className="error-message">{errors.country?.message || ""}</p>
              </Grid>

              {/*Phone number*/}
              <Grid item xs>
                <p className="text-head">Phone Number<span className="text-danger"> *</span></p>


                <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0}}
                  error={'phone' in errors}
                  {...register("phone",
                    {
                      required: "please enter phone number",
                      pattern: {
                        value: /^\d{10}$/, // Regular expression to check exactly 10 digits
                        message: "Phone number must be exactly 10 numbers"
                      }
                    })} />

                <p className="error-message">{errors.phone?.message || ""}</p>
              </Grid>
              
              {
              userType==="seeker"?
                  /*Date of Birth*/
                  <Grid item xs>
                    <p className="text-head">Date-of-Birth<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0}}
                      type="date"
                      error={'dob' in errors}
                      {...register("dob",
                        {
                  
                          required: "please enter dob",
                        })} />
                    <p className="error-message">{errors.dob?.message || ""}</p>
                  </Grid>
                  :
                  /*Pincode*/
                  <Grid item xs>
                  <p className="text-head">Pincode<span className="text-danger"> *</span></p>
                  <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} type='text'
                    error={'pin' in errors}
                    {...register("pin",
                      {
                        required: "please enter pincode",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Only numbers allowed"
                        }
                      })}/>
                  <p className="error-message">{errors.pin?.message || ""}</p>
                  </Grid>
              }

              {
              userType==="seeker"?
                  /*Gender*/
                  <Grid item xs>
                    <p className="text-head">Gender<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} select defaultValue="" 
                      error={'gender' in errors}
                      {...register("gender",
                        {
                          required: "please select gender"
                        })}>
                      {genders.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                    </TextField>
                    <p className="error-message">{errors.gender?.message || ""}</p>
                  </Grid>
                  :
                  /*Industry*/
                  <Grid item xs>
                    <p className="text-head">Industry<span className="text-danger"> *</span></p>
                    <TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: '30px' }, width: 300, backgroundColor: '#D9D9D9', paddingY: 0 }} select defaultValue="" 
                      error={'industry' in errors}
                      {...register("industry",
                        {
                          required: "please select industry"
                        })}>
                      {industries.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                    </TextField>
                    <p className="error-message">{errors.industry?.message || ""}</p>
                  </Grid>
              }
            </Grid>
            {/*Submit button*/}
            <Box sx={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", height: Object.keys(errors).length === 0?260:215 }}>
              <Button variant="contained" type="submit" sx={{ backgroundColor: 'black', borderRadius: 2, width: "175px", height: "50px" }} endIcon={<ArrowForwardIcon />}>
                <p>Continue</p>
              </Button>
            </Box>
          </form>
          <br />
        </Box>
      </div>
    </>
  )
}

export default SignUpForm2;