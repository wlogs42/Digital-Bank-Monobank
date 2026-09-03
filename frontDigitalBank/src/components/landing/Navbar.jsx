import Logo from "../common/Logo"
import Button from "../common/Button"
import { Link } from "react-router-dom"

export default function Navbar(){
    return(
        <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
            <Logo />
            <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="/#features" className="hover:text-fg transition-colors">Можливості</a>
            <a href="/#savings" className="hover:text-fg transition-colors">Скарбнички</a>
            <a href="/#trust" className="hover:text-fg transition-colors">Чому ми</a>
            </nav>
            <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-medium text-muted hover:text-fg sm:block">
                Увійти
            </Link>
            <Button as={Link} to="/register" size="sm">
                Відкрити картку
            </Button>
            </div>
        </div>
    </header>
    )
}