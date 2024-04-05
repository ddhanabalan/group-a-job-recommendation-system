import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CandidateSection from './pages/CandidateSection/CandidateSection';
import CreateJobVacancy from './pages/CreateJobVacancy/CreateJobVacancy';
import Error from './pages/Error/Error';
import JobOpeningsSection from './pages/JobOpenings/JobOpenings';
import JobSection from './pages/JobSection/JobSection';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUp/SignUp';
import SignUpPage2 from './pages/SignUp/SignUp2';
import ProfileSection from './pages/profile page/ProfileSection';
import EmployerProfileSection from './pages/profile page/EmployerProfileSection';
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
          <Route path="/login/seeker" element={<LoginPage />} />
          <Route path="/login/employer" element={<LoginPage />} />
          <Route path="/signup/seeker" element={<SignUpPage />} />
          <Route path="/signup/employer" element={<SignUpPage />} />
          <Route path="/signup2/seeker" element={<SignUpPage2 />} />
          <Route path="/signup2/employer" element={<SignUpPage2 />} />
          <Route path="/jobs" element={<JobSection />} />
          <Route path="/error" element={<Error />} />
          <Route path="/candidates" element={<CandidateSection />} />
          <Route path="/seeker/openings" element={<JobOpeningsSection />} />
          <Route path="/employer/openings" element={<JobOpeningsSection />} />
          <Route path="/employer/job-vacancy" element={<CreateJobVacancy />} />
          <Route path="/profile" element={<ProfileSection  data={{
            userName: "AmyWilliams", first_name: "Amy", last_name: "Williams", location: "Massachusetts", country:"USA", bio: "🚀 NASA Software Engineer | Mom | STEM Advocate 👩‍🔧✨Embarking on cosmic adventures at NASA by day, crafting precious family moments by night. Join me on this stellar journey! 🌌💖 #NASA #WomenInSTEM #MomEngineer "
          }} />} />
          <Route path="/employer-profile" element={<EmployerProfileSection  data={{
            userName: "NASA - National Aeronautics and Space Administration", userLocation: "Washington, D.C, USA", userBio: "Explore the universe and discover our home planet with the official NASA page on <company name> . "
          }} />} />
          <Route path="/jobs" element={<JobSection />} />
          <Route path="/candidates" element={<CandidateSection />} />
          <Route path="*" element={<Error />} />
          <Route path="/login" element={redirect ? <Navigate to="/profile" /> : <LoginPage updateState={updateState} />} />
        </Routes>
      </BrowserRouter>
      {/* <JobSection /> */}
      {/* <Error/> */}
      {/* <CandidateSection/> */}


    </>
  )
}

export default App
