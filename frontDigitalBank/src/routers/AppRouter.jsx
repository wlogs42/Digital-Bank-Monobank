import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import FullLandingPage from "../pages/FullLandingPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

export default function AppRouter(){
    return(
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<FullLandingPage/>}></Route>
                <Route path="/register" element={<RegisterPage/>}></Route>
                <Route path="/login" element={<LoginPage/>}></Route>

            </Route>

        </Routes>
    )
}