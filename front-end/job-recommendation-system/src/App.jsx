import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { setStorage, getStorage } from './storage/storage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoutes, SeekerRoutes, EmployerRoutes } from './utils/PrivateRoutes';
import axios from './api/axios';
import CandidateSection from './pages/CandidateSection/CandidateSection';
import CreateJobVacancy from './pages/CreateJobVacancy/CreateJobVacancy';
import Error from './pages/Error/Error';
import DeleteAccount from './components/DeleteAccount/DeleteAccount';
import JobSection from './pages/JobSection/JobSection';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUp/SignUp';
import SignUpPage2 from './pages/SignUp/SignUp2';
import OtherUserProfile from './pages/profile page/OtherUserProfile';
import ProfileSection from './pages/profile page/ProfileSection';
import EmployerProfileSection from './pages/profile page/EmployerProfileSection';
import VerifyAccount from './pages/VerifyAccount/VerifyAccount';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ForgetPasswordResponse from './components/ForgetPassword/ForgetPasswordResponse';
import ReviewApplications from './pages/ReviewApplications/ReviewApplications';
import OtherEmployerProfile from './pages/profile page/OtherEmployerProfile';
import SeekerJobStatusSection from './pages/SeekerJobStatusSection/SeekerJobStatusSection';
import JobInviteSection from './pages/JobInviteSection/JobInviteSection';

function App() {
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (getStorage("refToken")) {
        refreshTokens()
      }
    }, 900000)//refresh tokens every 15 minutes

    return () => clearInterval(refreshInterval)
  }, [])
  const refreshTokens = () => {

    axios.get('/refresh_token', {
      headers: {
        'Authorization': `Bearer ${getStorage("refToken")}`
      }
   }).then((response) => {
      console.log(response)
      setStorage("refToken", response.data.refresh_token)
      setStorage("userToken", response.data.access_token)
    }).catch((error) => {
      console.log(error)
    })


  }
  useEffect(() => {
    SetUser(getStorage("userType"))
  }, []);

  const [user, SetUser] = useState(null);

  const fixUser = (type) => {
    console.log(type)
    SetUser(type)
    setStorage("userType", type)
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* general routes */}
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage fixUser={fixUser} />} />
          <Route path="/login/organization" element={<LoginPage fixUser={fixUser} />} />
          <Route path='/delete' element={<DeleteAccount />} />
          <Route path='/forgot_password' element={<ForgetPassword />} />
          <Route path='/forgot_password/verify/:token' element={<ForgetPasswordResponse />} />

          {/* seeker signup  */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/organization" element={<SignUpPage />} />
          <Route path="/signup/personal-details" element={<SignUpPage2 />} />
          <Route path="/signup/organization/personal-details" element={<SignUpPage2 />} />
          <Route path="/verify/:accessToken" element={<VerifyAccount />} />
          {/* routes common to signed-in users */}
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={user !== null && user === "seeker" ? <ProfileSection data={{}} /> : user === "recruiter" && <EmployerProfileSection data={{}} />} />
            <Route path="/profile/:username" element={<OtherUserProfile data={{}} />} />
            <Route path="/e/profile/:username" element={<OtherEmployerProfile data={{}} />} />
            <Route path="/employer-profile" element={<EmployerProfileSection data={{}} />} />
          </Route>
          {/* routes exclusive to seekers */}
          <Route element={<SeekerRoutes />}>
            <Route path="/jobs" element={<JobSection />} />
            
            <Route path="/invite/:invite_id" element={<ReviewApplications userType="seeker" invite={true}/>} />
            <Route path="/seeker/openings/:company_username/:job_id" element={<ReviewApplications userType="seeker"/>} />
            <Route path="/seeker/applications" element={<SeekerJobStatusSection userType="seeker"/>} />
          </Route>
          {/* routes exclusive to recruiters */}
          <Route element={<EmployerRoutes />}>
            <Route path="/candidates" element={<CandidateSection />} />

            <Route path="/employer/job-vacancy" element={<CreateJobVacancy />} />
            <Route path="/employer/review-applications" element={<ReviewApplications userType="employer" />} />
            <Route path="/employer/job-invite" element={<JobInviteSection userType="employer" />} />
            
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
