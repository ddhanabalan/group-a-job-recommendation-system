import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getStorage, setStorage } from '../../storage/storage';
import { userAPI, utilsAPI } from '../../api/axios';
import FeatureBox from '../../components/FeatureBox/FeatureBox';
import FeatureBoxMiddlePane from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePane';
import ExperienceBox from '../../components/ExperienceBox/ExperienceBox';
import LanguageBox from '../../components/LanguageBox/LanguageBox';
import LicenseBox from '../../components/LicenseBox/LicenseBox';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import AddSkills from '../../components/AddSkills/AddSkills';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import './ProfileSection.css';
export default function ProfileSection({ data }) {
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const { state } = useLocation();
    const updateEditStatus = (value) => {
        SetIsNotEditing(value)
    }
    const redirectFn = (data) => {
        setStorage("userID", data.user_id)
        setStorage("username", data.username)
        console.log("Users:", data)
        SetnewData(data)
    }

    const [languages, setLanguages] = useState(null)
    const options = {
        method: 'GET',
        url: 'https://list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com/languages',
        headers: {
            'X-RapidAPI-Key': 'fbf4a61bebmsh2d5b7c851ba83aep15f113jsn0c59c53fddca',
            'X-RapidAPI-Host': 'list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com'
        }
    };

    const languageAPI = async () => {
        try {
            const response = await axios.request(options);
            setLanguages(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const [skillsList, setSkillsList] = useState([])
    const skillsAPI = async () => {
        try {
            const response = await utilsAPI.get(`/api/v1/skills?q=${skill}`)
            setSkillsList([ {"Skill Name":""},...response.data ])
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        languageAPI()
    }, [])
    const params = useParams();
    const user = params.username;
    const callAPI = async () => {
        try {
            const response = (user === undefined) ?
                await userAPI.get(`/seeker/profile`, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }) :
                await userAPI.get(`/seeker/profile/${user}`);
            redirectFn(response.data)
        } catch (e) {
            console.log(e)

            alert(e.message)
        }
    }
    useEffect(() => callAPI, []);
    const subForm = async (data) => {
        SetnewData({ ...newData, city: data.city, first_name: data.first_name, last_name: data.last_name, country: data.country, bio: data.bio, profile_picture: data.profile_picture, profile_banner_color: data.profile_banner_color })
        console.log("data", data);
        try {
            await userAPI.put('/seeker/details', data,
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );

        } catch (e) {
            console.log(e)
            callAPI()
            alert(e.message)
        }
    }

    const [isBodyBlur, SetIsBodyBlur] = useState(false)
    const blurBody = (state) => {
        state ? SetIsBodyBlur(true) : SetIsBodyBlur(false)
    }
    const [skill, SetSkill] = useState('');
    const [skills, SetSkills] = useState([]);
    useEffect(() => {
        if (newData.skill) {
            SetSkills(newData.skill)
        }
    }, [newData.skill])
    const handleDeleteSkill = async (id) => {
        //accepts id of Domain tag and delete them from the array 
        try {
            await userAPI.delete(`/seeker/skill/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            SetSkills(prevSkills =>
                prevSkills.filter(e => e.id !== id))
        } catch (e) {
            console.log(e)
        }
    };

    const handleChangeSkill = (v) => {
        //stores the Domain value from the input field as user types
        SetSkill(v)
    };
    useEffect(() => {
        skillsAPI()
    }, [skill])
    const handleSkill = async (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        try {
            if (n !== "") {
                // SetSkills([...skills, { tag: n, id: uuid() }]);
                const response = await userAPI.post('/seeker/skill', { "skill": skill }, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                })
                SetSkill("")
                callAPI()
                console.log("skill", skill)
            }
        } catch (e) {
            console.log(e)
        }
    };
    const profileBodyClass = `profile-body-section ${isBodyBlur && 'body-blur'}`

    return (
        <>
            {data ?
                <div id="profile-page">
                    <ProfileHead data={newData} blurFn={blurBody} subForm={subForm} isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
                    <NavigationBar active="profile" redirect={state} />
                    <div className={profileBodyClass}>
                        <div className="profile-pane profile-left-pane">
                            {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                            <ContactCard data={{
                                title: "Contacts and Profiles", addIcon: false, editIcon: true
                            }} contactData={newData} reloadFn={callAPI} />
                        </div>
                        <div className="profile-pane profile-middle-pane">
                            <ExperienceBox childData={newData.former_jobs} reloadFn={callAPI} />
                            <FeatureBoxMiddlePane //component defaults to QualificationBox
                                childData={newData.education}
                            />
                            {/* <FeatureBoxMiddlePane data={{ title: "Licenses and certifications ", edit: true, isLanguage: false, cardData: { qualification_label: "Name", qualification_provider: "Issuing organization" } }}
                                childData={[
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 },
                                    { qualification: "Master of science - Computer Science", id: uuid(), qualification_provider: "Massachusetts Institute of Technology (MIT)", start_year: 2005, end_year: 2009 }
                                ]} /> */}
                            <LicenseBox
                                childData={newData.certificate} reloadFn={callAPI}
                            />
                            <AddSkills id="profile-section-skills" availableSkills={skillsList} value={skill} tags={skills} deleteFn={handleDeleteSkill} changeFn={handleChangeSkill} updateFn={handleSkill} data={{ title: "Skills", inputPlaceholder: "HTML" }} />

                            <LanguageBox
                                reloadFn={callAPI}
                                languages={languages}
                                childData={newData.language}
                            />
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