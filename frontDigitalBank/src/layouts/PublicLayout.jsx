// обгортка для публічних сторінок, що бачить відвідувіч 
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
    return(
        <div className="min-h-screen bg-ink text-fg">
            <Outlet />
        </div>
    )
}