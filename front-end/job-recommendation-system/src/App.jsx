import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import JobSection from './pages/JobSection';
import CandidateSection from './pages/CandidateSection';
import Error from './pages/Error';
import ProfileSection from './pages/profile page/ProfileSection';
function App() {
  const [loginStatus, SetLoginStatus] = useState();
  const updateState = (state) => {
    SetLoginStatus(state)
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
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
