import './SignUpForm2.css'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button, TextField, MenuItem } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { FastAverageColor } from 'fast-average-color';
import ConfBox from "../ConfirmMsgBox/ConfirmMsgBox.jsx"
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios, { jobAPI } from '../../api/axios';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import greentick from '../../images/green-confirm.json'
import failanim from '../../images/fail-animation.json'
import moment from 'moment/moment.js';
import { Autocomplete } from '@mui/material';
import { utilsAPI } from '../../api/axios';

function SignUpForm2() {
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { register, formState: { errors }, handleSubmit, watch,trigger } = useForm({ mode: 'onTouched' });
  const RETRY_DELAY = 5000;
  const SIGNUP_AGE = 18;
  const backupCountries = [{"country":'India'}, {"country":'USA'}, {"country": "Germany"}]
  const genders = ['Male', 'Female', 'Transgender', 'Others']
  const backupIndustries = [{"industry":'Automobile'}, {"industry":'Agriculture'}, {"industry": 'Medical'}, {"industry": 'Defense'}, {"industry": 'Aeronautical'}, {"industry": 'Chemical'}]

  const location = useLocation();
  const navigate = useNavigate();
  const userType = location["pathname"].includes("organization") ? "employer" : "seeker";

  const [countries, setCountries] = useState([])
  const [industries, setIndustries] = useState([])

  //error messages received after submitting form
  /*const serverErrorMsgs= {200: "Account creation request sent successfully",
                          201: "Account successfully created",
                          302: "Username already exists",
                          401: "unable to reach server.Please try later.",
                          500: "server error.Please try later."}*/

  //const userType = location.state.userType;
  const [loading, SetLoading] = useState(false)
  const [success, SetSuccess] = useState(false)
  const [img, SetImg] = useState();
  const [bannerColor, setBannerColor] = useState();
  const [serverMsg, setServerMsg] = useState({});
  const [mailInfo, setMailInfo] = useState(location.state?location.state : null);
  const [fetchingErrors, setFetchingErrors] = useState({"username": false, "industries": false, "countries": false});
  const handleChange = (e) => {
    console.log(e)
    const fac = new FastAverageColor();
    const data = new FileReader();
    data.addEventListener('load', () => {
      SetImg(data.result)
      fac.getColorAsync(data.result).then(color => setBannerColor(color.hex))
    })
    data.readAsDataURL(e.target.files[0])

  }


  // const { info, setInfo } = useState(); 
  const dateValidation = (dob) => {
    const age = parseInt(moment(new Date()).diff(moment(dob), 'years'));
    //console.log(age, ">=", sIGNUP_AGE, ":", age>=sIGNUP_AGE)

    return age;
  }

  async function subForm(data) {
    //form data submission and redirecting to login

    SetLoading(true)
    console.log(location)
    const newdata = { ...data, ...location.state, 'profile_picture': img, 'profile_banner_color': bannerColor };
    const checkUserType = newdata.userType
    console.log("checked type", checkUserType)
    delete newdata.userType
    console.log("full data", newdata);
    try {
      const res = await axios.post(`/${checkUserType == "seeker" ? "seeker" : "recruiter"}/register`, newdata, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setServerMsg({ ...res });
      res.request.status === 201 && setTimeout(() => {
        navigate(`/login`)
      }, 2000)

    } catch (e) {
      setServerMsg({ ...e.response });
      console.log(e)
      // setTimeout(() => {
      //   navigate(`/login`)
      // }, 5000)
      // alert(e.message)
    }



    SetLoading(false)
    SetSuccess(true);
    // setTimeout(()=>{setSuccess(false)},3000)
    // navigate("/login/" + userType);

  }



  const usernameVerify= async(username)=>{
    console.log("hello")
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      

      return "out of constraints";
    }
    try{
      const r = await (axios.post(`/username/verify/${username}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }))
      console.log("username verification", r)
      setFetchingErrors({...fetchingErrors, "username": false})

      return r.data;
     }
     catch(e){
      setFetchingErrors({...fetchingErrors, "username": true})
      console.log("username verify error", e)
      //alert("Username verification failed")
      return true //"error"
     }
  }

  const fetchIndustries= async ()=>{
    try{
      const r = await utilsAPI.get('api/v1/industry/');
      if(r.data.length) 
        {setIndustries(r.data);
      setFetchingErrors({...fetchingErrors, "industries": false});
    }
      else{
        setIndustries(backupIndustries);
        setFetchingErrors({...fetchingErrors, "industries": true});
      }
    }
    catch(e){
      console.log("industry fetch failed", e);
      //alert("industries not fetched");
      setIndustries(backupIndustries);
      setFetchingErrors({...fetchingErrors, "industries": true});
    }
  }

  const fetchCountries= async ()=>{
    try{
      const r = await utilsAPI.get('api/v1/country/');
      if(r.data.length) 
        {setCountries(r.data);
        setFetchingErrors({...fetchingErrors, "countries": false})
    }
      else{
        setCountries(backupCountries);
        
        setFetchingErrors({...fetchingErrors, "countries": true})

      }
    }
    catch(e){
      console.log("industry fetch failed", e);
      //alert("industries not fetched");
      setCountries(backupCountries);
      setFetchingErrors({...fetchingErrors, "countries": true})

    }
  }

  const generateDelay = (delay, callback, value=null) => {
    setTimeout(() => {
      value?callback(value):callback()
    }, delay);
    console.log(delay, " ms over")
    return () => clearInterval(generateDelay);
    }

    const parallelRetryFn = (delay) =>{
      setTimeout(() => {
        if(fetchingErrors.username)trigger(['username']);
          if(fetchingErrors.industries)fetchIndustries();
          if(fetchingErrors.countries)fetchCountries();
      }, delay);
      console.log(delay, " ms over")
    return () => clearInterval(parallelRetryFn);
    }
  

  const pageClass = `page-container ${userType === "seeker" ? 'signup-page-user' : 'signup-page'}`;
  console.log("serverMessage", serverMsg)

   useEffect(()=>{if( !(mailInfo?.verified)){
     navigate("/")
   }},[mailInfo])
  useEffect(()=>{
    fetchIndustries();
    fetchCountries();
  }, [])
  useEffect(()=>
    {console.log("fetching errors", fetchingErrors, industries, countries)
    if(Object.keys(fetchingErrors).some((e)=>fetchingErrors[e] === true))parallelRetryFn(RETRY_DELAY);

    }, [fetchingErrors])
  return (
    <>
      {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
      <div className={pageClass} >
        {loading && <LoaderAnimation />}
        {Object.keys(serverMsg).length !== 0 ? /*loads server error messages and displays at top*/
          <div className="alert-boxes">
            {
              serverMsg.status === 201 ?
                <ConfBox message="Account successfully created" animation={greentick} bgcolor="#99FF99" />
                :
                <ConfBox message={serverMsg.data?.detail} animation={failanim} bgcolor="#FFE5B4" />}
          </div> /*Final Registration confirmed message box*/
          :
          <></>
        }
        <div className="signup-container info-box">
          <h3 className="signup-header info-header">{userType === "seeker" ? "Personal" : "Company"} information</h3>
          {/*<Box sx={{ boxShadow: 0, paddingBottom: 1, paddingTop: 3, paddingX: 4, borderRadius: 5, width: 800, height: 580, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>*/}

          <form noValidate autoComplete='on' onSubmit={handleSubmit(subForm)}>
            {/*form has separate textboxes displayed according to who is signing up*/}
            <div className='personal-info-container'>


              <div id="item-1">
                <p className="text-head">Username<span className="text-danger"> *</span></p>
                <TextField className="personal-details-input" variant="outlined" type='text'
                  error={'username' in errors}
                  {...register("username",
                    {
                      required: "username cannot be empty",
                      validate:  async (username)=>{
                        const r = await usernameVerify(username)
                        console.log("reasponse",r)
                        if(r==="error") return "Username couldnt be verified";
                        else if(!r) return "Username not available"
                        else if(r === "out of constraints") return "Username must be between 3 and 16 characters long and may contain letters, numbers, and underscores.";
                      }  ,
                    })} />
                <p className="error-message">{errors.username?.message || ""}</p>
              </div>
              <div id="item-2" className="personal-detail-picture">
                <p className="text-head">Profile picture (optional)</p>
                <div className='card-img-container personal-picture' style={{overflow:'visible'}}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    startIcon={<AddCircleRoundedIcon />}
                  >
                    <VisuallyHiddenInput type="file" onChange={handleChange} />
                  </Button>
                  <div className='p-image'>
                    <img src={img ? img : profilePlaceholder} alt="profile picture" />
                  </div>
                </div>
                <p className='warning-pic-format'>supported formats: .jpg, .jpeg, .webp</p>
              </div>
              <div id="item-3">
                {
                  userType === "seeker" ?
                    /*First Name*/
                    <div>
                      <p className="text-head">First Name<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined" type='text'
                        error={'first_name' in errors}
                        {...register("first_name",
                          {
                            required: "please enter first name",
                            pattern: {
                              value: /^[a-zA-Z]+$/,
                              message: "Only letters allowed"
                            }
                          })} />
                      <p className="error-message">{errors.first_name?.message || ""}</p>
                    </div>
                    :
                    /*Company Name*/
                    <div>
                      <p className="text-head">Company Name<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined" type='text'
                        error={'company_name' in errors}
                        {...register("company_name",
                          {
                            required: "please enter company name",
                          })} />
                      <p className="error-message">{errors.company_name?.message || ""}</p>
                    </div>
                }
              </div>

              <div id="item-4">
                {
                  userType === "seeker" ?
                    /*last name*/
                    <div>
                      <p className="text-head">Last Name<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined"

                        error={'last_name' in errors}
                        {...register("last_name",
                          {
                            required: "please enter last name",
                            pattern: {
                              value: /^[a-zA-Z\s]+$/,
                              message: "Only letters and whitespace allowed"
                            }
                          })} />
                      <p className="error-message">{errors.last_name?.message || ""}</p>
                    </div>
                    :
                    /*Country*/
                    <div>
                      <p className="text-head">Industry<span className="text-danger"> *</span></p>
                      <Autocomplete
                                            disablePortal
                                            options={industries}
                                            
                                            
                                            getOptionLabel={(option) => option["industry"]}
                                            isOptionEqualToValue={(option) =>industries.some(e => e["industry"] === option)}
                                            
                                            renderInput={(params) => <TextField
                                                className="personal-details-input"
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                }}
                                                
                                                variant="outlined"
                                                
                                                {...register("industry", { required: "Field is required", })}
                                            />}
                                        />
                      <p className="error-message">{errors.industry?.message || ""}</p>
                    </div>
                }
              </div>

              {/*Country*/}
              <div id="item-5">
                <p className="text-head">Country<span className="text-danger"> *</span></p>
                                        <Autocomplete
                                            disablePortal
                                            options={countries}
                                            
                                            
                                            getOptionLabel={(option) => option["country"]}
                                            isOptionEqualToValue={(option) =>countries.some(e => e["country"] === option)}
                                            
                                            renderInput={(params) => <TextField
                                                className="personal-details-input"
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                }}
                                                
                                                variant="outlined"
                                                
                                                {...register("country", { required: "Field is required", })}
                                            />}
                                        />
                <p className="error-message">{errors.country?.message || ""}</p>
              </div>

              {/*City*/}
              <div id="item-6">
                {
                  <div>
                    <p className="text-head">City<span className="text-danger"> *</span></p>
                    <TextField className="personal-details-input" variant="outlined"

                      error={'city' in errors}
                      {...register("city",
                        {
                          required: "please enter city",
                        })} />
                    <p className="error-message">{errors.city?.message || ""}</p>
                  </div>
                }
              </div>

              {/*Phone number*/}
              <div id="item-7">
                <p className="text-head">Phone Number<span className="text-danger"> *</span></p>


                <TextField className="personal-details-input" variant="outlined"
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
              </div>

              <div id="item-8">
                {
                  userType === "seeker" ?
                    /*Date of Birth*/
                    <div>
                      <p className="text-head">Date-of-Birth<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined"
                        type="date"
                        error={'dob' in errors}
                        {...register("dob",
                          {

                            required: "please enter dob",
                            validate: (val) => dateValidation(val) >= SIGNUP_AGE || "Age should be above 18 to register",
                          })} />
                      <p className="error-message">{errors.dob?.message || ""}</p>
                    </div>
                    :
                    /*Pincode*/
                    <div>
                      <p className="text-head">Pincode<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined" type='text'
                        error={'pincode' in errors}
                        {...register("pincode",
                          {
                            required: "please enter pincode",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Only numbers allowed"
                            }
                          })} />
                      <p className="error-message">{errors.pincode?.message || ""}</p>
                    </div>
                }
              </div>

              <div id="item-9">
                {
                  userType === "seeker" ?
                    /*Gender*/
                    <div>
                      <p className="text-head">Gender<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined" select defaultValue=""
                        error={'gender' in errors}
                        {...register("gender",
                          {
                            required: "please select gender"
                          })}>
                        {genders.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                      </TextField>
                      <p className="error-message">{errors.gender?.message || ""}</p>
                    </div>
                    :
                    /*Address*/
                    <div>
                      <p className="text-head">Address<span className="text-danger"> *</span></p>
                      <TextField className="personal-details-input" variant="outlined"

                        error={'address' in errors}
                        {...register("address",
                          {
                            required: "please enter address",
                          })} />
                      <p className="error-message">{errors.address?.message || ""}</p>
                    </div>
                }
              </div>




            </div>

            {/*Submit button*/}
            <div>
              {/* <Button type='submit' className="continue-btn" variant="contained" sx={{ backgroundColor: 'black', borderRadius: 2 }} endIcon={<ArrowForwardIcon />}>
                <p >Continue</p>
              </Button> */}
              <button className='continue-btn continue-btn-extend'>
                Sign up
                <div class="arrow-wrapper">
                  <div class="arrow"></div>

                </div>
              </button>
            </div>
          </form>
          <br />

        </div>
      </div>
    </>
  )
}

export default SignUpForm2;