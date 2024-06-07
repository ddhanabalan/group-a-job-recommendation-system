import { Navigate, Outlet } from "react-router-dom";
import getStorage from "../storage/storage";
const userType = getStorage("userType")
//function to check if user is logged in and authorize routes for signed-in users
export function PrivateRoutes() {
    console.log(userType)
    return (
        userType ? <Outlet /> : <Navigate to='/login' />
    )
}
//function to check if the user is a recruiter/employer and authorize routes exclusive to the role
export function EmployerRoutes() {
    return (
        userType === "recruiter" ? <Outlet /> : <Navigate to='/profile' />
    )
}
//function to check if the user is a seeker and authorize routes exclusive to the role
export function SeekerRoutes() {
    console.log(userType)
    return (
        userType === "seeker" ? <Outlet /> : <Navigate to='/profile' />
    )
}
