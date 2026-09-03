import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import FullLandingPage from "../pages/FullLandingPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from "../layouts/DashboardLayout";


export default function AppRouter(){
    return(
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<FullLandingPage/>}></Route>
                <Route path="/register" element={<RegisterPage/>}></Route>
                <Route path="/login" element={<LoginPage/>}></Route>

            </Route>
            
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout/>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Route>

        </Routes>
    )
}