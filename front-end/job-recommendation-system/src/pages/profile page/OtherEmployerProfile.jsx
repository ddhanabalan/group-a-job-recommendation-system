import { useState, useEffect } from 'react';
import { userAPI } from '../../api/axios';
import { v4 as uuid } from 'uuid';
import { getStorage, setStorage } from '../../storage/storage';
import { useParams,Navigate } from 'react-router-dom';
import authAPI from '../../api/axios';
import FeatureBox from '../../components/FeatureBox/FeatureBox';
import FeatureBoxMiddlePane from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePane';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import AddSkills from '../../components/AddSkills/AddSkills';
import Lottie from 'lottie-react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FeatureBoxMiddlePaneText from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneText';
import FeatureBoxMiddlePaneOpenings from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneOpenings';
import FeatureBoxMiddlePaneReview from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneReview';
import failAnimation from '../../images/fail-animation.json'
import LoaderAnimation from '../../components/LoaderAnimation/LoaderAnimation';
import cloudAnimation from '../../images/cloud-animation.json';
import './EmployerProfileSection.css';
export default function OtherEmployerProfile({ data }) {
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
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
    const callAPI = async () => {
        try {
            const response = (user === undefined) ?
                await userAPI.get(`/recruiter/profile`, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }) :
                await userAPI.get(`/profile/${user}`);
            console.log(response)
            redirectFn(response.data)
        } catch (e) {
            console.log(e)

            alert(e.message)
        }
    }
    useEffect(() => callAPI, []);
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

    const subForm = async (data) => {
        SetnewData(data)
        console.log(data);
        // try {
        //     await userAPI.put('/seeker/details', data);

        // } catch (e) {
        //     console.log(e)
        //     alert(e.message)
        // }
    }
    const [successMsg, SetSuccessMsg] = useState(false)
    const [failMsg, SetFailMsg] = useState(false)
    const showSuccessMsg = () => {
        SetSuccessMsg(true)
        setTimeout(() => { SetSuccessMsg(false) }, 1500)
    }
    const showFailMsg = () => {
        SetFailMsg(true)
        setTimeout(() => { SetFailMsg(false) }, 1500)
    }
    const [redirectHome, SetRedirectHome] = useState(false);
    const logOut = () => {
        console.log('helo')
        SetRedirectHome(true)
    }
    return (
        <div id="employer-profile-page">
            {redirectHome && <Navigate to='/' />}
            <ProfileHead access="viewOnly" data={newData} blurFn={blurBody} subForm={subForm} isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
            <NavigationBar active="employer-profile" />
            <div className="employer-profile-body-section">
                <div className="employer-profile-pane employer-profile-left-pane">
                    {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                    <DetailsCard data={{
                        title: "Company Details", addIcon: false, editIcon: true
                    }} access="viewOnly" companyInfo={newData} reloadFn={callAPI} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />
                    {/* {industry: "Aviation", companysize: "10000+", hq: "india", specialities: ['space', 'aviation', 'hardware', 'technology', 'robotics', 'defense'], locations: "7+" } */}
                    <ContactCard data={{
                        title: "Contacts and Profiles", addIcon: false, editIcon: true
                    }} access="viewOnly" contactData={newData} reloadFn={callAPI} subForm={subForm} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />


                </div>
                <div className="employer-profile-pane employer-profile-middle-pane">
                    <FeatureBoxMiddlePaneText access="viewOnly" data={{ title: "About", edit: false }} childData={newData.overview}
                        reloadFn={callAPI} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />
                    <FeatureBoxMiddlePaneOpenings data={{ title: "Recent Job Openings", edit: false }} childData={{ text: "This is for demo purpose only" }} />
                    {/* <FeatureBoxMiddlePaneReview data={{title: "Reviews", edit: false}} childData={{text: "This is for demo purpose only"}}/> */}


                    <div className="spacer-div" ></div>
                    {successMsg &&
                        <div className="message-from-server">
                            {/* <ConfBox message={"Changes saved"} animation={cloudAnimation} bgcolor="#90e0ef" /> */}
                            <p>Changes saved &emsp; </p>
                            <Lottie className="cloud-ani" animationData={cloudAnimation} loop={false} />
                        </div>
                    }
                    {failMsg &&
                        <div className="message-from-server" style={{ backgroundColor: "#f7cad0a1", width: '20rem' }}>
                            {/* <ConfBox message={"Changes saved"} animation={cloudAnimation} bgcolor="#90e0ef" /> */}
                            <p>Failed to update changes &emsp; </p>
                            <Lottie className="success-ani" animationData={failAnimation} loop={true} />
                        </div>
                    }
                </div>
                {/* <div className="employer-profile-pane employer-profile-right-pane">
                    <FeatureBox data={{ title: "Achievements and Rankings", addIcon: true, editIcon: true }} />
                </div> */}
            </div>
        </div>
    )
}