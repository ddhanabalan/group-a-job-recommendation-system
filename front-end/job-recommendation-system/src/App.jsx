import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUp';
import SignUpPage2 from './pages/SignUp2';
import JobSection from './pages/JobSection';
import JobOpeningsSection from './pages/JobOpenings';
import CandidateSection from './pages/CandidateSection';
import Error from './pages/Error';
import CreateJobVacancy from './pages/CreateJobVacancy';
function App() {


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
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter> 
      {/* <JobSection /> */}
      {/* <Error/> */}
    </>
  )
}

export default App
