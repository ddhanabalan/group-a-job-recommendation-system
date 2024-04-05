import { useForm } from 'react-hook-form'
import { useState } from 'react'
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
import '../SignUpForm/SignUpForm2.css';
import './ProfileEdit.css';
export default function ProfileEdit({ data }) {
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
    const serverErrorMsgs = {
        "server": { "status": false, "message": "unable to reach server" },
        "formdata": { "status": false, "message": "Field unfilled.Please complete the form." },
        "phone": { "status": false, "message": "Invalid Phone number.Please retype." },
        "success": { "status": true, "message": "Account successfully created" }
    }

    //const userType = location.state.userType;
    const [loading, SetLoading] = useState(false)
    const [success, SetSuccess] = useState(false)
    const [img, SetImg] = useState();
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
            await axios.post('/seeker/register', newdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (e) {
            console.log(e)
            alert(e.message)
        }
        SetLoading(false)
        SetSuccess(true);
        // setTimeout(()=>{setSuccess(false)},3000)
        // navigate("/login/" + userType);

    }

    return (
        <>
            {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
            <div className='profile-edit-page'>
                {loading && <LoaderAnimation />}
                {serverErrorMsgs && success == true ? /*loads server error messages and displays at top*/
                    <div className="alert-boxes">
                        {
                            Object.keys(serverErrorMsgs).map((err) => {
                                return serverErrorMsgs[err]["status"] ?
                                    <ConfBox message={serverErrorMsgs[err]["message"]} animation={greentick} bgcolor="#99FF99" />
                                    :
                                    <ConfBox message={serverErrorMsgs[err]["message"]} animation={failanim} bgcolor="#FFE5B4" />
                            })
                        }
                    </div> /*Final Registration confirmed message box*/
                    :
                    <></>
                }
                <div className="signup-container info-box profile-edit-box">
                    <h3 className="signup-header info-header">Edit profile</h3>
                    {/*<Box sx={{ boxShadow: 0, paddingBottom: 1, paddingTop: 3, paddingX: 4, borderRadius: 5, width: 800, height: 580, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>*/}

                    <form noValidate autoComplete='on' onSubmit={handleSubmit(subForm)}>
                        {/*form has separate textboxes displayed according to who is signing up*/}
                        <div className='personal-info-container'>

                            {/* <div id="item-1" className="personal-detail-picture">
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
                            </div> */}
                            {/* First Name */}
                            <div id="item-3">
                                <p className="text-head">First Name<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input" variant="outlined" type='text'
                                    defaultValue={data.first_name}
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
                            {/* Last Name */}
                            <div id="item-4">
                                <p className="text-head">Last Name<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input" variant="outlined"
                                    defaultValue={data.last_name}
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

                            {/*Country*/}
                            <div id="item-5">
                                <p className="text-head">Country<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input" variant="outlined" select
                                    defaultValue={data.country}
                                    error={'country' in errors}
                                    {...register("country",
                                        {
                                            required: "please select country",
                                        })}>
                                    {countries.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>))}
                                </TextField>
                                <p className="error-message">{errors.country?.message || ""}</p>
                            </div>

                            {/*Phone number*/}
                            <div id="item-6">
                                <p className="text-head">Location<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input" variant="outlined"
                                    defaultValue={data.location}
                                    error={'location' in errors}
                                    {...register("location",
                                        {
                                            required: "please enter phone number",
                                            pattern: {
                                                value: /^\d{10}$/, // Regular expression to check exactly 10 digits
                                                // message: "Phone number must be exactly 10 numbers"
                                            }
                                        })} />

                                <p className="error-message">{errors.phone?.message || ""}</p>
                            </div>
                            
                        </div>
                        <div id="item-8">
                            <p className="text-head">Bio<span className="text-danger"> *</span></p>
                            <TextField className="personal-details-input profile-edit-bio" variant="outlined" fullWidth
                                multiline
                                defaultValue={data.bio}
                                error={'bio' in errors}
                                {...register("bio",
                                    {
                                        required: ""
                                    })}>
                            </TextField>
                            <p className="error-message">{errors.gender?.message || ""}</p>
                        </div>
                        {/*Submit button*/}
                        {/* <div>
                            <Button type='submit' className="continue-btn" variant="contained" sx={{ backgroundColor: 'black', borderRadius: 2 }} endIcon={<ArrowForwardIcon />}>
                                <p >Continue</p>
                            </Button>
                        </div> */}
                    </form>
                    <br />

                </div>
            </div>
        </>
    )
}

