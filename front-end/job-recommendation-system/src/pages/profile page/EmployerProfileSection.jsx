import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import getStorage from '../../storage/storage';
import authAPI from '../../api/axios';
import FeatureBox from '../../components/FeatureBox/FeatureBox';
import FeatureBoxMiddlePane from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePane';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import AddSkills from '../../components/AddSkills/AddSkills';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FeatureBoxMiddlePaneText from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneText';
import FeatureBoxMiddlePaneOpenings from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneOpenings';
import FeatureBoxMiddlePaneReview from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneReview';
import './EmployerProfileSection.css';
export default function EmployerProfileSection({ data}) {
    const redirectFn = (response) => {
        console.log(response.data)
    }
    const callAPI = async () => {
        console.log(Object.keys(getStorage("userToken")))
        try {
            const response = await authAPI.get('/me', {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            redirectFn(response)
        } catch (e) {
            console.log(e)
            
            alert(e.message)
        }
    }
    useEffect(()=>callAPI, []);
    
    const [isBodyBlur, SetIsBodyBlur] = useState(false)
    const blurBody = (state) => {
        state ? SetIsBodyBlur(true) : SetIsBodyBlur(false)
    }
    const [skill, SetSkill] = useState('');
    const [skills, SetSkills] = useState([{ tag: "software", id: uuid() }, { tag: "data science", id: uuid() }]);
    

    const handleDeleteSkill = (id) => {
        //accepts id of Domain tag and delete them from the array 
        SetSkills(prevSkills =>
            prevSkills.filter(e => e.id !== id))
    };

    const handleChangeSkill = (v) => {
        //stores the Domain value from the input field as user types
        SetSkill(v)
    };

    const handleSkill = (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        if (n !== "") {
            SetSkills([...skills, { tag: n, id: uuid() }]);
            SetSkill('')
        }
    };


    return (
        <div id="employer-profile-page">
            <ProfileHead data={data} blurFn={blurBody} />
            <NavigationBar active="employer-profile" />
            <div className="employer-profile-body-section">
                <div className="employer-profile-pane employer-profile-left-pane">
                    {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                    <DetailsCard data={{
                        title: "Company Details", addIcon: false, editIcon: true
                    }} companyInfo={{ industry: "Aviation", companysize: "10000+", hq: "india", specialities: ['space', 'aviation', 'hardware', 'technology', 'robotics', 'defense'], locations: "7+" }} />

                    <ContactCard data={{
                        title: "Contacts and Profiles", addIcon: false, editIcon: true
                    }} contactInfo={{website: "www.nasa.gov" }} />

                    
                </div>
                <div className="employer-profile-pane employer-profile-middle-pane">
                    <FeatureBoxMiddlePaneText data={{title: "About", edit: false}} childData={{text: "This is for demo purpose only"}}/>
                    <FeatureBoxMiddlePaneOpenings data={{title: "Recent Job Openings", edit: false}} childData={{text: "This is for demo purpose only"}}/>
                    <FeatureBoxMiddlePaneReview data={{title: "Reviews", edit: false}} childData={{text: "This is for demo purpose only"}}/>


                    <div className="spacer-div" ></div>
                </div>
                <div className="employer-profile-pane employer-profile-right-pane">
                    <FeatureBox data={{ title: "Achievements and Rankings", addIcon: true, editIcon: true }} />
                </div>
            </div>
        </div>
    )
}