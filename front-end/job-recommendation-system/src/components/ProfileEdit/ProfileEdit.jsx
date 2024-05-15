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
export default function ProfileEdit({ data ,register,errors}) {
   
   


    return (
        <>
            {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
            <div className='profile-edit-page'>
                
                <div className="signup-container info-box profile-edit-box">
                    <h3 className="signup-header info-header">Edit profile</h3>
                 

                    
                      
                        <div className='personal-info-container'>
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
                                <TextField className="personal-details-input" variant="outlined" 
                                    defaultValue={data.country}
                                    error={'country' in errors}
                                    {...register("country",
                                        {
                                            required: "please select country",
                                        })}>
                                </TextField>
                                <p className="error-message">{errors.country?.message || ""}</p>
                            </div>

                            {/*location*/}
                            <div id="item-6">
                                <p className="text-head">City<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input" variant="outlined"
                                    defaultValue={data.city}
                                    error={'city' in errors}
                                    {...register("city",
                                        {
                                            required: "",
                                            pattern: {
                                                value: /^\d{10}$/, // Regular expression to check exactly 10 digits
                                                // message: "Phone number must be exactly 10 numbers"
                                            }
                                        })} />

                                <p className="error-message">{errors.city?.message || ""}</p>
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
                            <p className="error-message">{errors.bio?.message || ""}</p>
                        </div>
                       
                  
                    <br />

                </div>
            </div>
        </>
    )
}

