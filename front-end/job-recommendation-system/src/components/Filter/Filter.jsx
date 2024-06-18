import './Filter.css';
import { useState, useEffect } from 'react';
import { utilsAPI } from '../../api/axios';
import AddTags from '../AddTags/AddTags';
import MultipleOptions from '../MultipleOptions/MultipleOptions';
import filtersvg from '../../images/filter.svg';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { v4 as uuid } from 'uuid';
import Slider from '@mui/material/Slider';
export default function Filter({ title, userType=null, passFilteredDataFn = null }) {
    const SALARYMULTIPLIER= 1000;
    const DEFAULTSLIDERVALUE = 20;
    const USERCURRENCY ='₹';
    const [googleLocationAutoField, SetGoogleLocationAutoField] = useState(null);
    const [domain, SetDomain] = useState('');
    const [preferences, SetPreferences] = useState({});
    const [domains, SetDomains] = useState([]);
    const [location, SetLocation] = useState('');
    const [locations, SetLocations] = useState([{ tag: "Bangalore", id: uuid() }, { tag: "Chennai", id: uuid() }]); 
    const [salaryCutOff, SetSalaryCutOff] = useState(DEFAULTSLIDERVALUE * SALARYMULTIPLIER);
    const [sortOrder, SetSortOrder] = useState('None');
    const [skillsList, setSkillsList] = useState([])
    const skillsAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/skills?q=${domain}`)

            setSkillsList([{ "Skill Name": "" }, ...response.data])
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        skillsAPI()
    }, [domain])

    useEffect(() => {
        const tags = domains.map(e => e.tag);
        const location = locations.map(e => e.tag);
        const filterData = { tags, ...preferences, location, 'sortOrder': sortOrder, 'salaryCutOff' : salaryCutOff};
        const finalFilterData = Object.keys(filterData)
        .filter(key => filterData[key].length !== 0).reduce((acc, key) => {acc[key] = filterData[key];return acc;}, {});     
        console.log("final filter dat", finalFilterData)   
        if (passFilteredDataFn) passFilteredDataFn(finalFilterData);

    }, [domains, preferences, locations, sortOrder, salaryCutOff])
    
    const setGoogleAutoField = (v) => {
        SetGoogleLocationAutoField(v)
    }
    const handleDeleteDomain = (id) => {
        //accepts id of Domain tag and delete them from the array 
        SetDomains(prevDomains =>
            prevDomains.filter(e => e.id !== id))

    };
    const handleDeleteLocation = (id) => {
        //accepts id of  Location tag and delete them from the array 
        SetLocations(prevLocations =>
            prevLocations.filter(e => e.id !== id))
    };
    const handleChangeDomain = (v) => {
        //stores the Domain value from the input field as user types
        SetDomain(v)
    };
    const handleChangeLocation = (v) => {
        //stores the Location value from the input field as user types
        SetLocation(v)
    };
    const handleDomain = (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        if (n !== "") {
            SetDomains([...domains, { tag: n, id: uuid() }]);
            SetDomain('')
        }
    };
    const handleLocation = (n) => {
        //accepts a new location value from the input field and updates the locations array to display the newly added location and resets the input box value when user clicks the add button
        //and resets the autofilled value if the location is auto filled

        let isNotDuplicate = true;
        locations.map(e => {
            //checks if the location argument to be added to the locations array is already present
            if (e.tag === n) { isNotDuplicate = false }
        })
        if ((n !== "") && isNotDuplicate) {
            //value of n is added to the locations array if it is not an empty string and the location is not already present 
            SetLocations([...locations, { tag: n, id: uuid() }]);
            SetLocation('')
            SetGoogleLocationAutoField(null)
        }
    };

    const handleCheckboxChange = (checkedItems, checkLimit, dataType) => {
        //checks multioptions checkbox groups and passes form data only if options selected are below specified checkLimit(employment Type and experience fields)
        const numChecked = Object.values(checkedItems).filter(Boolean).length;
        //console.log("datatype:", dataType);
        SetPreferences({ ...preferences, [dataType]: Object.entries(checkedItems).filter(([key, value]) => value === true).map(([key]) => key) });
    }


    return (
        <div className="FilterContainer">
            <div className="heading">
                    <img src={filtersvg} alt="filter" />
                    <span>{title}</span>
            </div>
            {userType=="seeker"?
                <>
                <div>
                    <span>Date of Posting</span>
                    <br/>
                    <div className='sorting-options'>
                    <FormControl>
                        <RadioGroup onChange={(e,val)=>SetSortOrder(val)}>
                            <FormControlLabel value="new" control={<Radio />} label="Newest jobs first"  />
                            <FormControlLabel value="old" control={<Radio />} label="Oldest jobs first" />      
                        </RadioGroup>
                    </FormControl>
                    </div>
                    <br/>
                </div>
                </>
                :
                <></>
            }
            <AddTags availableDomains={skillsList} value={domain} tags={domains} deleteFn={handleDeleteDomain} changeFn={handleChangeDomain} updateFn={handleDomain} data={{ heading: "Interested Domains", inputPlaceholder: "Marketing", isLocation: false }} />
            <div className='domain-gap'></div>
            {userType=="employer"?
                    <>
                    <AddTags locationFieldAutoValue={googleLocationAutoField} updatelocationFieldAutoValue={setGoogleAutoField} value={location} tags={locations} deleteFn={handleDeleteLocation} changeFn={handleChangeLocation} updateFn={handleLocation} data={{ heading: "Preferred Candidate Locations", inputPlaceholder: "Kerala", isLocation: true }} />
                    </>
                    :
                    <>
                    <MultipleOptions heading={"job location"} options={["On-site", "Hybrid", "Work from home"]} dataType="loc_type" onChange={handleCheckboxChange} />
                    <MultipleOptions heading={"working days"} options={["Monday - Friday", "Monday - Saturday"]} dataType="workTime" onChange={handleCheckboxChange} />
                    <AddTags locationFieldAutoValue={googleLocationAutoField} updatelocationFieldAutoValue={setGoogleAutoField} value={location} tags={locations} deleteFn={handleDeleteLocation} changeFn={handleChangeLocation} updateFn={handleLocation} data={{ heading: "Preferred Job Locations", inputPlaceholder: "Kerala", isLocation: true }} />
                    <MultipleOptions heading={"Employment Type"} options={["Full-time", "Internship", "Temporary"]} dataType="emp_type" onChange={handleCheckboxChange} />

                    </>
            }
            <MultipleOptions heading={"Experience"} options={["Fresher", "1-5 years", "5-10 years", "10+ years"]} dataType="exp" onChange={handleCheckboxChange} />
            {userType=="seeker"?
                <>
                <span>Salary</span>
                <div className='salary-cutoff'>
                    
                    <Slider defaultValue={DEFAULTSLIDERVALUE} step={10} marks min={10} max={100} onChange={(_, value) => SetSalaryCutOff(value * SALARYMULTIPLIER)} /> 
                    <p>Above &nbsp;<span className='salary-threshold'> {USERCURRENCY} {salaryCutOff}</span></p>
                    <br/>
                </div>
                </>
                :
                <></>
            }
            {/* <Button variant="outlined" type="submit" onClick={startFilter} sx={{border: 2, borderColor: "gray",color: "black", borderRadius: 2 ,marginTop:'1rem'}} endIcon={<ArrowForwardIcon />}>
              <p>Filter</p>
            </Button> */}
        </div>
    )
}