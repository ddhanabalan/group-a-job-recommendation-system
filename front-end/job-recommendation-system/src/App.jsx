import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUp';
import SignUpPage2 from './pages/SignUp2';
import JobSection from './pages/JobSection';
import JobOpeningsSection from './pages/JobOpenings';
import CandidateSection from './pages/CandidateSection';
import Error from './pages/Error';
import ProfileSection from './pages/profile page/ProfileSection';
import CreateJobVacancy from './pages/CreateJobVacancy';
function App() {
  const [loginStatus, SetLoginStatus] = useState();
  const updateState = (state) => {
    SetLoginStatus(state)
  }

  return (
    <>
     
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage/>} />
          <Route path="/login/seeker" element={<LoginPage />} />
          <Route path="/login/employer" element={<LoginPage />} />
          <Route path="/signup/seeker" element={<SignUpPage />} />
          <Route path="/signup/employer" element={<SignUpPage />} />
          <Route path="/signup2/seeker" element={<SignUpPage2 />} />
          <Route path="/signup2/employer" element={<SignUpPage2 />} />
          <Route path="/jobs" element={<JobSection/>}/>
          <Route path="/error" element={<Error/>}/>
          <Route path="/candidates" element={<CandidateSection/>}/>
          <Route path="/seeker/openings" element={<JobOpeningsSection/>}/>
          <Route path="/employer/openings" element={<JobOpeningsSection/>}/>
          <Route path="/employer/job-vacancy" element={<CreateJobVacancy/>}/>
          <Route index element={<LandingPage />} />
         
          <Route path="/profile" element={<ProfileSection data={{
            userName: "Amy Williams", userLocation: "Massachusetts, USA", userBio: "🚀 NASA Software Engineer | Mom | STEM Advocate 👩‍🔧✨Embarking on cosmic adventures at NASA by day, crafting precious family moments by night. Join me on this stellar journey! 🌌💖 #NASA #WomenInSTEM #MomEngineer "
          }} />} />
          <Route path="/jobs" element={<JobSection />} />
          <Route path="/candidates" element={<CandidateSection />} />
          <Route path="*" element={<Error />} />
          <Route path="/login" element={loginStatus ? <Navigate to="/profile" /> : <LoginPage updateState={updateState} />} />
        </Routes>
      </BrowserRouter>
      {/* <JobSection /> */}
      {/* <Error/> */}
      {/* <CandidateSection/> */}
      
     
    </>
  )
}

export default App
