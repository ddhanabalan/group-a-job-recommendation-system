import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { userAPI } from '../../api/axios';
import getStorage from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PublicIcon from '@mui/icons-material/Public';
import { utilsAPI } from '../../api/axios';
import { Autocomplete } from '@mui/material';
import './DetailsCard.css';
// import '../FeatureBox/FeatureBox.css';
// import './ContactCard.css';
export default function ContactCard({ access, data, companyInfo, reloadFn, showSuccessMsg, showFailMsg }) {
    const RETRY_DELAY = 500;
    const [isNotEditing, SetIsNotEditing] = useState(true);
    const { register, formState: { errors }, getValues, trigger, setError, setValue } = useForm({});

    const backupCountries = [{ "country": 'India' }, { "country": 'USA' }, { "country": "Germany" }, { "country": 'Australia' }, { 'country': "Japan" }]
    const [countries, setCountries] = useState([])

    const [fetchingErrors, setFetchingErrors] = useState({ "countries": false });
    const [userHeadquarters, setUserHeadquarters] = useState({ "country": data.headquarters, 'industry': data.industry })
    const backupIndustries = [{ "industry": 'Automobile' }, { "industry": 'Agriculture' }, { "industry": 'Medical' }, { "industry": 'Defense' }, { "industry": 'Aeronautical' }, { "industry": 'Chemical' }]
    const [industries, setIndustries] = useState([])
    const [userIndustry, setUserIndustry] = useState({ industry: companyInfo.industry || "" })

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

    const fetchIndustries = async () => {
        try {
            const r = await utilsAPI.get('api/v1/industry/');
            if (r.data.length) {
                setIndustries(r.data);
                setFetchingErrors({ ...fetchingErrors, "industries": false });
            }
            else {
                setIndustries(backupIndustries);
                setFetchingErrors({ ...fetchingErrors, "industries": true });
            }
        }
        catch (e) {
            console.log("industry fetch failed", e);
            //alert("industries not fetched");
            setIndustries(backupIndustries);
            setFetchingErrors({ ...fetchingErrors, "industries": true });
        }
    }

    async function updateContact(data) {
        SetIsNotEditing(true)
        console.log(data)
        try {
            const response = await userAPI.put('/recruiter/details', data,
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );
            response.request.status === 200 && showSuccessMsg()
            reloadFn()
        } catch (e) {
            console.log(e)
            showFailMsg()
        }

    }
    const [shouldSubmit, setShouldSubmit] = useState(true)
    const onTrigger = async () => {
        const result = await trigger(["website", "contact_email"])
        result ? setShouldSubmit(true) : setShouldSubmit(false)
    }
    const generateDelay = (delay, callFn, value = null) => {
        setTimeout(() => {
            value ? callFn(value) : callFn()
        }, delay);
    }
    const parallelRetryFn = (delay) => {
        setTimeout(() => {
            if (fetchingErrors.industries) fetchIndustries();
            if (fetchingErrors.countries) fetchCountries();
        }, delay);
        console.log(delay, " ms over")
        return () => clearInterval(parallelRetryFn);
    }

    useEffect(() => {
        fetchCountries()
        fetchIndustries()
        setValue('headquarters', data.headquarters)
    }, [])
    useEffect(() => {
        console.log("fetching errors", fetchingErrors, industries, countries)
        if (Object.keys(fetchingErrors).some((e) => fetchingErrors[e] === true)) parallelRetryFn(RETRY_DELAY);

    }, [fetchingErrors])

    return (
        <form className="feature-box detail-box" >
            < h4 className="feature-title" > {data.title}</h4 >
            <Stack direction="row" spacing={0} className='feature-actions'>
                {access !== "viewOnly" && (isNotEditing ? [data.editIcon] &&
                    <IconButton aria-label="edit" onClick={() => SetIsNotEditing(false)}>
                        <EditIcon />
                    </IconButton> :
                    <IconButton aria-label="check" onClick={() => {
                        if (shouldSubmit) {
                            SetIsNotEditing(false)
                            const data = getValues();
                            updateContact(data)
                        }

                    }}>
                        <CheckRoundedIcon />
                    </IconButton>)}
            </Stack>
            {
                isNotEditing ?
                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="industry" disabled>
                                    <FactoryRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Industry</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.industry ? companyInfo.industry : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>

                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="company size" disabled>
                                    <GroupsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Company size</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.company_size ? companyInfo.company_size : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                        {/* <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="headquarters" disabled>
                                    <LocationCityRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Headquarters</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.headquarters ? companyInfo.headquarters : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack> */}
                        {/* <Stack direction="row" spacing={1} className='contact-medium detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="specialities" disabled>
                                    <StarsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Specialities</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.specialities ? companyInfo.specialities : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack> */}
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="locations" disabled>
                                    <AddLocationAltRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Locations</p>
                            </div>
                            <p className="contact-p details-p">{companyInfo.locations ? companyInfo.locations : <span className='data-not-present-handle'>not linked</span>}</p>
                        </Stack>
                    </Stack>

                    :

                    <Stack direction="column" spacing={1} className='contact-cards'>
                        <Stack direction="column" spacing={1} className='detail-medium' sx={{alignItems: "flex-start"}}>
                            <div className='detail-identifier'>
                                <IconButton aria-label="industry" disabled>
                                    <FactoryRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Industry</p>
                            </div>

                            <Autocomplete
                                disablePortal
                                className='details-card-industry'
                                options={industries}
                                placeholder='Automobile'
                                value={userIndustry}
                                getOptionLabel={(option) => option["industry"]}
                                componentsProps={{
                                    popper: {
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                enabled: false
                                            }
                                        ]
                                    }
                                }}
                                isOptionEqualToValue={(option) => industries.some(e => e["industry"] === option)}
                                onChange={(event, newInputValue) => {
                                    setUserIndustry(newInputValue)
                                    setValue('industry', newInputValue["industry"])
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        // className="personal-details-input profile-edit-bio contact-card-textfield"
                                        {...params}
                                        placeholder='Automobile'
                                        sx={{ padding: '.5rem'}}
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                        }}

                                        variant="outlined"

                                        {...register("industry", { required: "Field is required", })}
                                    />}
                            />
                        </Stack>

                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="company size" disabled>
                                    <GroupsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Company size</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.company_size}
                                placeholder='10000+'
                                error={'company_size' in errors}
                                {...register("company_size", {
                                    pattern: {
                                        value: /^\d+$/,
                                        message: "only numbers allowed"
                                    },
                                    onChange: onTrigger
                                })}>
                            </TextField>
                        </Stack>
                        {/* <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="headquarters" disabled>
                                    <LocationCityRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Headquarters</p>
                            </div>
                            <Autocomplete
                                disablePortal
                                options={countries}
                                value={userHeadquarters}
                                defaultValue={{ "country": data.country }}
                                getOptionLabel={(option) => option["country"]}
                                isOptionEqualToValue={(option, value) => value["country"] === option["country"]}

                                onChange={(event, newInputValue) => {
                                    setUserHeadquarters(newInputValue)
                                    setValue('headquarters', newInputValue["country"])
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
                                    {...register("headquarters") }
                                />}
                            />
                        </Stack> */}
                        {/* <Stack direction="row" spacing={1} className='contact-medium detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="email" disabled>
                                    <StarsRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Specialities</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.specialities}
                                error={'specialities' in errors}
                                {...register("specialities")}>
                            </TextField>
                        </Stack> */}
                        <Stack direction="row" spacing={1} className='detail-medium'>
                            <div className='detail-identifier'>
                                <IconButton aria-label="locations" disabled>
                                    <AddLocationAltRoundedIcon />
                                </IconButton>
                                <p className='stat-title'>Locations</p>
                            </div>
                            <TextField className="personal-details-input profile-edit-bio contact-card-textfield" variant="outlined"
                                defaultValue={companyInfo.locations}
                                placeholder='8+'
                                error={'locations' in errors}
                                {...register("locations",
                                    {
                                        pattern: {
                                            value: /^\d+$/,
                                            message: "only numbers allowed"
                                        },
                                        onChange: onTrigger
                                    })}>
                            </TextField>
                        </Stack>
                    </Stack>

            }
        </form>
    )
}