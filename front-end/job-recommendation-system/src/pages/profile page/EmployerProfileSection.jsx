import { useState, useEffect } from 'react';
import { jobAPI, userAPI } from '../../api/axios';
import { getStorage, setStorage } from '../../storage/storage';
import { useParams,Navigate } from 'react-router-dom';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
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
export default function EmployerProfileSection({ data }) {
    let COMPANY_USERNAME= null;
    let COMPANY_ID = null;
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const [jobVacancies, SetJobVacancies] = useState([]);
    const updateEditStatus = (value) => {
        SetIsNotEditing(value)
    }
    const redirectFn = (data) => {
        COMPANY_USERNAME = data.username;
        COMPANY_ID = data.user_id;
        setStorage("userID", data.user_id)
        setStorage("username", data.username)
        setStorage("userEmail", data.email)
        setStorage("profile pic", data.profile_picture)

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
            console.log("user profile", response)
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
                    await userAPI.get(`/recruiter/profile`, {
                        headers: {
                            'Authorization': `Bearer ${getStorage("userToken")}`
                        }
                    }) :
                    await userAPI.get(`/profile/${user}`);
                console.log("user profile", response)
                redirectFn(response.data)
            } catch (e) {
                console.log(e)

                alert(e.message)
            }
        }
        profileAPI()
    }, []);
    useEffect(() => {
        if (getStorage("userID")) { 
            const callJobVacancyAPI = async (companyId) => {
                try {
                    const response = await jobAPI.get(`/job_vacancy/company`, {
                        headers: {

                            'Authorization': `Bearer ${getStorage("userToken")}`
                        }
                    }
                    );
                    const mod_response = response.data.map(e => ({ id: e.job_id, jobTitle: e.job_name, companyId: e.company_id, companyUsername: e.company_username, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1], e.salary.split('-')[2]], postDate: e.created_at.split('T')[0], last_date: e.last_date.split('T')[0], location: e.location, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc, jobReq: e.requirement, skills: e.skills.length ? e.skills : [{ 'skill': "" }], applicationsReceived: e.job_seekers, closed:e.closed }))
                    SetJobVacancies(mod_response);
                    console.log(response);
                    console.log(" after new job vacancies", mod_response);

                } catch (e) {
                    console.log("jobs failed for id", getStorage("userID"), e)

                    alert(e.message);
                }
            }
            callJobVacancyAPI(getStorage("userID"))
    }  }, [newData])
    const [isBodyBlur, SetIsBodyBlur] = useState(false)
    const profileBodyClass = `employer-profile-body-section ${isBodyBlur && 'body-blur'}`
    const blurBody = (state) => {
        state ? SetIsBodyBlur(true) : SetIsBodyBlur(false)
    }
    const subForm = async (data) => {
        SetnewData({ ...newData, city: data.city, company_name: data.company_name, country: data.country, bio: data.bio, profile_picture: data.profile_picture, profile_banner_color: data.profile_banner_color })
        console.log("data", data);
        try {
            const response = await userAPI.put('/recruiter/details/', data,
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );
            response.request.status === 200 && showSuccessMsg()

        } catch (e) {
            console.log(e)
            showFailMsg()
            callAPI()
            // alert(e.message)
        }
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
            <ProfileHead logOutFn={logOut} data={newData} blurFn={blurBody} subForm={subForm} isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
            <NavigationBar active="profile" />
            <div className={profileBodyClass}>
                <div className="employer-profile-pane employer-profile-left-pane">
                    {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                    <DetailsCard data={{
                        title: "Company Details", addIcon: false, editIcon: true
                    }} companyInfo={newData} reloadFn={callAPI} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />
                    {/* {industry: "Aviation", companysize: "10000+", hq: "india", specialities: ['space', 'aviation', 'hardware', 'technology', 'robotics', 'defense'], locations: "7+" } */}
                    <ContactCard data={{
                        title: "Contacts and Profiles", addIcon: false, editIcon: true
                    }} contactData={newData} reloadFn={callAPI} subForm={subForm} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />


                </div>
                <div className="employer-profile-pane employer-profile-middle-pane">
                    <FeatureBoxMiddlePaneText data={{ title: "About", edit: false }} childData={newData.overview}
                        reloadFn={callAPI} showSuccessMsg={showSuccessMsg} showFailMsg={showFailMsg} />
                    <FeatureBoxMiddlePaneOpenings data={{ title: "Recent Job Openings", user_id: getStorage("userID"), companyUsername: COMPANY_USERNAME,vacancies: jobVacancies, edit: false, userType: "employer"}} childData={{ text: "This is for demo purpose only" }} />
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
                <div className="employer-profile-pane employer-profile-right-pane">
                    {/* <FeatureBox data={{ title: "Achievements and Rankings", addIcon: true, editIcon: true }} /> */}
                </div>
            </div>
        </div>
    )
}