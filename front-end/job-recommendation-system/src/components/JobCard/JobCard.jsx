import './JobCard.css';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';
import IconButton from '@mui/material/IconButton';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function JobCard({ data, id, expandView, background, profilePictureStyle, link=null, chooseSelectedId=null }) {
    console.log("job data received for job card", data)
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false)
    const chips = [data.workStyle, data.workingDays, ...(data.skills?.map(e => e.skill).slice(0, 2) || [])]

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

    const showDesc=()=>{
        if(chooseSelectedId)
        {
            chooseSelectedId(id);
        }
        expandView(data.id)
    }
    useEffect(()=> {if(redirect===true)
                        {setRedirect(false);
                        navigate(link, { replace: true });}}, [redirect])
    console.log(chips)
    return (
        
        <div className="card" id={id} onClick={() => {(link?setRedirect(true):showDesc())}} style={background}>
            <div className='card-div1'>
                
                <h1 className='card-h1'>{data.jobTitle}</h1>
                <p className='card-company-name-p'>{data.companyName}</p>
                <Stack className="card-tags" direction="row" spacing={1}>
                    {chips.map(e => {
                        if(typeof(e)==="string" && e!="")return (<Chip key={uuid()} className="card-tags-child" label={e} size='small' />)
                    })}

                </Stack>
                <p className='card-salary'>{currencyFormatter(data.currency, data.salary[0])}{data.salary[1]? <span> - {currencyFormatter(data.currency, data.salary[1])}</span>: <></>} per month</p>
            </div>
            <div className='card-div2'>
                {!data.noImage?
                <div className='card-img-container qualification-card-image' style={profilePictureStyle}>
                    {data.companyPic || data.profile_picture ? <img className='job-card-companyimg' src={data.companyPic || data.profile_picture} alt="profile" /> :
                        <IconButton disabled>
                            <CorporateFareRoundedIcon fontSize='large' />
                        </IconButton>
                    }
                </div>
                :
                <></>}
                <p className='card-time-p'>{data.postDate}</p>
            </div>
        </div>
    )
}