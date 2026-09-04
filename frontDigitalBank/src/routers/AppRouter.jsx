import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import FullLandingPage from "../pages/FullLandingPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from "../layouts/DashboardLayout";
import CreateCardPage from "../pages/CreateCardPage";
import CardsPage from "../pages/CardsPage";
import CardDetailPage from "../pages/CardDetailPage";
import CreditsPage from "../pages/CreditPage";
import SavingsPage from "../pages/SavingsPage";
import BondsPage from "../pages/BondsPage";
import DepositsPage from "../pages/DepositsPage";
import ProfilePage from "../pages/ProfilePage";
import MorePage from "../pages/MorePage";


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
                    <Route path="/cards" element={<CardsPage />} />
                    <Route path="/cards/create" element={<CreateCardPage />} />
                    <Route path="/cards/:cardId" element={<CardDetailPage />} />
                    <Route path="/credit" element={<CreditsPage />} />
                    <Route path="/savings" element={<SavingsPage />} />
                    <Route path="/bonds" element={<BondsPage />} />
                    <Route path="/deposits" element={<DepositsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/more" element={<MorePage />} />
                </Route>
            </Route>

        </Routes>
    )
}