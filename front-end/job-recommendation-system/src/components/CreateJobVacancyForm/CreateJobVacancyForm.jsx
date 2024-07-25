import { v4 as uuid } from 'uuid';
import moment from 'moment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BackBtn from '../BackBtn/BackBtn';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import GoogleLocationSearch from '../GoogleLocationSearch/GoogleLocationSearchV2';
import CreateFormTextFields from './CreateFormTextFields';
import MultipleOptions from '../MultipleOptions/MultipleOptions';
import AddTags from '../AddTags/AddTags';
import AddSkills from '../AddSkills/AddSkills';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import JobCardExpanded from '../JobCardExpanded/JobCardExpanded';
import { getStorage, setStorage } from '../../storage/storage';
import { userAPI, jobAPI, utilsAPI } from '../../api/axios';
import { cloneDeep } from 'lodash';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import './CreateJobVacancyForm.css';
export default function JobVacancyForm({ data = {} }) {
    const USERID = getStorage("userID");
    const prefilleddata = data;
    const locating = useLocation();
    const navigate = useNavigate();
    const [dta, setDta] = useState((locating.state ? locating.state : {}))
    console.log("received state data for edit", dta, "pre", prefilleddata)
    const salary_threshold = 5000;
    const profile_picture = getStorage("profile pic")
    const [companyData, setCompanyData] = useState({});
    const { register, formState: { errors }, handleSubmit, setValue, watch } = useForm({ mode: 'onTouched' });

    const [submit, setSubmit] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState("")
    const [prefError, setPrefErrors] = useState({});
    //const [tag_state,setTagState] = useState(false);
    const [googleLocationAutoField, SetGoogleLocationAutoField] = useState(dta.location);
    setValue("location", googleLocationAutoField);
    const [location, SetLocation] = useState(dta.location);
    const [skill, SetSkill] = useState('');

    const [skills, SetSkills] = useState(dta.skills ? dta.skills.map(label => ({ tag: label.skill, id: label.id })) : []);
    const [checkSkillsList, SetList] = useState(skills);
    const [deletedSkills, setDeletedSkills] = useState([]);
    const [addedSkills, setAddedSkills] = useState([]);
    const [tags, setTags] = useState(dta.tags ? dta.tags.map(label => ({ tag: label.tags, id: label.id })) : []);
    const [preferences, setPreferences] = useState({ "skills": skills, "tags": tags, "empType": dta.empType, "exp": dta.exp, "workStyle": dta.workStyle, "workingDays": dta.workingDays });
    const [preview, setPreview] = useState(false);
    const [finalApplicationData, setData] = useState({});
    const [poi, SetPOI] = useState(dta.poi?dta.poi:'');
    const [poisList, SetPoisList] = useState([]);
    const lowerLimit = watch("salary.0");
    const [isUpperLimitEnabled, setIsUpperLimitEnabled] = useState(false);

    useEffect(() => {
        if (lowerLimit!==undefined) {
            setIsUpperLimitEnabled(true);
        } else {
            setIsUpperLimitEnabled(false);
        }
    }, [watch("salary.0")]); //watches lower limit of salary to enable or disable upper limit

    const poiListAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/positions?q=${poi}`)
            SetPoisList([{ "position": "" }, ...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        poiListAPI()
    }, [])

    const redirectFn = (response) => {
        console.log(response.data)
    }
    const callCompanyAPI = async () => {
        try {
            const response = await userAPI.get(`/recruiter/details/`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            console.log("logged comp data", response.data)
            console.log("profile pic", profile_picture)
            setCompanyData(response.data)
        } catch (e) {
            console.log("company failed", e)

            alert(e.message)
        }
    }
    const callJobAPI = async (rec_data, edit = false) => {
        console.log("data to submit to server ", rec_data)
        setSubmissionStatus("processing");
        try {
            if(!edit)
            {const response = await jobAPI.post('/job_vacancy/', rec_data, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getStorage("userToken")}` 
            }         
            }
            
            );
            
            }
            else
            {   const update_data = {...rec_data, 'skills_delete': deletedSkills}
                console.log("updating data", update_data)
                const response = await jobAPI.put(`/job_vacancy/${dta.id}`, update_data, {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }         
                }
                
                );
                
            }
            return true;

        } catch (e) {
            console.log(e)

            alert(e.message)
            return false;
        }
    }
    const [skillsList, setSkillsList] = useState([])
    const skillsAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/skills?q=${skill}`)
            setSkillsList([{ "name": "" }, ...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }

    const setGoogleAutoField = (v) => {
        console.log("registered google auto location", v)
        SetGoogleLocationAutoField(v)
    }

    const handleDeleteSkill = (id) => {
        //accepts id of Skill tag and delete them from the array 
        SetSkills(prevSkills =>
            prevSkills.filter(e => e.id !== id))
    };

    const handleChangeSkill = (v) => {
        //stores the Skill value from the input field as user types
        SetSkill(v)
    };

    const handleSkill = (n) => {
        //accepts a new skill value from the input field and updates the skills array to display the newly added skill and resets the input box value when user clicks the add button
        if (n !== "") {
            SetSkills([...skills, { tag: n, id: uuid() }]);
            SetSkill('')
        }
    };



    const handleChangeLocation = (v) => {
        //stores the Location value from the input field as user types
        console.log("registered location", v)
        SetLocation(v)
        setValue("location", location);
        console.log("entered into register")
    };

    const handleCheckboxChange = (checkedItems, checkLimit, dataType) => {
        //checks multioptions checkbox groups and passes form data only if options selected are below specified checkLimit(employment Type and experience fields)
        const numChecked = Object.values(checkedItems).filter(Boolean).length;
        const errorObj = prefError;
        if (numChecked <= checkLimit && numChecked > 0) {
            setPreferences({ ...preferences, [dataType]: Object.entries(checkedItems).filter(([key, value]) => value === true).map(([key]) => key) });
            (errorObj[dataType] ? delete errorObj[dataType] : {})

        }
        else {
            errorObj[dataType] = { 'message': "Please check one item" };
        }
        setPrefErrors(errorObj);

    }

    const handleSkillData = (tags, tagType) => {
        //function for adding selected skill tags into submitting form data
        console.log("skills and tags", tags, "check", checkSkillsList)
        checkSkillsList.forEach(skill => {if(Object.keys(tags).length == 0 || !(tags.map(tag => tag.id).includes(skill.id))){if(!deletedSkills.includes(skill.id) && skill.id){setDeletedSkills([...deletedSkills,skill.id])}}})
        tags.forEach(skill => {if(typeof(skill.id)!="number" && skill.id && !addedSkills.includes(skill.tag) )setAddedSkills([...addedSkills, skill.tag])})
    
        //console.log("preferences befre changing", preferences)
        setPreferences({ ...preferences, [tagType]: tags.map(tagObj => { return (tagObj['tag']) }) });
    }
    console.log("only added tags", addedSkills )
    console.log("deleted skills", deletedSkills,)
    const dateValidation = (closing_date) => {
        const today = new Date();
        const cl_date = closing_date.split('-');
        const comp_date = new Date(cl_date[1] + "/" + cl_date[2] + "/" + cl_date[0])
        const ms_per_day = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(comp_date.getFullYear(), comp_date.getMonth(), comp_date.getDate()) //given date
        const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())  //present date
        const diff = Math.floor((utc1 - utc2) / ms_per_day)
        return diff > 0;
        //console.log(age, ">=", signupAge, ":", age>=signupAge)   
    }

    const dateGeneration = (days) => {
        const ms_per_day = 1000 * 60 * 60 * 24;
        const nextDate = new Date(Date.now() + days * ms_per_day);
        const formattedDate = moment(nextDate).format('YYYY-MM-DD');
        console.log("formatted date", formattedDate)
        return formattedDate;

    }


    const checkPref = (tagType) => {
        if (preferences[tagType].length != 0) {
            if (typeof (preferences[tagType][0]) !== "string") {
                let mod_pref = preferences;
                //console.log("before mod", mod_pref)
                mod_pref[tagType] = preferences.skills.map(label => { return (label['tag'] != "") ? label['tag'] : false }).filter(Boolean);
                //console.log("modded pref", mod_pref)
                setPreferences(mod_pref);
            }
        }
    }

    //console.log("prefernces = ", preferences)
    //useEffect(() => {console.log("pref=",preferences)}, [preferences])

    function handlePreview(data) {
        //Preview box 
        checkPref("skills");

        data.last_date = data.last_date ? data.last_date : dateGeneration(30);
        //console.log("prefilled data to load into frontend", prefilleddata);
        //console.log("preferences", preferences)
        //console.log("form data", data)
        if (Object.keys(prefError).length === 0) {
            setData({ ...data, ...preferences, ...prefilleddata,'profile_picture': profile_picture });
            { preview ? console.log(finalApplicationData) : setPreview(true) }
        }
    }

    const handleEdit = ()=>{
        setDta(finalApplicationData);
        setPreview(false);
    }


    const handlePostVacancy =async() =>{
        //Application submission data
        const submissionData={
                                "company_id": USERID,
                                "company_name": (Object.keys(companyData).length) ? companyData.company_name : finalApplicationData['companyName'],
                                "emp_type": (typeof(finalApplicationData["empType"])=="object")?finalApplicationData["empType"][0]:finalApplicationData["empType"],
                                "salary": finalApplicationData["currency"] + "-" + ((finalApplicationData["salary"][1]==="")?finalApplicationData["salary"][0]:finalApplicationData["salary"].join("-")),
	                            "working_days": (typeof(finalApplicationData["workingDays"])=="object")?finalApplicationData["workingDays"][0]:finalApplicationData["workingDays"],
                                "work_style": (typeof(finalApplicationData["workStyle"])=="object")?finalApplicationData["workStyle"][0]:finalApplicationData["workStyle"],
                                "experience": (typeof(finalApplicationData["exp"])=="object")?finalApplicationData["exp"][0]:finalApplicationData["exp"],
                                "job_name": finalApplicationData['jobTitle'],
                                "job_position": finalApplicationData['poi'],
                                "location": finalApplicationData['location'],

                                "job_desc": finalApplicationData['jobDesc'],
                                
                                "requirement": finalApplicationData['jobReq'],
                                "last_date": finalApplicationData['last_date'],
                                
                                "skills": addedSkills,
                                "closed": false,
                            };
        //submissionData["salary"]=(submissionData["salary"][1]==="")?submissionData["salary"][0]:submissionData["salary"].join("-");


        const success = await callJobAPI(submissionData, dta.edit);
        console.log("succes status", success)
        console.log("successfully submitted", submissionData);
        if(success === true)
        {setSubmit(true);
            setSubmissionStatus("success");
        }
        else{
            setSubmissionStatus("failed")
        }

    }
    //useEffect(() => { if (submit === true) { navigate("../employer/review-applications") } }, [submit]); //This line is not required
     useEffect(() => {
         console.log("submission status", submissionStatus)
         if(submissionStatus ==="success" || submissionStatus ==="failed"){
                     console.log("rerouting submission status", submissionStatus)
                         setTimeout(() => {
                             navigate("../employer/review-applications")    
                         }, 2000);
     }},[submissionStatus])
    useEffect(() => {skillsAPI()}, [skill])
    useEffect(() => {callCompanyAPI()}, [])
    useEffect(() => {console.log("yep i am", preferences.skills)
        setAddedSkills(prevSkills => prevSkills.filter(skill => preferences.skills.includes(skill)));}, [preferences]);
    
    //useEffect(() => {setPreferences({ ...preferences, "skills_delete": deletedSkills })}, [deletedSkills])
    return (
        <>
            {preview ?
                <div className="job-preview-container">
                    <JobCardExpanded data={finalApplicationData} userData={{ "type": "employer" }} />
                    
                    {submissionStatus === "success" || submissionStatus==="failed"?                                  //submission status banner 
                    <div className={`submission-status-banner status-${submissionStatus}`}>
                        <p>{submissionStatus==="success"?(`Job vacancy ${(dta?.reopen)?"reopened":"posted"} successfully`):`Failed to ${(dta?.reopen)?"reopen":"post"} vacancy.Try again later`}</p>
                    </div>
                    :
                    <div className="post-vacancy-buttons">
                        {/* <Button variant="contained" color="success" onClick={() => setPreview(false)} sx={{ color: "white" }} startIcon={<EditIcon />}>
                            <p>Edit</p>
                        </Button> */}
                        <button className='continue-btn post-vacancy-edit-btn' onClick={handleEdit} >
                            <EditIcon /> Edit 
                        </button>
                        {/* <Button variant="contained" onClick={handlePostVacancy} sx={{ color: submit ? "gray" : "white" }} startIcon={submit ? <DoneIcon /> : <MailIcon />}>
                            <p>{submit ? "Posted" : "Post Vacancy"}</p>
                        </Button> */}
                        <button className='continue-btn post-vacancy-confirm-btn' onClick={handlePostVacancy}>
                                {submit ? <DoneIcon /> : <MailIcon />} {submissionStatus === "processing" ? "Posting.." : (submit ? "Posted" : (dta?.reopen)?"Reopen":"Post Vacancy")}
                        </button>
                    </div>
                    }
                </div>
                :
                <div className="create-job-vacancy-container">

                    {/*react hook form used for accurate validation */}

                    <form noValidate onSubmit={handleSubmit(handlePreview)}>
                        <div className="create-job-vacancy-header">

                            <div className='create-job-vacancy-div1'>

                                <h1 className='create-job-vacancy-h1'>
                                    <div className="back-buton">
                                        <Link to="../employer/review-applications" state={locating.state}>
                                            <BackBtn />
                                        </Link>
                                    </div>
                                    <CreateFormTextFields inputPlaceholder="Title" hparam="50px" fontsz="1.875rem" defaultValue={dta.jobTitle || ""} {...register("jobTitle", { required: "Job title is required", })} />
                                </h1>
                                <p className='error-message' style={{paddingLeft:'4px'}}>{errors.jobTitle?.message}</p>
                                <p className='create-job-vacancy-company-name-p'>{Object.keys(companyData).length ? companyData.company_name : ""}</p>


                            </div>
                            <div className='create-job-vacancy-div2'>
                                <div className='create-job-vacancy-img-container'>
                                    {profile_picture ? <img src={profile_picture} alt="" /> : <></>}
                                </div>

                            </div>
                        </div>
                        <hr className="separator" />

                        <div className="create-job-vacancy-body">

                            <div className="create-job-vacancy-details">

                                <div className='detail-divs'>
                                <span className='details-header'>Position of Interest:</span>
                                    <div className='option-divs'>
                                        <Autocomplete
                                            disablePortal
                                            options={poisList}
                                            value={{ "position": poi }}
                                            inputValue={poi}
                                            getOptionLabel={(option) => option["position"]}
                                            isOptionEqualToValue={() => poisList.some(e => e["position"] === poi)}
                                            onInputChange={(event, newInputValue) => {
                                                SetPOI(newInputValue);
                                            }}
                                            renderInput={(params) => <TextField
                                                className="autocomplete-poi-textbox"
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                }}
                                                onChange={e => changeFn(e.target.value)}
                                                variant="standard"
                                                sx={{
                                                    boxSizing: 'content-box',
                                                    backgroundColor: "#D9D9D9",
                                                    width: "fit-content",
                                                    minWidth: "230px",
                                                    height: "30px",
                                                    paddingY:'.05rem',
                                                    paddingX: "5px",
                                                    borderRadius: "7px",
                                                    '.MuiInputBase-input': { fontFamily: "Inter-regular", fontSize: "15px"},
                                                }}
                                                {...register("poi", { required: "Field is required", })}
                                            />}

                                        />
                                        <p className="error-message vacancy-form-error" >{errors.poi?.message}</p>

                                    </div>
                                </div>
                                <div className="detail-divs detail-divs-multiple">
                                    <span className='details-header'>Location:</span>
                                    <div className='option-divs'>
                                    <GoogleLocationSearch data={{ heading: "preferred job locations", inputPlaceholder: "Kerala", isLocation: true }}
                                            changeFn={handleChangeLocation}
                                            locationValue={location}
                                            value={googleLocationAutoField}
                                            updateValue={setGoogleAutoField}
                                            use={"vacancy"}
                                            textFieldType="standard"
                                            disUnderline={true}
                                            textBgColor="#D9D9D9"
                                            textPad="5px"
                                            bordRad="7px"
                                            fntFam="Inter-regular"
                                            fntSize="15px"
                                            {...register("location", { required: "Location is required", })}
                                        />
                                    
                                        <p className="error-message  vacancy-form-error">{errors.location?.message}</p>
                                    </div>
                                </div>
                                <div className="detail-divs detail-divs-multiple">
                                    <p><span className='details-header'>Employment type:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions options={["Full-time", "Internship", "Temporary"]} preselected={preferences.empType || null} dataType="empType" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message  vacancy-form-error vacancy-form-error-multiple-options">{prefError.empType?.message}</p>
                                    </div>
                                </div>
                                <div className="detail-divs detail-divs-multiple">
                                    <p><span className='details-header'>Experience:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions options={["Fresher", "1-5 years", "5-10 years", "10+ years"]} preselected={preferences.exp || null} dataType="exp" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message  vacancy-form-error vacancy-form-error-multiple-options">{prefError.exp?.message}</p>
                                    </div>
                                </div>

                                <div className="detail-divs detail-divs-multiple">
                                    <p><span className='details-header'>Work style:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions options={["Hybrid", "Work from home", "Onsite"]} preselected={preferences.workStyle || null} dataType="workStyle" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message   vacancy-form-error vacancy-form-error-multiple-options">{prefError.workStyle?.message}</p>
                                    </div>
                                </div>
                                <div className="detail-divs detail-divs-multiple">
                                    <p><span className='details-header'>Working days:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions options={["Monday-Friday", "Monday-Saturday"]} preselected={preferences.workingDays || null} dataType="workingDays" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message  vacancy-form-error vacancy-form-error-multiple-options">{prefError.workingDays?.message}</p>
                                    </div>
                                </div>
                                <div className="skill-divs">
                                    <p><span>Skills:</span></p>
                                    <div className='create-job-skill-field'>
                                    <AddTags availableDomains={skillsList} value={skill} tags={skills} tagType={"skills"} deleteFn={handleDeleteSkill} changeFn={handleChangeSkill} updateFn={handleSkill} onChange={handleSkillData} data={{inputPlaceholder: "HTML", isLocation: false }} />
                                    </div>
                                </div>
                                <div className='salary-div'>
                                    <p><span className={`details-header${errors.salary ? "-error" : ""/*console.log("salary erros", errors.salary)*/}`}>Salary:</span></p>
                                    <div className='option-divs'>
                                        <div className="salary-fields">
                                            <CreateFormTextFields inputPlaceholder="Title" wparam="80px" fontsz="14px" select={true} defaultValue={dta.currency || "RS"} items={['RS', 'DLR', 'YEN']} {...register("currency", { required: "Currency is required" })} />

                                            <CreateFormTextFields inputPlaceholder="Lower limit" wparam="120px"
                                                defaultValue={dta.salary ? dta.salary[0] || null : null}
                                                {...register("salary.0", {
                                                    required: "Salary range is required",
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Only numbers allowed"
                                                    },
                                                    validate: (val) => val > salary_threshold || `Enter salary greater than ${salary_threshold}`,
                                                })} />
                                            <span>to</span>
                                            <CreateFormTextFields disabled={!isUpperLimitEnabled/*watch("salary.0") != null ? (watch("salary.0").length ? false : true) : true */} inputPlaceholder="Upper limit" wparam="120px"
                                                defaultValue={dta.salary ? dta.salary[1] || null : null}
                                                {...register("salary.1", {

                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Only numbers allowed"
                                                    },
                                                    validate: (val) => {
                                                        const lowerLimit = watch("salary.0");

                                                        // Check if the value is provided
                                                        if (val) {
                                                            // Check if the value is greater than the lower limit or if it's empty
                                                            if (Number(val) > Number(lowerLimit) || val.length === 0) {
                                                                return true;
                                                            } else {
                                                                return "Enter salary greater than lower limit";
                                                            }
                                                        } else {
                                                            // Allow empty values if needed
                                                            return true;
                                                        }
                                                    },
                                                })} />
                                        </div>
                                        <p className="error-message vacancy-form-error">{errors.salary ? errors.salary[0]?.message || errors.salary[1]?.message || errors.currency?.message || "" : errors.currency?.message || ""}</p>
                                    </div>
                                </div>

                                <div className='last-date-div'>
                                    <p><span className='details-header'>Closing date:</span></p>
                                    <div className='option-divs'>
                                        <CreateFormTextFields inputPlaceholder="Title" wparam="200px"
                                            defaultValue={dta.last_date ? (dta.last_date || null) : null}
                                            type="date"
                                            error={'last_date' in errors}
                                            {...register("last_date",
                                                {
                                                    validate: (val) => { if (val != null && val.length != 0) return (dateValidation(val) || "Please enter a future date") },
                                                })} />
                                        {watch('last_date') == null || watch('last_date').length == 0 ? (<p className='helper-text'>&nbsp;&nbsp;default value is 30 days after post date</p>) : <></>}
                                        <p className="error-message">{errors.last_date?.message}</p>
                                    </div>
                                </div>

                                <div className="create-job-vacancy-description-div">
                                    <p><span>Job description:</span></p>
                                    <div className="create-job-desc-field"><CreateFormTextFields inputPlaceholder="Enter job details" fontsz="14px" wparam="100%" defaultValue={dta.jobDesc || ""} multipleLine={true} minrows={8}  /*justify={true}*/ {...register("jobDesc", { required: "Field required", })} /></div>
                                    <p className="create-job-desc-field error-message">{errors.jobDesc?.message}</p>
                                </div>

                                <div className="create-job-vacancy-description-div">
                                    <p><span>Job requirements:</span></p>
                                    <div className="create-job-desc-field"><CreateFormTextFields inputPlaceholder="Enter criteria" fontsz="14px" wparam="100%" defaultValue={dta.jobReq || ""} multipleLine={true} minrows={8} /*justify={true}*/ {...register("jobReq", { required: "Field required", })} /></div>
                                    <p className="create-job-desc-field error-message">{errors.jobReq?.message}</p>
                                </div>

                            </div>
                        </div>


                        <div className="post-button">
                            {/* <Button variant="contained" color="success" type="submit" sx={{ color: "white", borderRadius: "7px" }} startIcon={<RemoveRedEyeOutlinedIcon />}>
                                <p>Preview and Post vacancy</p>
                            </Button> */}
                            <button className='continue-btn post-vacancy-btn' >
                                <RemoveRedEyeOutlinedIcon/>  {(dta?.reopen)?"Preview and Reopen Post":"Preview and Post Vacancy"}
                            </button>
                        </div>

                    </form>


                </div>
            }
        </>
    )
}