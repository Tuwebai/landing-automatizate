import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Search,
    Cpu,
    PlayCircle,
    RefreshCw
} from 'lucide-react';

const ClosingSection: React.FC = () => {
    const FEATURES = [
        {
            title: "Estudio Profundo de Negocio",
            desc: "Analizamos tu modelo actual, detectamos cuellos de botella y diseñamos un plan de integración tecnológica a medida.",
            icon: <Search size={24} />
        },
        {
            title: "Implementación de Sistemas de IA",
            desc: "Automatización de flujos de trabajo y procesos internos para maximizar la productividad.",
            icon: <Cpu size={24} />
        },
        {
            title: "Marketing & Contenido",
            desc: "Generación de piezas visuales (imágenes y video) con IA y planificación de contenido orgánico para Reels/TikTok.",
            icon: <PlayCircle size={24} />
        },
        {
            title: "Actualización Continua",
            desc: "Tu negocio siempre trabajando con lo último que salga al mercado (Anthropic, Gemini, OpenAI, etc.).",
            icon: <RefreshCw size={24} />
        }
    ];

    const blueGradient = 'linear-gradient(45deg, #30a5ff, #2079eb)';

    return (
        <section id="investment-section" style={{
            padding: '100px 20px 60px 20px',
            background: 'linear-gradient(to bottom, #f0f9ff 0%, #ffffff 40%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(32,121,235,0.02) 0%, transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1100px' }}>

                {/* Main Title - Matched to CaseStudySection H2 */}
                <div style={{ marginBottom: '50px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            color: '#1d1d1f',
                            letterSpacing: '-0.02em',
                            marginBottom: '24px'
                        }}
                    >
                        Inversión de la Alianza
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            color: '#424245',
                            maxWidth: '850px',
                            margin: '0 auto',
                            lineHeight: 1.5,
                            fontWeight: 600
                        }}
                    >
                        Tu departamento de IA por{' '}
                        <span style={{
                            background: blueGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 900
                        }}>$997 USD al mes.</span>{' '}
                        <span style={{ fontWeight: 800, color: '#1d1d1f' }}>Esta inversión fija</span> te permite{' '}
                        <span style={{
                            background: blueGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800
                        }}>integrar un equipo</span> de investigación y desarrollo directamente en tu{' '}
                        <span style={{ fontWeight: 800, color: '#1d1d1f' }}>estructura operativa.</span>{' '}
                        <span style={{
                            background: blueGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 900,
                            display: 'block',
                            marginTop: '20px'
                        }}>El servicio incluye:</span>
                    </motion.p>
                </div>

                {/* Relocated Red Gradient Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'linear-gradient(45deg, #ff3b30, #ff2d55)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        marginBottom: '40px',
                        boxShadow: '0 10px 30px rgba(255, 45, 85, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <Zap size={16} color="white" fill="white" />
                    <span style={{
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                    }}>
                        SPOILER ALERT: Tu competencia nos va a odiar
                    </span>
                </motion.div>

                {/* Feature Grid - Optimized for PC and Mobile */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 640 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)', // Always 2 columns as requested for mobile
                    gap: '20px',
                    width: '100%',
                    maxWidth: '900px',
                    marginBottom: '60px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                }}>
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            style={{
                                position: 'relative',
                                borderRadius: '24px',
                                padding: '1.5px',
                                background: blueGradient,
                                width: '100%' // Ensure full width within grid cell
                            }}
                        >
                            <div style={{
                                background: '#ffffff',
                                padding: window.innerWidth > 640 ? '30px 24px' : '20px 15px',
                                borderRadius: '22.5px',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: window.innerWidth > 640 ? '16px' : '10px',
                                height: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{
                                    width: window.innerWidth > 640 ? '48px' : '40px',
                                    height: window.innerWidth > 640 ? '48px' : '40px',
                                    borderRadius: '12px',
                                    background: 'rgba(32,121,235,0.05)',
                                    color: '#2079eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {React.cloneElement(feature.icon as any, { size: window.innerWidth > 640 ? 24 : 20 })}
                                </div>
                                <h3 style={{ fontSize: window.innerWidth > 640 ? '1.15rem' : '0.9rem', fontWeight: 800, color: '#1d1d1f', lineHeight: 1.2 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: window.innerWidth > 640 ? '0.95rem' : '0.75rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Redesigned Nota Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '28px 40px',
                        background: 'rgba(32, 121, 235, 0.05)',
                        borderRadius: '30px',
                        maxWidth: '900px',
                        border: '2px dashed rgba(32, 121, 235, 0.2)',
                        boxShadow: '0 15px 40px rgba(32, 121, 235, 0.03)'
                    }}
                >
                    <p style={{
                        fontSize: '1rem',
                        color: '#424245',
                        lineHeight: 1.6,
                        margin: 0
                    }}>
                        <span style={{
                            fontWeight: 900,
                            color: '#2079eb',
                            fontSize: '1.1rem',
                            display: 'block',
                            marginBottom: '8px'
                        }}>⚠️ Nota de Transparencia</span>
                        El desarrollo de plataformas de gestión y software web a medida se presupuesta de forma independiente tras el análisis inicial de las necesidades del negocio.
                    </p>
                </motion.div>
            </div>

            {/* Removed internal style tag as logic is handled via JS for better control */}
        </section>
    );
};

export default ClosingSection;
