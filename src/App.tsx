import Navbar from './components/Navbar'
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
  const whatsappHref = 'https://wa.me/5492216793522'

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
    <>
      <main>
        {view !== 'admin-login' && view !== 'admin-dashboard' && (
          <Navbar setView={setView} onNavigate={scrollToSection} />
        )}

        {view === 'home' ? (
          <>
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

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp al +54 9 2216 79-3522"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '999px',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(37, 211, 102, 0.35)',
          zIndex: 9999,
        }}
      >
        <svg width="31" height="31" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            fill="#fff"
            d="M27.281 4.696A15.815 15.815 0 0 0 16.044 0C7.319 0 .221 7.1.219 15.823a15.74 15.74 0 0 0 2.125 7.934L0 32l8.458-2.219a15.79 15.79 0 0 0 7.582 1.938h.007c8.723 0 15.823-7.1 15.826-15.823a15.72 15.72 0 0 0-4.592-11.2Zm-11.237 24.35h-.006a13.1 13.1 0 0 1-6.676-1.825l-.479-.285-5.019 1.316 1.34-4.894-.311-.502a13.08 13.08 0 0 1-2.01-7.01C2.886 8.596 8.796 2.687 16.05 2.687c3.48.001 6.75 1.356 9.211 3.817a12.94 12.94 0 0 1 3.806 9.214c-.003 7.253-5.912 13.328-13.023 13.328Zm7.144-9.75c-.389-.195-2.302-1.137-2.659-1.267-.356-.13-.616-.195-.876.196-.26.389-1.007 1.267-1.235 1.526-.227.26-.454.292-.843.098-.389-.196-1.643-.605-3.129-1.931-1.156-1.03-1.936-2.301-2.163-2.69-.227-.39-.024-.6.171-.794.176-.175.389-.455.584-.682.195-.227.26-.39.389-.649.13-.26.065-.487-.033-.682-.097-.195-.876-2.106-1.2-2.885-.316-.758-.638-.655-.876-.667l-.746-.014c-.26 0-.682.098-1.04.487-.357.39-1.364 1.332-1.364 3.247 0 1.916 1.397 3.766 1.591 4.026.195.26 2.75 4.2 6.662 5.887.931.402 1.657.641 2.223.82.934.297 1.785.255 2.457.155.75-.112 2.302-.94 2.627-1.85.324-.909.324-1.688.227-1.85-.097-.163-.357-.26-.746-.455Z"
          />
        </svg>
      </a>
    </>
  )
}

export default App
