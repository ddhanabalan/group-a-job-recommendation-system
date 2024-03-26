import './Filter.css';
import { useState } from 'react';
import AddTags from '../AddTags/AddTags';
import MultipleOptions from '../MultipleOptions/MultipleOptions';
import filtersvg from '../../images/filter.svg';
import { v4 as uuid } from 'uuid';
export default function Filter({ title }) {
    const [googleLocationAutoField, SetGoogleLocationAutoField] = useState(null);
    const [domain, SetDomain] = useState('');
    const [domains, SetDomains] = useState([{ tag: "software", id: uuid() }, { tag: "data science", id: uuid() }]);
    const [location, SetLocation] = useState('');
    const [locations, SetLocations] = useState([{ tag: "Bangalore", id: uuid() }, { tag: "Chennai", id: uuid() }]);
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
    return (
        <div className="FilterContainer">
            <div className="heading">
                <img src={filtersvg} alt="filter" />
                <span>{title}</span>
            </div>
            <AddTags value={domain} tags={domains} deleteFn={handleDeleteDomain} changeFn={handleChangeDomain} updateFn={handleDomain} data={{ heading: "interested domains", inputPlaceholder: "Marketing", isLocation: false }} />
            <MultipleOptions heading={"job location"} options={["On-site", "Hybrid", "Work from home"]} />
            <MultipleOptions heading={"working days"} options={["Monday - Friday", "Monday - Saturday"]} />
            <AddTags locationFieldAutoValue={googleLocationAutoField} updatelocationFieldAutoValue={setGoogleAutoField} value={location} tags={locations} deleteFn={handleDeleteLocation} changeFn={handleChangeLocation} updateFn={handleLocation} data={{ heading: "preferred job locations", inputPlaceholder: "Kerala", isLocation: true }} />
            <MultipleOptions heading={"Experience"} options={["Fresher", "1-5 years", "5-10 years", "10+ years"]} />
            <MultipleOptions heading={"Employment Type"} options={["Full-time", "Internship", "Temporary"]} />
        </div>
    )
}