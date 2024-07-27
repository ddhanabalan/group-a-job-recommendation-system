import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button, TextField, MenuItem } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import getStorage from '../../storage/storage.jsx';
import ConfBox from "../ConfirmMsgBox/ConfirmMsgBox.jsx"
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from '../../api/axios';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import profilePlaceholder from '../../images/profile_placeholder.svg';
import greentick from '../../images/green-confirm.json'
import failanim from '../../images/fail-animation.json'
import { Autocomplete } from '@mui/material';
import { utilsAPI } from '../../api/axios';
import '../SignUpForm/SignUpForm2.css';
import './ProfileEdit.css';
export default function ProfileEdit({ data, isErrorChild, getProfileValues }) {
    const { register, getValues, formState: { errors }, watch, setValue } = useFormContext();
    const backupCountries = [{ "country": 'India' }, { "country": 'USA' }, { "country": "Germany" }, { "country": 'Australia' }, { 'country': "Japan" }]
    const [countries, setCountries] = useState([])
    const [user, SetUser] = useState()
    const [fetchingErrors, setFetchingErrors] = useState({ "countries": false });
    const [userCountry, setUserCountry] = useState({ "country": data.country })

    const fetchCountries = async () => {
        try {
            const r = await utilsAPI.get('api/v1/country/');
            if (r.data.length) {
                setCountries(r.data);
                setFetchingErrors({ ...fetchingErrors, "countries": false })
            }
            else {
                setCountries(backupCountries);

                setFetchingErrors({ ...fetchingErrors, "countries": true })

            }
        }
        catch (e) {
            console.log("industry fetch failed", e);
            //alert("industries not fetched");
            setCountries(backupCountries);
            setFetchingErrors({ ...fetchingErrors, "countries": true })

        }
    }

    const generateDelay = (delay, callFn, value = null) => {
        setTimeout(() => {
            value ? callFn(value) : callFn()
        }, delay);
    }

    useEffect(() => {
        SetUser(getStorage("userType"))
        fetchCountries()
        setValue('country', data.country)
    }, [])
    const watchedFields = watch()
    useEffect(() => {
        getProfileValues({ ...getValues() })
    }, [watchedFields,getProfileValues])
    useEffect(() => {

        if (fetchingErrors.countries) generateDelay(3000, fetchCountries)
    }, [fetchingErrors])

    console.log("error in head", errors)
    Object.keys(errors).length === 0 && isErrorChild(false)
    const myErrors = errors
    useEffect(() => {
        console.log("hhhwhhw", errors)
        Object.keys(errors).length !== 0 && isErrorChild(true)
    }, [myErrors])
    return (
        <>
            {/*SignUp Form part-2(Personal info from seekers/Company info from employers)*/}
            <div className='profile-edit-page'>

                <div className="signup-container info-box profile-edit-box">
                    <h3 className="signup-header info-header">Edit profile</h3>




                    <div className='personal-info-container'>
                        {/* First Name */}
                        {user === "seeker" &&
                            (<div id="item-3">
                                <p className="text-head">First Name<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input profile-edit-input" variant="outlined" type='text'
                                    defaultValue={data.first_name}
                                    error={'first_name' in errors}
                                    {...register("first_name",
                                        {
                                            required: "Please enter first name",
                                            pattern: {
                                                value: /^[a-zA-Z]+$/,
                                                message: "Only letters allowed"
                                            }
                                        })} />
                                <p className="error-message">{errors.first_name?.message || ""}</p>
                            </div>)
                        }

                        {/* Company Name */}
                        {user === "recruiter" &&
                            <div id="item-3">
                                <p className="text-head">Company Name<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input profile-edit-input" variant="outlined" type='text'
                                    defaultValue={data.company_name}
                                    error={'company_name' in errors}
                                    {...register("company_name",
                                        {
                                            required: "Please enter company name",
                                            pattern: {
                                                value: /^[a-zA-Z]+$/,
                                                message: "Only letters allowed"
                                            }
                                        })} />
                                <p className="error-message">{errors.company_name?.message || ""}</p>
                            </div>}

                        {/* Last Name */}
                        {user === "seeker" &&
                            <div id="item-4">
                                <p className="text-head">Last Name<span className="text-danger"> *</span></p>
                                <TextField className="personal-details-input profile-edit-input" variant="outlined"
                                    defaultValue={data.last_name}
                                    error={'last_name' in errors}
                                    {...register("last_name",
                                        {
                                            required: "Please enter last name",
                                            pattern: {
                                                value: /^[a-zA-Z\s]+$/,
                                                message: "Only letters and whitespace allowed"
                                            }
                                        })} />
                                <p className="error-message">{errors.last_name?.message || ""}</p>
                            </div>}


                        {/*Country*/}
                        <div id="item-5">
                            <p className="text-head">Country<span className="text-danger"> *</span></p>
                            <Autocomplete
                                disablePortal
                                options={countries}
                                value={userCountry}
                                defaultValue={{ "country": data.country }}
                                getOptionLabel={(option) => option["country"]}
                                isOptionEqualToValue={(option, value) => value["country"] === option["country"]}

                                onChange={(event, newInputValue) => {
                                    setUserCountry(newInputValue)
                                    setValue('country', newInputValue["country"])
                                }}

                                renderInput={(params) => <TextField

                                    className="personal-details-input profile-edit-input"
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true
                                    }}

                                    variant="outlined"
                                    defaultValue={data.country}
                                    {...register("country", {
                                        required: "Field is required",
                                        // validate: (value)=>{
                                        //     const r= countries.some(e=>e.country===value)
                                        //     if( r)
                                        //         { console.log("country compare", r)
                                        //             return true;}
                                        //     else return false;
                                        // }
                                    })}
                                />}
                            />
                            <p className="error-message">{errors.country?.message || ""}</p>
                        </div>

                        {/*location*/}
                        <div id="item-6">
                            <p className="text-head">City<span className="text-danger"> *</span></p>
                            <TextField className="personal-details-input profile-edit-input" variant="outlined"
                                defaultValue={data.city}
                                error={'city' in errors}
                                {...register("city",
                                    {
                                        required: "Please enter city",

                                    })} />

                            <p className="error-message">{errors.city?.message || ""}</p>
                        </div>

                    </div>
                    <div id="item-8">
                        <p className="text-head">Bio</p>
                        <TextField className="personal-details-input profile-edit-bio profile-edit-input" variant="outlined" fullWidth
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

