import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getStorage, setStorage } from '../../storage/storage';
import { userAPI } from '../../api/axios';
import Lottie from 'lottie-react';
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
export default function OtherUserProfile({ data }) {
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const { state } = useLocation();

    const [redirectHome, SetRedirectHome] = useState(false);
    const logOut = () => {
        console.log('helo')
        SetRedirectHome(true)
    }
    const updateEditStatus = (value) => {
        SetIsNotEditing(value)
    }
    const redirectFn = (data) => {
        setStorage("guestUserID", data.user_id)
        setStorage("guestUsername", data.username)
        setStorage("guestUserType", data.user_type)
        console.log("Users:", data)
        SetnewData(data)
    }

    const params = useParams();
    const user = params.username;
    const [isEmployer, SetIsEmployer] = useState(false)
    const callAPI = async () => {
        try {
            const response = (user === undefined) ?
                await userAPI.get(`/seeker/profile`, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }) :
                await userAPI.get(`/profile/${user}`);
            response.data.user_type && response.data.user_type==="recruiter"&&SetIsEmployer(true)
            redirectFn(response.data)
        } catch (e) {
            console.log(e)

            alert(e.message)
        }
    }
    useEffect(() => {
        const profileAPI = async () => {
            try {
                const response = (user === undefined) ?
                    await userAPI.get(`/seeker/profile`, {
                        headers: {
                            'Authorization': `Bearer ${getStorage("userToken")}`
                        }
                    }) :
                    await userAPI.get(`/profile/${user}`);
                redirectFn(response.data)
            } catch (e) {
                console.log(e)

                alert(e.message)
            }
        }
        profileAPI()
    }, []); 

    return (
        <>
            {redirectHome && <Navigate to='/' />}
            {isEmployer && <Navigate to={'/e/profile/'+user} />}
            {data ?
                <div id="profile-page">
                    <ProfileHead access={"viewOnly"} data={newData} logOutFn={logOut}  isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
                    <NavigationBar active="profile" redirect={state} />
                    <div className="profile-body-section">
                        <div className="profile-pane profile-left-pane">
                            {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                            <ContactCard
                                access={"viewOnly"} data={{ title: "Contacts and Profiles", addIcon: false, editIcon: true }}
                                contactData={newData} reloadFn={callAPI} />
                        </div>
                        <div className="profile-pane profile-middle-pane">
                            <ExperienceBox access={"viewOnly"} childData={newData.former_jobs} reloadFn={callAPI}  />
                            <FeatureBoxMiddlePane //component defaults to QualificationBox
                                access={"viewOnly"} childData={newData.prev_education}
                            />
                            <LicenseBox
                                access={"viewOnly"} 
                                childData={newData.certificate} reloadFn={callAPI}
                            />
                            <AddSkills access={"viewOnly"} id="profile-section-skills" reloadFn={callAPI} newData={newData} data={{ title: "Skills", inputPlaceholder: "HTML" }} />

                            <LanguageBox
                                access={"viewOnly"}
                                reloadFn={callAPI}
                                childData={newData.language}
                            />
                            <div className="spacer-div" ></div>
                        </div>
                        {/* <div className="profile-pane profile-right-pane">
                            <FeatureBox data={{ title: "Achievements", addIcon: true, editIcon: true }} />
                        </div> */}
                    </div>
                </div>
                :
                <LoaderAnimation />}
        </>
    )
}