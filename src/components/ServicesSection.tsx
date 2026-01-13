import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SERVICES = [
    {
        title: 'Software Personalizado',
        subtitle: 'Gestión & Métricas',
        description: 'Plataformas web completas donde podés llevar un seguimiento de todas las áreas de tu negocio y métricas para que no te pierdas nada de lo que pasa.',
        image: '/service-software.jpg',
        color: '#5fd6fe'
    },
    {
        title: 'Sistemas Completos',
        subtitle: 'Eficiencia Operativa',
        description: 'Desde atención al cliente las 24 horas, hasta sistemas para agilizar flujos internos y eliminar el error humano.',
        image: '/service-systems.jpg',
        color: '#2079eb'
    },
    {
        title: 'Lo que tus redes necesitan',
        subtitle: 'Growth & Viralidad',
        description: 'Creación de contenido orgánico para tus redes. Videos con IA e imágenes para hacerte viral.',
        image: '/service-social-hq.jpg',
        color: '#5fd6fe'
    },
    {
        title: 'Informes mensuales y trimestrales',
        subtitle: 'Análisis & Estrategia',
        description: 'Mes a mes se va a estar enviando un informe con las métricas más importantes de su negocio, un análisis, y un resumen de lo principal que pasó en IA ese mes.',
        image: '/service-reports.jpg',
        color: '#2079eb'
    },
    {
        title: 'Evolución sin límites',
        subtitle: 'Innovación Continua',
        description: 'Investigamos y sumamos cada nuevo avance de la IA a tu operación. Si surge una tecnología superior o una nueva área donde optimizar tu negocio, la implementamos de inmediato para que nunca dejes de liderar.',
        image: '/service-logo-new.png',
        color: '#2079eb'
    }
];

const ServicesSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);

    // Reduced sizes
    const cardWidth = Math.min(windowWidth * 0.8, 700);
    const cardHeight = '420px';
    const gap = 30;

    const xOffset = (windowWidth / 2) - (cardWidth / 2) - (currentIndex * (cardWidth + gap));

    const gradientText = {
        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    return (
        <section id="services-section" style={{
            padding: '40px 0 60px 0',
            background: '#ffffff',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Header Content - Aggressively reduced marginBottom */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '20px', padding: '0 20px' }}>
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        display: 'inline-block'
                    }}
                >
                    Servicios
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                        fontWeight: 800,
                        color: '#1d1d1f',
                        lineHeight: 1.1
                    }}
                >
                    Qué desarrollamos para <span style={gradientText}>tu negocio</span>
                </motion.h2>
            </div>

            {/* Carousel Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Navigation Arrows - Smaller */}
                <div style={{
                    position: 'absolute',
                    left: '4%',
                    right: '4%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    zIndex: 20,
                    pointerEvents: 'none'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.1, x: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prev}
                        style={{
                            pointerEvents: 'auto',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                            color: '#1d1d1f',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={next}
                        style={{
                            pointerEvents: 'auto',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                            color: '#1d1d1f',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <ChevronRight size={24} />
                    </motion.button>
                </div>

                {/* Sliding List - Drag Optimized with Pan events */}
                <motion.div
                    onPanEnd={(_, info) => {
                        const threshold = 50;
                        if (info.offset.x < -threshold) next();
                        else if (info.offset.x > threshold) prev();
                    }}
                    animate={{ x: xOffset }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1 }}
                    style={{
                        display: 'flex',
                        gap: `${gap}px`,
                        padding: '20px 0',
                        cursor: 'grab',
                        touchAction: 'pan-y' // Allow vertical scrolling while maintaining horizontal pan logic
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                >
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={index}
                            animate={{
                                scale: currentIndex === index ? 1 : 0.96,
                                opacity: currentIndex === index ? 1 : 0.4
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                flex: `0 0 ${cardWidth}px`,
                                height: cardHeight,
                                background: '#ffffff',
                                borderRadius: '40px',
                                border: '1px solid rgba(0,0,0,0.05)',
                                boxShadow: currentIndex === index ? '0 30px 70px rgba(0,0,0,0.07)' : '0 10px 20px rgba(0,0,0,0.02)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: windowWidth > 800 ? 'row' : 'column',
                                position: 'relative',
                                userSelect: 'none'
                            }}
                        >
                            {/* Image Container - Top on mobile, right on desktop */}
                            <div style={{
                                width: windowWidth > 800 ? '42%' : '100%',
                                height: windowWidth > 800 ? '100%' : '200px',
                                position: 'relative',
                                background: 'rgba(32,121,235,0.01)',
                                order: windowWidth > 800 ? 2 : 1,
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: index === 4 ? 'contain' : 'cover',
                                        padding: index === 4 ? '20px' : '0',
                                        objectPosition: 'center'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: windowWidth > 800
                                        ? 'linear-gradient(to right, #ffffff, transparent 35%)'
                                        : 'linear-gradient(to top, rgba(255,255,255,0.4), transparent 40%)',
                                    zIndex: 1
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '100%',
                                    height: '100%',
                                    background: `radial-gradient(circle at 70% 30%, ${service.color}15 0%, transparent 60%)`,
                                    zIndex: 0
                                }} />
                            </div>

                            {/* Text Container - Left on desktop, bottom on mobile */}
                            <div style={{
                                width: windowWidth > 800 ? '58%' : '100%',
                                padding: windowWidth > 800 ? '45px' : '20px 30px 30px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: windowWidth > 800 ? 'center' : 'flex-start',
                                zIndex: 2,
                                position: 'relative',
                                order: windowWidth > 800 ? 1 : 2,
                                flex: 1
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '8px',
                                    display: 'inline-block',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase'
                                }}>
                                    {service.subtitle}
                                </span>
                                <h3 style={{
                                    fontSize: 'clamp(1.2rem, 3.5vw, 2.22rem)',
                                    fontWeight: 800,
                                    color: '#1d1d1f',
                                    marginBottom: '10px',
                                    lineHeight: 1.1
                                }}>
                                    {service.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#555',
                                    lineHeight: 1.4,
                                    maxWidth: '440px',
                                    margin: 0
                                }}>
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Pagination Dots - Lower margin */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '10px'
            }}>
                {SERVICES.map((_, idx) => (
                    <motion.div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        animate={{
                            width: currentIndex === idx ? '32px' : '10px',
                            background: currentIndex === idx ? '#2079eb' : 'rgba(0,0,0,0.12)',
                        }}
                        style={{
                            height: '10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
