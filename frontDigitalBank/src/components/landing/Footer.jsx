import Container from "../common/Container";
import Logo from "../common/Logo";

export default function Footer(){
    return(
        <footer className="border-t border-white/5 py-12">
            <Container className="flex flex-col items-center justify-between gap-6 text-sm text-faint md:flex-row">
                <Logo />
                <p>© 2026 Хрю Банк. Усі права захищені. Ліцензія НБУ №123 від 01.01.2026.</p>
                <div className="flex gap-6">
                <a href="#" className="hover:text-muted">Умови</a>
                <a href="#" className="hover:text-muted">Приватність</a>
                <a href="#" className="hover:text-muted">Підтримка</a>
                </div>

            </Container>
        </footer>
    )
}