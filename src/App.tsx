import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const ProblemSection = lazy(() => import('./components/ProblemSection'))
const ServicesSection = lazy(() => import('./components/ServicesSection'))
const CaseStudySection = lazy(() => import('./components/CaseStudySection'))
const ClosingSection = lazy(() => import('./components/ClosingSection'))
const BookingSection = lazy(() => import('./components/BookingSection'))
const PostCallSection = lazy(() => import('./components/PostCallSection'))
const Footer = lazy(() => import('./components/Footer'))
const AdminLogin = lazy(() => import('./components/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))

const SectionFallback = ({ id, minHeight }: { id?: string; minHeight: string }) => (
  <section id={id} style={{ minHeight }} aria-hidden="true" />
)

const DeferredSection = ({
  id,
  minHeight,
  children,
}: {
  id?: string
  minHeight: string
  children: React.ReactNode
}) => {
  const [shouldRender, setShouldRender] = useState(false)
  const anchorRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (shouldRender || !anchorRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldRender(true)
        observer.disconnect()
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(anchorRef.current)

    return () => observer.disconnect()
  }, [shouldRender])

  if (!shouldRender) {
    return <section ref={anchorRef} id={id} style={{ minHeight }} aria-hidden="true" />
  }

  return <Suspense fallback={<SectionFallback id={id} minHeight={minHeight} />}>{children}</Suspense>
}

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
          <DeferredSection minHeight="760px">
            <ProblemSection />
          </DeferredSection>
          <DeferredSection id="services-section" minHeight="980px">
            <ServicesSection />
          </DeferredSection>
          <DeferredSection id="case-studies-section" minHeight="720px">
            <CaseStudySection mode="preview" onNavigate={() => setView('case-study')} />
          </DeferredSection>
          <DeferredSection id="investment-section" minHeight="860px">
            <ClosingSection />
          </DeferredSection>
          <DeferredSection id="booking-section" minHeight="640px">
            <BookingSection />
          </DeferredSection>
          <DeferredSection id="post-call-section" minHeight="520px">
            <PostCallSection />
          </DeferredSection>
          <DeferredSection minHeight="320px">
            <Footer onAdminClick={() => setView('admin-login')} onNavigate={scrollToSection} />
          </DeferredSection>
        </>
      ) : view === 'case-study' ? (
        <>
          <Suspense fallback={<SectionFallback id="case-studies-section" minHeight="1200px" />}>
            <CaseStudySection mode="detail" onBack={handleBack} />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="320px" />}>
            <Footer onAdminClick={() => setView('admin-login')} onNavigate={scrollToSection} />
          </Suspense>
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
