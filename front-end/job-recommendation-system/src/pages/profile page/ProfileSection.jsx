import { useState,useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';
import getStorage from '../../storage/storage';
import { userAPI } from '../../api/axios';
import FeatureBox from '../../components/FeatureBox/FeatureBox';
import FeatureBoxMiddlePane from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePane';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import AddSkills from '../../components/AddSkills/AddSkills';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import './ProfileSection.css';
export default function ProfileSection({ data }) {
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const updateEditStatus = (value) => {
        SetIsNotEditing(value)
    }
    const redirectFn = (data) => {
        console.log(data)
        SetnewData(data)
    }
    const params = useParams();
    const user = params.username;
    console.log(user)
    const callAPI = async () => {
        try {
            const response = (user === undefined) ?
                await userAPI.get(`/seeker/profile`,{
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }):
                await userAPI.get(`/seeker/profile/${user}`);
            redirectFn(response.data)
        } catch (e) {
            console.log(e)

            alert(e.message)
        }
    }
    useEffect(() => callAPI, []);
    const subForm = async (data) => {
        SetnewData(data)
        console.log( data);
        // try {
        //     await axios.post('/seeker/register', newdata, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });

        // } catch (e) {
        //     console.log(e)
        //     alert(e.message)
        // }
    }
  
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
    const profileBodyClass = `profile-body-section ${isBodyBlur && 'body-blur'}`

    return (
        <>
            {data ?
                <div id="profile-page">
                    <ProfileHead data={newData} blurFn={blurBody} subForm={subForm} isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
                    <NavigationBar active="profile" />
                    <div className={profileBodyClass}>
                        <div className="profile-pane profile-left-pane">
                            {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                            <ContactCard data={{
                                title: "Contacts and Profiles", addIcon: false, editIcon: true
                            }} contactData={newData} subForm={subForm} />
                        </div>
                        <div className="profile-pane profile-middle-pane">
                            <FeatureBoxMiddlePane data={{ title: "Professional Experience", edit: true, isLanguage: false }}
                                childData={[]} />
                            <FeatureBoxMiddlePane data={{ title: "Formal Education", edit: true, isLanguage: false }}
                                childData={[
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 },
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 }
                                ]} />
                            <FeatureBoxMiddlePane data={{ title: "Licenses and certifications ", edit: true, isLanguage: false }}
                                childData={[
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 },
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 }
                                ]} />
                            {/* <FeatureBoxMiddlePane data={{ title: "Skills",editIcon:false }} /> */}
                            <AddSkills id="profile-section-skills" value={skill} tags={skills} deleteFn={handleDeleteSkill} changeFn={handleChangeSkill} updateFn={handleSkill} data={{ title: "Skills", inputPlaceholder: "HTML" }} />
                            <FeatureBoxMiddlePane data={{ title: "Languages", editIcon: true, isLanguage: true }}
                                childData={[
                                    { language: "English", language_proficiency: "Professional working proficiency", id: uuid() },
                                    { language: "English", language_proficiency: "Professional working proficiency", id: uuid() }
                                ]} />
                            <div className="spacer-div" ></div>
                        </div>
                        <div className="profile-pane profile-right-pane">
                            <FeatureBox data={{ title: "Achievements", addIcon: true, editIcon: true }} />
                        </div>
                    </div>
                </div>
                :
                <LoaderAnimation />}
        </>
    )
}