import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
    setView?: (view: 'home' | 'case-study' | 'admin-login' | 'admin-dashboard') => void;
    onNavigate?: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView, onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
                        src="/logo.png"
                        alt="Logo"
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

                {/* Links Section - Always Visible */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(10px, 3vw, 30px)',
                    alignItems: 'center'
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
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                                fontWeight: 600,
                                opacity: 0.8,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer',
                                padding: 0
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                            {link.name}
                        </motion.button>
                    ))}

                    {/* CTA Button - Integrated in the same row */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate?.('booking-section')}
                        style={{
                            background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                            color: 'white',
                            padding: '8px clamp(12px, 2vw, 24px)',
                            borderRadius: '980px',
                            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(32, 121, 235, 0.2)',
                            marginLeft: 'clamp(5px, 2vw, 15px)'
                        }}
                    >
                        Agendar
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
