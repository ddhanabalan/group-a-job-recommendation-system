import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SeekerLogin from './pages/SeekerLogin';
import SignUpPage from './pages/SignUp';
import SignUpPage2 from './pages/SignUp2';
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

        </Routes>
      </BrowserRouter>
      {/* <SeekerLogin /> */}
    </>
  )
}

export default App
