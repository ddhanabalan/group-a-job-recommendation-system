import './SignUpForm2.css'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button, TextField, MenuItem } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ConfBox from "../ConfirmMsgBox/ConfirmMsgBox.jsx"
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from '../../api/axios';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import greentick from '../../images/green-confirm.json'
import failanim from '../../images/fail-animation.json'

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

  const { register, formState: { errors }, handleSubmit, watch } = useForm({ mode: 'onTouched' | 'onSubmit' });

  const countries = ['India', 'USA', 'Australia', 'China', 'Japan']
  const genders = ['Male', 'Female', 'Transgender', 'Others']
  const industries = ['Automobile', 'Agriculture', 'Medical', 'Defense', 'Aeronautical', 'Chemical']
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location["pathname"].includes("employer") ? "employer" : "seeker";

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
  const [serverMsg, setServerMsg] = useState({});
  const handleChange = (e) => {
    console.log(e.target.files)
    const data = new FileReader();
    data.addEventListener('load', () => {
      SetImg(data.result)
    })
    data.readAsDataURL(e.target.files[0])

  }




  // const { info, setInfo } = useState(); 


  async function subForm(data) {
    //form data submission and redirecting to login
    
    SetLoading(true)
    console.log(location)
    const newdata = { ...data, ...location.state, 'profile_picture': img };
    delete newdata.userType
    console.log("full data", newdata);
    try {
        const res = await axios.post('/seeker/register', newdata, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setServerMsg({...res});
      setTimeout(() => {
        navigate('/login/seeker')
      }, 5000)

    } catch (e) {
      setServerMsg({...e.response});
      console.log(e)
      setTimeout(() => {
        navigate('/login/seeker')
      }, 5000)
      // alert(e.message)
    }
   
    
    
    SetLoading(false)
    SetSuccess(true);
    // setTimeout(()=>{setSuccess(false)},3000)
    // navigate("/login/" + userType);

  }
  
  
  console.log("serverMessage",serverMsg)
  return (
    <>
      {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
      <div className='page-container'>
      {loading && <LoaderAnimation />}
      {Object.keys(serverMsg).length!==0? /*loads server error messages and displays at top*/
        <div className="alert-boxes">
          {
          serverMsg.status===201?
          <ConfBox message="Account successfully created" animation={greentick} bgcolor="#99FF99"/>
          :
          <ConfBox message={serverMsg.data?.detail} animation={failanim} bgcolor="#FFE5B4"/>}
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
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: "Only letters allowed"
                    }
                  })} />
              <p className="error-message">{errors.username?.message || ""}</p>
            </div>
            <div id="item-2" className="personal-detail-picture">
              <p className="text-head">Profile picture (optional)</p>
              <div className='card-img-container personal-picture'>
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
                          value: /^[a-zA-Z]+$/,
                          message: "Only letters allowed"
                        }
                      })} />
                  <p className="error-message">{errors.last_name?.message || ""}</p>
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

            {/*Country*/}
            <div id="item-5">
              <p className="text-head">Country<span className="text-danger"> *</span></p>
              <TextField className="personal-details-input" variant="outlined" select
                defaultValue=""

                error={'country' in errors}
                {...register("country",
                  {
                    required: "please select country",
                  })}>
                {countries.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
              </TextField>
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
                /*Industry*/
                <div>
                  <p className="text-head">Industry<span className="text-danger"> *</span></p>
                  <TextField className="personal-details-input" variant="outlined" select defaultValue=""
                    error={'industry' in errors}
                    {...register("industry",
                      {
                        required: "please select industry"
                      })}>
                    {industries.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                  </TextField>
                  <p className="error-message">{errors.industry?.message || ""}</p>
                </div>
            }
            </div>

            
            

          </div>

          {/*Submit button*/}
          <div>
          <Button type='submit' className="continue-btn" variant="contained" sx={{ backgroundColor: 'black', borderRadius: 2 }} endIcon={<ArrowForwardIcon />}>
            <p >Continue</p>
          </Button>
          </div>
        </form>
        <br />

      </div>
      </div>
    </>
  )
}

export default SignUpForm2;