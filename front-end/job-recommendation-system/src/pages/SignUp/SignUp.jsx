import { useLocation } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import '../pages.css';
export default function SignUpPage() {
    const location = useLocation();
    const userType = location["pathname"].includes("organization") ? "employer" : "seeker";
    const pageClass = `${userType === "seeker" ? 'signup-page-user' : 'signup-page'}`
    return (
        <div id="page" className={pageClass}>
            <SignUpForm/>
        </div>
    )
}