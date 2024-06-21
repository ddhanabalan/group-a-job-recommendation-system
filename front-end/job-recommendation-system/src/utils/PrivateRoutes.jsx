import { Navigate, Outlet } from "react-router-dom";
import getStorage from "../storage/storage";
//function to check if user is logged in and authorize routes for signed-in users
export function PrivateRoutes() {
    const userType = getStorage("userType")
    console.log(userType)
    return (
        userType ? <Outlet /> : <Navigate to='/' />
    )
}
//function to check if the user is a recruiter/employer and authorize routes exclusive to the role
export function EmployerRoutes() {
    const userType = getStorage("userType")
    return (
        userType === "recruiter" ? <Outlet /> : <Navigate to='/profile' />
    )
}
//function to check if the user is a seeker and authorize routes exclusive to the role
export function SeekerRoutes() {
    const userType = getStorage("userType")
    console.log(userType)
    return (
        userType === "seeker" ? <Outlet /> : <Navigate to='/profile' />
    )
}
