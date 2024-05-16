import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CandidateSection from './pages/CandidateSection/CandidateSection';
import CreateJobVacancy from './pages/CreateJobVacancy/CreateJobVacancy';
import Error from './pages/Error/Error';

import JobSection from './pages/JobSection/JobSection';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUp/SignUp';
import SignUpPage2 from './pages/SignUp/SignUp2';
import ProfileSection from './pages/profile page/ProfileSection';
import EmployerProfileSection from './pages/profile page/EmployerProfileSection';
import VerifyAccount from './pages/VerifyAccount/VerifyAccount';
import ReviewApplications from './pages/ReviewApplications/ReviewApplications';
function App() {
  const [redirect, SetRedirect] = useState();
  const updateState = (state) => {
    SetRedirect(state)
  }


  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login/seeker"  element={redirect ? <Navigate to="/profile" /> : <LoginPage updateState={updateState}/>} />
          <Route path="/login/employer"  element={redirect ? <Navigate to="/employer-profile" /> : <LoginPage updateState={updateState}/>} />
          <Route path="/signup/seeker" element={<SignUpPage />} />
          <Route path="/signup/employer" element={<SignUpPage />} />
          <Route path="/signup2/seeker" element={<SignUpPage2 />} />
          <Route path="/signup2/employer" element={<SignUpPage2 />} />
          <Route path="/jobs" element={<JobSection />} />
          <Route path="/error" element={<Error />} />
          <Route path="/candidates" element={<CandidateSection />} />
          <Route path="/seeker/openings" element={<ReviewApplications />} />
          
          <Route path="/employer/job-vacancy" element={<CreateJobVacancy />} />
          <Route path="/employer/review-applications" element={<ReviewApplications />} />
          <Route path="/profile" element={<ProfileSection  data={{}} />} />
          <Route path="/profile/:username" element={<ProfileSection  data={{}} />} />
          <Route path="/employer-profile" element={<EmployerProfileSection  data={{
            userName: "NASA",first_name: "NASA - National Aeronautics and Space Administration", location: "Washington, D.C", country:"USA", bio: "We search the Universe. "
          }} />} />
          <Route path="/jobs" element={<JobSection/>} />
          <Route path="/candidates" element={<CandidateSection />} />
          <Route path="/verify/:accessToken" element={<VerifyAccount/>} />
          <Route path="*" element={<Error />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
