import './JobCardExpanded.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import MailIcon from '@mui/icons-material/Mail';
import DoneIcon from '@mui/icons-material/Done';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import IconButton from '@mui/material/IconButton';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import ProcessingAnimation from '../../images/processing.json'
import { getStorage } from '../../storage/storage';

export default function JobCardExpanded({ data = [], createJobRequest = null, deleteJobRequest = null, userData, handleSub = null, handleInvite = null, type, invite = null, applicationErrors = null, processing = null }) {
    console.log("data received by form", userData, "jobdata", data, "invite", invite, type, "checkword", data.invite?.job_status !== "approved", data.invite_status?.toLowerCase() === "pending")
    

    const currencyFormatter = (received_currency, amount)=>{
        let selectedLocale;
        const currencyLocales = {
            USD: { currency: "USD", locale: "en-US", country: "United States" },
            EUR_DE: { currency: "EUR", locale: "de-DE", country: "Germany" },
            EUR_FR: { currency: "EUR", locale: "fr-FR", country: "France" },
            GBP: { currency: "GBP", locale: "en-GB", country: "United Kingdom" },
            JPY: { currency: "JPY", locale: "ja-JP", country: "Japan" },
            INR: { currency: "INR", locale: "en-IN", country: "India" },
            AUD: { currency: "AUD", locale: "en-AU", country: "Australia" },
            CAD: { currency: "CAD", locale: "en-CA", country: "Canada" },
            CHF: { currency: "CHF", locale: "de-CH", country: "Switzerland" },
            CNY: { currency: "CNY", locale: "zh-CN", country: "China" },
            RUB: { currency: "RUB", locale: "ru-RU", country: "Russia" },
            BRL: { currency: "BRL", locale: "pt-BR", country: "Brazil" },
            KRW: { currency: "KRW", locale: "ko-KR", country: "South Korea" },
            MXN: { currency: "MXN", locale: "es-MX", country: "Mexico" },
            SGD: { currency: "SGD", locale: "en-SG", country: "Singapore" },
            ZAR: { currency: "ZAR", locale: "en-ZA", country: "South Africa" },
            SEK: { currency: "SEK", locale: "sv-SE", country: "Sweden" },
            NOK: { currency: "NOK", locale: "no-NO", country: "Norway" },
            DKK: { currency: "DKK", locale: "da-DK", country: "Denmark" },
            TRY: { currency: "TRY", locale: "tr-TR", country: "Turkey" },
            THB: { currency: "THB", locale: "th-TH", country: "Thailand" },
            NZD: { currency: "NZD", locale: "en-NZ", country: "New Zealand" },
            MYR: { currency: "MYR", locale: "ms-MY", country: "Malaysia" },
            IDR: { currency: "IDR", locale: "id-ID", country: "Indonesia" },
            PHP: { currency: "PHP", locale: "fil-PH", country: "Philippines" },
            VND: { currency: "VND", locale: "vi-VN", country: "Vietnam" },
            HKD: { currency: "HKD", locale: "zh-HK", country: "Hong Kong" },
            SAR: { currency: "SAR", locale: "ar-SA", country: "Saudi Arabia" },
            AED: { currency: "AED", locale: "ar-AE", country: "United Arab Emirates" },
            EGP: { currency: "EGP", locale: "ar-EG", country: "Egypt" },
            NGN: { currency: "NGN", locale: "en-NG", country: "Nigeria" },
            COP: { currency: "COP", locale: "es-CO", country: "Colombia" },
            ARS: { currency: "ARS", locale: "es-AR", country: "Argentina" },
            CLP: { currency: "CLP", locale: "es-CL", country: "Chile" }
          };
          
    selectedLocale = currencyLocales[received_currency]
    if(received_currency=="RS"){
        selectedLocale = currencyLocales["INR"];
    }
    else if(received_currency=="DLR"){
        selectedLocale = currencyLocales["USD"];
    }
    else if(received_currency=="YEN"){
        selectedLocale = currencyLocales["CNY"];
    }
    
    const formattedAmount = Number(amount).toLocaleString(selectedLocale.locale, {
        style: 'currency',
        currency: selectedLocale.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });

      console.log("formatted currency", formattedAmount, received_currency, amount , selectedLocale)
      return formattedAmount
    }
    
    //console.log(userData.appliedJobs.includes("4"))
    const [submit, setSubmit] = useState(false);
    //const [tag_state,setTagState] = useState(false);
    const userSkills = (userData.type === "employer" || data.length) ? (null) : (data.skills?.map(skill => userData.skills.map(skilltag => skilltag.skill).includes(skill.skill) ? true : false).filter(Boolean).length)
    const [skillIndicator, setSkillIndicator] = useState(true);
    const [userJobRequest, setUserJobRequest] = useState(null);
    const [textJustify, setTextJustify] = useState(true);
    console.log("data", data)

    //console.log(userSkills)
    //function for senting applicant details from the form to company

    useEffect(() => {

        if (userData.type == "seeker" && type != "approval" && data.length != 0) {

            const appliedSeekers = data.applicationsReceived
            if (data.userApplication?.length /*((appliedSeekers).map(e => e.user_id)).includes(userData.id)*/) {
                const r = data.userApplication.filter(e => e.status !== "rejected");
                console.log("rejcted ", r, "data", data)
                if (r.length) {
                    setSubmit(true)
                    setUserJobRequest(r[0]/*((appliedSeekers).filter(e => e.user_id == userData.id))[0]*/)

                }
                else {
                    setSubmit(false);
                    setUserJobRequest(null);

                }
            }

            else {

                setSubmit(false);
                setUserJobRequest(null);
            }
        }
    }, [data]) //UNCOMMENT THIS AFTER BACKEND FIX FOR MISSING DATA IN THE RESPONSE(i.e.applicationsReceived, tags, skills) 
    //console.log(userData.id, "applied=", submit, (data.applicationsReceived)?.map(e=>e.user_id) || "", "status", ((data.applicationsReceived)?.map(e=>e.user_id)).includes(userData.id), "submit status", submit)

    function handleApplication() {
        setSubmit(true);
        createJobRequest(data.id);
        console.log("sent", userData, "for application id", data.id)

    }

    function handleStatus(status) {
        if (status == "applied") return "black";
        else if (status == "approved") return "green";
        else if (status == "rejected") return "red";
    }
    console.log("user job request received", userJobRequest, data.invite_status, submit);
    useEffect(() => setSkillIndicator(true), [data])
    return (
        <>

            <div className="job-desc-container">
                {data.length != 0 ?
                    <>
                        <div className="job-desc-header">
                            <div className='job-desc-div1'>
                                <h1 className='job-desc-h1'>{data?.jobTitle || ""}</h1>
                                <Link to={`/e/profile/${data?.companyUsername || ""}`} state={{ "purpose": "visit", "company_id": data.companyID }}>
                                    <p className='job-desc-company-name-p'>{data?.companyName || ""}</p>
                                </Link>
                                {data.tags ?
                                    <div></div>
                                    /*<Stack className="job-desc-tags" direction="row" spacing={1}>
                                        {data.tags.map(e => {
                                            return (<Chip key={typeof(e)=="string"?uuid():e.id} className="job-desc-tags-child" label={typeof(e)=="string"?e:e.tags} size='small' />)
                                        })}
    
                            </Stack>*/
                                    :
                                    <></>
                                }
                                <p className='job-desc-salary'>{currencyFormatter(data.currency, data.salary[0])}  {data.salary[1] ? "- " + currencyFormatter(data.currency, data.salary[1]) : ""} per month</p>
                            </div>
                            <div className='job-desc-div2'>
                                <div className='card-img-container qualification-card-image  job-card-img-container'>
                                    {data['profile_picture'] ? <img src={data['profile_picture']} alt="" /> :
                                        <IconButton disabled>
                                            <CorporateFareRoundedIcon fontSize='large' />
                                        </IconButton>}
                                </div>
                                <p className='job-time-p'>{data.postDate}</p>
                            </div>
                        </div>
                        <hr className="separator" />
                        <div className="job-desc-body">
                            <div className="job-details">
                                <p><span >Location:</span> {data.location}</p>
                                <p><span >Employment type: </span>{data.empType}</p>
                                <p><span >Experience:</span> {data.exp}</p>
                                <p><span >Work style:</span> {data.workStyle}</p>
                                <p><span >Working days:</span> {data.workingDays}</p>
                                <p><span >Last date:</span> {data.last_date || ""}</p>
                            </div>

                            <div className="job-description">
                                <h6>Job description</h6>
                                <pre className={`overview-formatted desc ${textJustify ? "justified-pre" : ""}`}>{data.jobDesc}</pre>
                                {/* <p className="desc">{data.jobDesc}</p> */}
                            </div>

                            <div className="job-requirements">
                                <h6>Job requirements</h6>
                                <pre className={`overview-formatted desc ${textJustify ? "justified-pre" : ""}`}>{data.jobReq}</pre>
                                {/* <p className='desc'>{data.jobReq}</p> */}
                            </div>

                            {data.skills && skillIndicator ?
                                <div className="job-skills">
                                    <h6>Skills&nbsp;{userData.type == "seeker" ? <span className='skill-counter'>You have {userSkills} out of {data.skills.length} skills required for the job</span> : <></>}</h6>
                                    {/*skill tags */}
                                    <div className='desc'><Stack className="job-desc-tags" direction="row" spacing={1}>
                                        {data.skills.map(e => {
                                            if (e != "" && e.skill != ""/* && e.skill !=""*/) {
                                                return (<div className="job-desc-skill-tags-child" key={typeof (e) == "string" ? uuid() : e.id}>
                                                    {typeof (e) == "string" ? e : e.skill} {userData.type === "employer" ?
                                                        <></>
                                                        :
                                                        (Object.keys(userData).includes('skills') ? <div className={userData.skills.map(skill => { return skill.skill.toLowerCase() }).includes(typeof (e) == "string" ? e.toLowerCase() : e.skill.toLowerCase()) ? "skill-status green" : "skill-status red"}></div> : <></>)
                                                    }
                                                </div>)
                                            }
                                            else {
                                                setSkillIndicator(false);
                                            }
                                        })}

                                    </Stack>
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </div>

                        {!processing ?
                            userData.type == "seeker" && type == "approval" && data.status && !data.closed ?
                                <>
                                    <div className='job-approval-status-label'>
                                        Status: <span className={`job-status-text color-${handleStatus(data.status.toLowerCase())}`}>{data.status}</span>
                                    </div>
                                    {data.status == "Applied" &&
                                        <button className='continue-btn invite-reject-btn' onClick={() => { deleteJobRequest(data.job_req_id) }} >
                                            Cancel Application
                                            <div class="arrow-wrapper">
                                                <div class="arrow"></div>

                                            </div>
                                        </button>
                                    }
                                    {data.status == "rejected" &&
                                        <div className="cancel-application-button">
                                            <Link to={`/seeker/openings/${data.companyUsername}/${data.id}`}>
                                                <Button variant="outlined" sx={{ color: "black", border: "1px solid #254CE1", textTransform: "none" }} endIcon={<FileOpenIcon />}>
                                                    <p>More Jobs at {data.companyName}</p>
                                                </Button>
                                            </Link>
                                        </div>
                                    }
                                </>

                                :
                                <></>
                            :
                            <></>
                        }

                        {!processing ?
                            (userData.type == "employer" || type == "approval" || invite) && !data.closed ?
                                (
                                    invite && ((data.invite && data.invite.job_status !== "approved") || (data.invite_status && data.invite_status.toLowerCase() === "pending" || false)) ?
                                        <>
                                            <div className='invite-banner'>
                                                <p>You have been invited for an interview</p>
                                            </div>
                                            <div className='invite-buttons-container'>

                                                {/* <button className='accept' onClick={()=>{handleInvite("approved", data.job_invite_id || data.invite.job_invite_id)}} >
                                        Accept
                                    </button> */}
                                                <button className='continue-btn invite-accept-btn' onClick={() => { handleInvite("approved", data.job_invite_id || data.invite.job_invite_id) }}>
                                                    Accept
                                                    <div class="arrow-wrapper">
                                                        <div class="arrow"></div>

                                                    </div>
                                                </button>
                                                {/* <button className='reject' onClick={()=>{handleInvite("rejected", data.job_invite_id || data.invite.job_invite_id)}} >
                                        Reject
                                    </button> */}
                                                <button className='continue-btn invite-reject-btn' onClick={() => { handleInvite("rejected", data.job_invite_id || data.invite.job_invite_id) }}>
                                                    Reject
                                                    <div class="arrow-wrapper">
                                                        <div class="arrow"></div>

                                                    </div>
                                                </button>

                                            </div>
                                        </>

                                        :
                                        ((data.invite?.job_status.toLowerCase() === "approved") || (data.invite_status?.toLowerCase() === "approved") ?
                                            <button className='continue-btn invite-accepted-btn' >
                                                Invite Accepted
                                            </button>
                                            :
                                            ((data.invite?.job_status.toLowerCase() === "rejected") || (data.invite_status?.toLowerCase() === "rejected") ?
                                                (userJobRequest?.status.toLowerCase() !== "applied" ?
                                                    <>

                                                        <button className='continue-btn invite-rejected-btn' >
                                                            Invite Rejected
                                                        </button>

                                                        <div className="cancel-application-button">
                                                            <Link to={`/seeker/openings/${data.companyUsername}/${data.id}`}>
                                                                <Button variant="outlined" sx={{ color: "black", border: "1px solid #254CE1", textTransform: "none" }} endIcon={<FileOpenIcon />}>
                                                                    <p>More Jobs at {data.companyName}</p>
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </>
                                                    :
                                                    <button className='continue-btn disable-apply-btn' >
                                                        {userJobRequest?.status}
                                                    </button>
                                                )
                                                :
                                                <></>
                                            )

                                        )



                                )
                                :
                                <div className="apply-button">
                                    {/* <Button variant="outlined" disabled={submit}  onClick={submit ? () => { } : handleApplication} sx={{ color: submit ? "gray" : "black", border: "1px solid #254CE1",textTransform:'none' }} startIcon={submit ? <DoneIcon /> : <MailIcon />}>
                                    <p>{submit ? "Applied" : "Apply for the job"}</p>
                                </Button> */}
                                    {
                                        (!submit && !data.closed ?
                                            (applicationErrors === true ?
                                                <div className='invite-banner'>
                                                    <p>Application window temporarily unavailable</p>
                                                </div>

                                                :
                                                <button className='continue-btn' onClick={submit ? () => { } : handleApplication} >
                                                    {data.closed ? "Application window closed" : "Apply"}
                                                    <div class="arrow-wrapper">
                                                        <div class="arrow"></div>

                                                    </div>
                                                </button>
                                            )
                                            :
                                            // <button className='continue-btn disable-apply-btn' onClick={submit ? () => { } : handleApplication} >
                                            //     {((userJobRequest && userJobRequest.status && !data.closed)?userJobRequest.status:(data.closed?"Job Vacancy closed":""))}
                                            // </button>             //if errors uncomment this and comment bottom bracket
                                            (
                                                (userJobRequest && userJobRequest.status && !data.closed) ?
                                                    <button className='continue-btn disable-apply-btn' onClick={submit ? () => { } : handleApplication} >
                                                        {userJobRequest.status}
                                                    </button>
                                                    :
                                                    (data.closed ?
                                                        <button className='continue-btn disable-apply-btn' onClick={submit ? () => { } : handleApplication} >
                                                            Job Vacancy Closed
                                                        </button>
                                                        :
                                                        <></>)
                                            )

                                        )
                                    }
                                </div>
                            :
                            <div className="processing-animation">
                                <Lottie animationData={ProcessingAnimation} loop={true} />
                            </div>
                        }
                    </>
                    :
                    <></>
                }


            </div>
        </>
    )
}