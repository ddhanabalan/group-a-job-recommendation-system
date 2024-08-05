import './JobOpeningCard.css';
import { Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { useState, useEffect } from 'react';


export default function JobOpeningCard({ data, type = null, highlighted = null, listToDescFunc = null, deleteJobFunc = null, editJobVacancyStatusFunc=null,disabled=false, invite = null, inviteJob=null }, props) {
    //opening cards show in opening page    
    console.log("data to opening card", data, invite)
    const [status, setStatus] = useState("");
    const [statusColor, setStatusColor] = useState("");
    const [cssTag, setCssTag] = useState("");
    const [preJob, setPreJob] = useState();
    
    console.log("received invite card", inviteJob);

    const checkStatus = () => {
        if (!preJob) return;
        const application_type = preJob.type.toLowerCase();
        const app_status = preJob.job_status?.toLowerCase() || preJob.invite_status.toLowerCase();
        if (application_type == "request") {
            console.log("requesting");
            if (app_status == "applied") {
                setStatus("Already applied");
                setStatusColor("yellow");
                setCssTag("reject");
            } else if (app_status == "approved") {
                setStatus("Application approved");
                setStatusColor("green");
                setCssTag("approve");
            } /*else if (preJob.job_status == "rejected") {
                setStatus("rejected");
                setStatusColor("red");
                setCssTag("reject");
            }*/
        } else {
            if (app_status == "pending") {
                setStatus("Invite sent");
                setStatusColor("orange");
                setCssTag("reject");
            } else if (app_status == "approved") {
                setStatus("Invite accepted");
                setStatusColor("green");
                setCssTag("approve");
            } /*else if (preJob.invite_status == "rejected") {
                setStatus("invite declined");
                setStatusColor("red");
                setCssTag("reject");
            }*/
        }
    };

    
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


    const dateFormatter=(date)=>{
        const r = date.split('-')
            const formattedDate = [r[2], r[1], r[0]].join('-')
            return formattedDate
    }

    useEffect(() => {
    if(inviteJob && inviteJob.length)
    {console.log("logged invite job", inviteJob[0].invite_status);
        const x = inviteJob.map(e=>e.job_status?e.job_status.toLowerCase():null);
        const r = inviteJob.map(e=>e.invite_status?e.invite_status.toLowerCase():null);
        console.log("registered invites", inviteJob, r, data.id)
    let index = 0;
    if(/*r.includes("rejected") && */ r.includes("pending"))
    {
        index = r.lastIndexOf("pending");
    }
    else if(r.includes("approved")){
        index = r.lastIndexOf("approved");
    }
    
    else if(x.includes("approved")){
        index = x.lastIndexOf("approved");
    }
    else if(x.includes("applied")){
        index = x.lastIndexOf("applied");
    }
    console.log("invite job", index)

    setPreJob(inviteJob[index])
    }}, [inviteJob])
    useEffect(() => {
        console.log("prejob set", preJob)
        if (preJob) checkStatus();
    }, [preJob]);
    useEffect(() => {
        if(data.closed && type==="invite"){
            setStatus("Closed");
            setStatusColor("red");
            setCssTag("reject");  
        }
    }, [data])
    useEffect(()=>{console.log("updated tags", data.id, status, statusColor, cssTag);
                    if(status!="")disabled(true)}, [status]);
    


    return (
        <div className={status===""?`opening-card ${highlighted ? 'highlighted' : ''}`:`opening-card disabled`}>
            {data.length != 0 ?
                <>
                    <div className='opening-card-div1'>
                        <h1 className='opening-card-h1'>{data.jobTitle}</h1>
                        <p className='opening-card-company-name-p'>{data.companyName}</p>

                        <p className='opening-card-salary'>{currencyFormatter(data.currency, data.salary[0])} {data.salary[1] ? " - " + currencyFormatter(data.currency, data.salary[1]) : ""} per month</p>
                        {data.userType == "employer"?
                                ((type && type !="invite")?
                                <div className="opening-vacancy-buttons">
                                    <Button variant="contained" disableElevation onClick={deleteJobFunc ? () => deleteJobFunc(data.id) : undefined} className="opening-delete-button" sx={{ color: '#f6cacc', backgroundColor: '#ff0000', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<DeleteOutlineIcon />}>
                                        Delete
                                    </Button>
                                    
                                    {data.closed===false?
                                    <>
                                    <Link to="../employer/job-vacancy" state={{ ...data,"last_date": dateFormatter(data.last_date), edit: true }}>
                                        <Button variant="contained" disableElevation className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<EditIcon />}>
                                            Edit
                                        </Button>
                                    </Link>
                                            <Button variant="contained" disableElevation onClick={editJobVacancyStatusFunc ? () => editJobVacancyStatusFunc({ ...data, "last_date": dateFormatter(data.last_date) }, true) : undefined} className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<LockRoundedIcon />}>
                                            Withdraw
                                    </Button>
                                    </>
                                    :
                                    <Link to="../employer/job-vacancy" state={{ ...data, last_date: null, edit: true, reopen: true }}>
                                            <Button variant="contained" disableElevation className="opening-edit-button" sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black', width: 'fit-content', paddingY: "2px", paddingX: "10px", textTransform: "none", borderRadius: 20 }} endIcon={<LockOpenRoundedIcon />}>
                                                Reopen
                                        </Button>
                                    </Link>

                                    }
                                </div>
                                :
                                ((inviteJob && status!="" && !data.closed)?
                                <div className={`job-status-div job-status-${cssTag} job-status-opening-card`}>
                                    <p>{status}</p>
                                    <div className={`skill-status ${statusColor}`}></div>
                                </div>
                                :
                                (data.closed && 
                                    <div className={`job-status-div job-status job-status-opening-card`}>
                                        <p>Closed</p>
                                    <div className={`skill-status red`}></div>
                                    </div>
                                 )
                                )
                                )
                        
                            :
                            (data.userInvited || data.type=="invite" || (preJob && preJob.type == "invite") ?
                                <div className="job-status-div job-status-reject job-status-opening-card">
                                    <p>Invite </p>
                                <div className={`skill-status ${data.invite_status?(data.invite_status==="rejected"?"red":(data.invite_status==="approved"?"green":"blue")):""}`}></div>
                                </div>
                                : <>
                                    {data.status === "rejected"/*data.userApplication?data.userApplication[0].status === "rejected":null*/ &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Rejected</p>
                                            <div className="skill-status red"></div>
                                        </div>
                                    }
                                    {data.status === "approved" &&
                                        <div className="job-status-div job-status-approve job-status-opening-card">
                                            <p>Approved</p>
                                            <div className="skill-status green"></div>
                                        </div>
                                    }
                                    {data.status === "Applied" &&
                                        <div className="job-status-div job-status-reject job-status-opening-card">
                                            <p>Applied</p>
                                            <div className="skill-status yellow"></div>
                                        </div>
                                    }
                                </>
                            )

                        }
                    </div>
                    <div className={`opening-card-div2${type === "review" ? " review" : ""}`}>
                        {(data?.closed) && type==="review" &&
                            <div className='closed-indicator'>Closed</div>
                        }
                        {type ?
                            <div className='feature-side'>
                                {data.applicationsReceived && (type != "invite") ?
                                    (data.applicationsReceived.filter(e => e.status.toLowerCase() === "applied").length ?
                                    <div className='application-indicator'>
                                        <p>{data.applicationsReceived.filter(e => e.status.toLowerCase() === "applied").length}</p>
                                    </div>
                                    :
                                    <div></div>)
                                    :
                                    <></>
                                }
                                {highlighted && status=="" &&
                                    <Tooltip title="View job description" enterDelay={500} leaveDelay={200}>
                                        <IconButton onClick={listToDescFunc} className='view-description-btn'
                                            sx={{ color: 'black', backgroundColor: '#eae9e9', border: 'solid 1px black' }}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                            :
                            <div className='card-img-container qualification-card-image  job-card-img-container'>
                                {data['profile_picture'] ? <img  src={data['profile_picture']} alt="" /> :
                                    <IconButton disabled>
                                        <CorporateFareRoundedIcon fontSize='large' />
                                    </IconButton>}
                            </div>
                        }
                        {data.application_created_at?
                        <div className="application-creation-date">
                            <p>{data.application_created_at}</p>
                        </div>
                        :
                        <></>
                        }
                    </div>

                </>
                :
                <></>
            }
        </div>
    )
}