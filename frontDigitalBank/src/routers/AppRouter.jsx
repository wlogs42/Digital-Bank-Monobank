import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import FullLandingPage from "../pages/FullLandingPage";

export default function AppRouter(){
    return(
        <Routes>
            {/* публ сторінки */}
            <Route element={PublicLayout}>
                <Route path="/" element={FullLandingPage}></Route>

            </Route>

        </Routes>
    )
}