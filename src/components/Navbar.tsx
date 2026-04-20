import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    setView?: (view: 'home' | 'case-study' | 'admin-login' | 'admin-dashboard') => void;
    onNavigate?: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView, onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const navLinks = [
        { name: 'Inicio', id: 'hero-section' },
        { name: 'Servicios', id: 'services-section' },
        { name: 'Casos', id: 'case-studies-section' },
        { name: 'Inversión', id: 'investment-section' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                width: '100%',
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '15px 5%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: scrolled
                        ? '0 10px 30px rgba(0, 0, 0, 0.08)'
                        : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Logo Section */}
                <div
                    onClick={() => onNavigate ? onNavigate('hero-section') : setView?.('home')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src="/logo.webp"
                        alt="Logo"
                        width={1024}
                        height={1024}
                        decoding="async"
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: '#1d1d1f',
                        letterSpacing: '-0.02em',
                        marginLeft: '-6px',
                        background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        utomatizate
                    </span>
                </div>

                {/* Desktop Links Section - Hidden on mobile */}
                <div style={{
                    display: windowWidth > 968 ? 'flex' : 'none',
                    gap: '40px',
                    alignItems: 'center',
                    marginLeft: 'auto'
                }}>
                    {navLinks.map((link) => (
                        <motion.button
                            key={link.name}
                            onClick={() => onNavigate?.(link.id)}
                            whileHover={{ y: -2 }}
                            style={{
                                background: 'none',
                                border: 'none',
                                textDecoration: 'none',
                                color: '#1d1d1f',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                opacity: 0.8,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer',
                                padding: '10px 0'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                            {link.name}
                        </motion.button>
                    ))}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate?.('booking-section')}
                        style={{
                            background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                            color: 'white',
                            padding: '10px 28px',
                            borderRadius: '980px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(32, 121, 235, 0.2)',
                            marginLeft: '10px'
                        }}
                    >
                        Agendar
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    style={{
                        display: windowWidth <= 968 ? 'flex' : 'none',
                        cursor: 'pointer',
                        padding: '10px',
                        zIndex: 1010, // Above overlay
                        color: '#1d1d1f'
                    }}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Background Backdrop for clicking outside */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 999
                            }}
                        />
                        <motion.div
                            initial={windowWidth > 968 ? { x: '100%' } : { x: 0 }}
                            animate={{ x: 0 }}
                            exit={windowWidth > 968 ? { x: '100%' } : { x: 0, opacity: 0 }}
                            transition={windowWidth > 968 ? { type: 'tween', duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '80%',
                                maxWidth: '300px',
                                background: '#ffffff',
                                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '40px',
                                gap: '30px',
                                willChange: 'transform'
                            }}
                        >
                            {/* Inner Close Button for Mobile */}
                            <div
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    alignSelf: 'flex-end',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    color: '#1d1d1f',
                                    marginBottom: '10px'
                                }}
                            >
                                <X size={32} />
                            </div>

                            {navLinks.map((link) => (
                                <motion.button
                                    key={link.name}
                                    onClick={() => {
                                        onNavigate?.(link.id);
                                        setIsMenuOpen(false);
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '1.2rem',
                                        fontWeight: 700,
                                        color: '#1d1d1f',
                                        cursor: 'pointer',
                                        padding: '10px 0'
                                    }}
                                >
                                    {link.name}
                                </motion.button>
                            ))}
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onNavigate?.('booking-section');
                                    setIsMenuOpen(false);
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                                    color: 'white',
                                    padding: '15px',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 800,
                                    marginTop: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                Agendar Llamada
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {windowWidth <= 968 && !isMenuOpen && (
                <motion.div
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate?.('booking-section')}
                    style={{
                        position: 'fixed',
                        left: '50%',
                        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                        color: 'white',
                        padding: '14px 32px',
                        borderRadius: '999px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 12px 30px rgba(32, 121, 235, 0.28)',
                        zIndex: 1005,
                        whiteSpace: 'nowrap'
                    }}
                >
                    Agendar
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
