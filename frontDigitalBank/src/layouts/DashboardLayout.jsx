import { Outlet } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MobileNav from '../components/dashboard/MobileNav'
import Logo from '../components/common/Logo'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-ink text-fg">
      <Sidebar />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/5 px-5 py-4 lg:hidden">
          <Logo />
          <div className="flex items-center gap-4 text-muted">
            <Search size={20} />
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-500" />
            </div>
          </div>
        </header>

        <main className="px-5 pb-24 pt-6 lg:px-10 lg:py-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
