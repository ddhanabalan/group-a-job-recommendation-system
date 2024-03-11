import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import JobSection from './pages/JobSection';
import CandidateSection from './pages/CandidateSection';
import Error from './pages/Error';
function App() {


  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Error />} />

        </Routes>
      </BrowserRouter> */}
      {/* <JobSection /> */}
      {/* <Error/> */}
<CandidateSection/>
    </>
  )
}

export default App
