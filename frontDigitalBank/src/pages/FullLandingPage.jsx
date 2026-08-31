import Navbar from '.././components/landing/Navbar'
import Hero from '.././components/landing/Hero'
import Features from '.././components/landing/Features'
import Trust from '.././components/landing/Trust'
import FinalCta from '.././components/landing/FinalCta'
import Footer from '.././components/landing/Footer'

export default function FullLandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Trust />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
