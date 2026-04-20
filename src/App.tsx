import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import ServicesSection from './components/ServicesSection'
import CaseStudySection from './components/CaseStudySection'
import ClosingSection from './components/ClosingSection'
import PostCallSection from './components/PostCallSection'
import Footer from './components/Footer'
import { lazy, Suspense, useEffect, useState } from 'react'

const BookingSection = lazy(() => import('./components/BookingSection'))
const AdminLogin = lazy(() => import('./components/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))

function App() {
  const [view, setView] = useState<'home' | 'case-study' | 'admin-login' | 'admin-dashboard'>('home');

  const handleBack = (targetId?: string) => {
    setView('home');
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (view === 'home' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main>
      {view !== 'admin-login' && view !== 'admin-dashboard' && (
        <Navbar setView={setView} onNavigate={scrollToSection} />
      )}

      {view === 'home' ? (
        <>
          <Hero />
          <ProblemSection />
          <ServicesSection />
          <CaseStudySection mode="preview" onNavigate={() => setView('case-study')} />
          <ClosingSection />
          <Suspense fallback={<div style={{ minHeight: '640px' }} aria-hidden="true" />}>
            <BookingSection />
          </Suspense>
          <PostCallSection />
          <Footer onAdminClick={() => setView('admin-login')} onNavigate={scrollToSection} />
        </>
      ) : view === 'case-study' ? (
        <>
          <CaseStudySection mode="detail" onBack={handleBack} />
          <Footer onAdminClick={() => setView('admin-login')} onNavigate={scrollToSection} />
        </>
      ) : view === 'admin-login' ? (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
          <AdminLogin onBack={() => setView('home')} onLoginSuccess={() => setView('admin-dashboard')} />
        </Suspense>
      ) : view === 'admin-dashboard' ? (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
          <AdminDashboard onLogout={() => setView('home')} />
        </Suspense>
      ) : null}
    </main>
  )
}

export default App
