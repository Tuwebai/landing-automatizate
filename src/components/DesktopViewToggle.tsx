import React, { useState, useEffect } from 'react';
import { Monitor, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DesktopViewToggle: React.FC = () => {
    const [isDesktopMode, setIsDesktopMode] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsVisible(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleDesktopMode = async () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) return;

        if (!isDesktopMode) {
            // Enable Desktop Mode
            viewport.setAttribute('content', 'width=1280, initial-scale=0.1, user-scalable=yes');

            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
                // Attempt to lock orientation to landscape
                if (window.screen.orientation && (window.screen.orientation as any).lock) {
                    await (window.screen.orientation as any).lock('landscape').catch(() => {
                        console.log('Orientation lock not supported or blocked');
                    });
                }
            } catch (err) {
                console.error('Fullscreen request failed:', err);
            }

            setIsDesktopMode(true);
        } else {
            // Revert to Mobile Mode
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            }
            if (window.screen.orientation && window.screen.orientation.unlock) {
                window.screen.orientation.unlock();
            }

            setIsDesktopMode(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>
            <AnimatePresence>
                {isDesktopMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                            background: 'rgba(32, 121, 235, 0.9)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            boxShadow: '0 10px 25px rgba(32,121,235,0.3)',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        Modo Desktop Activo<br />
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>Usa dos dedos para zoom</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDesktopMode}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '20px',
                    background: isDesktopMode ? '#1d1d1f' : 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isDesktopMode
                        ? '0 15px 35px rgba(0,0,0,0.2)'
                        : '0 15px 35px rgba(32,121,235,0.4)',
                    pointerEvents: 'auto',
                    border: '2px solid rgba(255,255,255,0.2)',
                    transition: 'background 0.3s'
                }}
            >
                {isDesktopMode ? <Phone size={24} /> : <Monitor size={24} />}
            </motion.button>
        </div>
    );
};

export default DesktopViewToggle;
