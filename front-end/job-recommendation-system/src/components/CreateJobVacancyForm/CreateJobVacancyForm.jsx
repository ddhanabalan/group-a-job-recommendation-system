import './CreateJobVacancyForm.css';
import { v4 as uuid } from 'uuid';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BackBtn from '../BackBtn/BackBtn';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import GoogleLocationSearch from '../GoogleLocationSearch/GoogleLocationSearch';
import CreateFormTextFields from './CreateFormTextFields';
import MultipleOptions from '../MultipleOptions/MultipleOptions';
import AddTags from '../AddTags/AddTags';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import JobDesciptionForm from '../JobDescription/JobDesciption';
import { jobAPI } from '../../api/axios';

export default function JobVacancyForm({ data = {} }) {
    const prefilleddata = data;
    const locating = useLocation();
    const navigate = useNavigate();
    const dta = (locating.state ? locating.state : {})
    const { register, formState: { errors }, handleSubmit, setValue} = useForm({ mode: 'onTouched' });
    
    const [submit, setSubmit] = useState(false);
    const [prefError, setPrefErrors] = useState({});
    //const [tag_state,setTagState] = useState(false);
    const [googleLocationAutoField, SetGoogleLocationAutoField] = useState(dta.location || 'kerala');
    setValue("location",googleLocationAutoField);
    const [location, SetLocation] = useState(dta.location || 'kerala');
    const [skill, SetSkill] = useState('');
    const [tag, setTag] = useState('');
    const [skills, SetSkills] = useState(dta.skills ? dta.skills.map(label => ({ tag: label, id: uuid() })) : []);
    const [tags, setTags] = useState(dta.tags ? dta.tags.map(label => ({ tag: label, id: uuid() })) : []);
    const [preferences, setPreferences] = useState({"skills": dta.skills,"tags": dta.tags, "empType": dta.empType, "exp": dta.exp});
    const [preview, setPreview] = useState(false);
    const [finalApplicationData, setData] = useState({});

    const redirectFn = (response) => {
        console.log(response.data)
    }
    const callJobAPI = async (rec_data) => {
        
        try {
            const response = await jobAPI.post('/job_vacancy/', rec_data, {
            headers:{
                'Content-Type': 'application/json'
            }         
            }
            );
            redirectFn(response)
        } catch (e) {
            console.log(e)
            
            alert(e.message)
        }
    }


    const setGoogleAutoField = (v) => {
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

    const handleDeleteTag = (id) => {
        //accepts id of additional tag and delete them from the array 
        setTags(prevTags =>
            prevTags.filter(e => e.id !== id))
    };

    const handleChangeTag = (v) => {
        //stores the Additional Tag values from the input field as user types
        setTag(v)
    };

    const handleTag = (n) => {
        //accepts a new Additional Tag value from the input field and updates the tags array to display the newly added tag and resets the input box value when user clicks the add button
        if (n !== "") {
            setTags([...tags, { tag: n, id: uuid() }]);
            setTag('')
        }
    };



    const handleChangeLocation = (v) => {
        //stores the Location value from the input field as user types
        SetLocation(v)
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
            errorObj[dataType] = { 'message': "please check one item" };
        }
        setPrefErrors(errorObj);

    }

    const handleSkillData = (tags, tagType) => {
        //function for adding selected skill tags into submitting form data
        setPreferences({ ...preferences, [tagType]: tags.map(tagObj => { return (tagObj['tag']) }) });
        
    }
    
    //console.log("prefernces = ", preferences)
    //useEffect(() => {console.log("pref=",preferences)}, [preferences])

    function handlePreview(data) {
        //Preview box 
        
        if (Object.keys(prefError).length === 0) {
            setData({ ...data, ...preferences, ...prefilleddata });
            { preview ? console.log(finalApplicationData) : setPreview(true) }
        }
    }
    

    function handlePostVacancy() {
        //Application submission data
        const submissionData={
                                "company_id": 23,
                                "job_name": finalApplicationData['jobTitle'],
                                "job_desc": finalApplicationData['jobDesc'],
                                "company_name": finalApplicationData['companyName'],
                                "requirement": finalApplicationData['jobReq'],
                                "salary": (finalApplicationData["salary"][1]==="")?finalApplicationData["salary"][0]:finalApplicationData["salary"].join("-"),
                                "experience": finalApplicationData["exp"][0],
                                "job_position": finalApplicationData['jobTitle'],
                                "location": finalApplicationData['location'],
                                "emp_type": finalApplicationData['empType'][0],
                                "last_date": "2222-12-12",
                                "tags": finalApplicationData["tags"],
                                "skill": finalApplicationData["skills"],
                            };
        //submissionData["salary"]=(submissionData["salary"][1]==="")?submissionData["salary"][0]:submissionData["salary"].join("-");
        
        
        callJobAPI(submissionData);
        console.log("successfully submitted", submissionData);
        setSubmit(true);

    }
    useEffect(() => { if (submit === true) { navigate("../employer/review-applications") } }, [submit]);



    return (
        <>
            {preview ?
                <div className="job-preview-container">
                    <JobDesciptionForm data={finalApplicationData} userData={{"type":"employer"}} />
                    <div className="post-vacancy-buttons">
                        <Button variant="contained" color="success" onClick={()=>setPreview(false)} sx={{color: "white" }} startIcon={<EditIcon />}>
                            <p>Edit</p>
                        </Button>
                        <Button variant="contained" onClick={handlePostVacancy} sx={{ color: submit ? "gray" : "white" }} startIcon={submit ? <DoneIcon /> : <MailIcon />}>
                            <p>{submit ? "Posted" : "Post Vacancy"}</p>
                        </Button>
                    </div>
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
                                            <BackBtn/>
                                        </Link>
                                    </div>
                                    <CreateFormTextFields inputPlaceholder="Title" hparam="50px" fontsz="1.875rem" defaultValue={dta.jobTitle || ""} {...register("jobTitle", { required: "Job title is required", })} />
                                </h1>
                                <p className='error-message'>{errors.jobTitle?.message}</p>
                                <p className='create-job-vacancy-company-name-p'>{data.companyName}</p>


                            </div>
                            <div className='create-job-vacancy-div2'>
                                <div className='create-job-vacancy-img-container'>
                                    {/* <img src="" alt="" /> */}
                                </div>

                            </div>
                        </div>
                        <hr className="separator" />

                        <div className="create-job-vacancy-body">
                            <div className="create-job-vacancy-details">
                                <div className="detail-divs">
                                    <span className='details-header'>Location:</span>
                                    <div className='option-divs'>
                                        <GoogleLocationSearch data={{ heading: "preferred job locations", inputPlaceholder: "Kerala", isLocation: true }}
                                            changeFn={handleChangeLocation}
                                            locationValue={location}
                                            value={googleLocationAutoField}
                                            updateValue={setGoogleAutoField}
                                            textFieldType="standard"
                                            disUnderline={true}
                                            textBgColor="#D9D9D9"
                                            textPad="5px"
                                            bordRad="7px"
                                            fntFam="Inter-regular"
                                            fntSize="15px"
                                            {...register("location", { required: "Location is required", })}
                                        />
                                        <p className="error-message" style={{ position: 'relative', left: "15px" }}>{errors.location?.message}</p>
                                    </div>
                                </div>
                                <div className="detail-divs">
                                    <p><span className='details-header'>Employment type:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions fSize="14px" margY="0px" options={["Full-time", "Internship", "Temporary"]} preselected={dta.empType || null} dataType="empType" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message">{prefError.empType?.message}</p>
                                    </div>
                                </div>
                                <div className="detail-divs">
                                    <p><span className='details-header'>Experience:</span></p>
                                    <div className="option-divs">
                                        <MultipleOptions fSize="14px" margY="0px" options={["Fresher", "1-5 years", "5-10 years", "10+ years"]} preselected={dta.exp || null} dataType="exp" checkLimit={1} onChange={handleCheckboxChange} />
                                        <p className="error-message">{prefError.exp?.message}</p>
                                    </div>
                                </div>
                                <div className="skill-divs">
                                    <p><span>Skills</span></p>
                                    <div className='create-job-skill-field'>
                                        <AddTags value={skill} tags={skills} deleteFn={handleDeleteSkill} changeFn={handleChangeSkill} updateFn={handleSkill} onChange={handleSkillData} tagType="skills" data={{ heading: "", inputPlaceholder: "Marketing", isLocation: false }} fSize="14px" />
                                    </div>
                                </div>
                                <div className='salary-div'>
                                    <p><span className='details-header'>Salary:</span></p>
                                    <div className='option-div'>
                                        <div className="salary-fields">
                                            <CreateFormTextFields inputPlaceholder="Title" wparam="80px" fontsz="14px" select={true} defaultValue="RS" items={['RS', 'DLR', 'YEN']} {...register("currency", { required: "Currency is required" })} />

                                            <CreateFormTextFields inputPlaceholder="Title" wparam="100px"
                                                defaultValue={dta.salary ? dta.salary[0] || null : null}
                                                {...register("salary.0", {
                                                    required: "Salary range is required",
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Only numbers allowed"
                                                    }
                                                })} />
                                            <span>to</span>
                                            <CreateFormTextFields inputPlaceholder="Title" wparam="100px"
                                                defaultValue={dta.salary ? dta.salary[1] || null : null}
                                                {...register("salary.1", {
                
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Only numbers allowed"
                                                    }
                                                })} />
                                        </div>
                                        <p className="error-message">{errors.salary ? errors.salary[0]?.message || errors.salary[1]?.message || errors.currency?.message || "" : errors.currency?.message || ""}</p>
                                    </div>
                                </div>
                                <div className="create-job-vacancy-description-div">
                                    <p><span>Job Description</span></p>
                                    <div className="create-job-desc-field"><CreateFormTextFields inputPlaceholder="Title" fontsz="14px" wparam="100%" defaultValue={dta.jobDesc || ""} multipleLine={true} minrows={8} {...register("jobDesc", { required: "Field required", })} /></div>
                                    <p className="create-job-desc-field error-message">{errors.jobDesc?.message}</p>
                                </div>

                                <div className="create-job-vacancy-description-div">
                                    <p><span>Job Requirements</span></p>
                                    <div className="create-job-desc-field"><CreateFormTextFields inputPlaceholder="Title" fontsz="14px" wparam="100%" defaultValue={dta.jobReq || ""} multipleLine={true} minrows={8} {...register("jobReq", { required: "Field required", })} /></div>
                                    <p className="create-job-desc-field error-message">{errors.jobReq?.message}</p>
                                </div>
                                <div className="skill-divs">
                                    <p><span>Tags:</span></p>
                                    <div className='create-job-skill-field'>
                                        <AddTags value={tag} tags={tags} deleteFn={handleDeleteTag} changeFn={handleChangeTag} updateFn={handleTag} onChange={handleSkillData} tagType="tags" data={{ heading: "", inputPlaceholder: "Marketing", isLocation: false }} fSize="14px" />
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="post-button">
                            <Button variant="contained" color="success" type="submit" sx={{ color: "white", borderRadius: "7px" }} startIcon={<RemoveRedEyeOutlinedIcon />}>
                                <p>Preview and Post vacancy</p>
                            </Button>
                        </div>

                    </form>


                </div>
            }
        </>
    )
}