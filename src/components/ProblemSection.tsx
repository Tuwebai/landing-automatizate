import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const AI_NEWS = [
    { company: 'OpenAI', text: 'GPT-5.4 Thinking y GPT-5.4 Pro ya corren en ChatGPT, API y Codex', color: '#10a37f' },
    { company: 'Google', text: 'Gemini 2.5 Pro y 3.1 Pro lideran flujos con razonamiento y contexto largo', color: '#4285f4' },
    { company: 'Anthropic', text: 'Claude Code y Claude 4.6 se enfocan en automatizacion agentica', color: '#d97757' },
    { company: 'Meta', text: 'Llama sigue siendo la base open source para despliegues empresariales', color: '#0668E1' },
    { company: 'Mistral', text: 'Mistral Large mantiene la presion en inferencia eficiente y edge', color: '#f5d142' },
    { company: 'NVIDIA', text: 'Blackwell y el stack de inferencia aceleran la adopcion en produccion', color: '#76b900' },
    { company: 'Apple', text: 'Apple Intelligence refuerza la capa on-device con modelos locales', color: '#555555' },
    { company: 'xAI', text: 'Grok se integra en workflows en tiempo real y busquedas asistidas', color: '#000000' },
];

const ProblemSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const [visibleNews, setVisibleNews] = useState<any[]>([]);
    const [newsCounter, setNewsCounter] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gradientStyle = {
        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setNewsCounter(prev => prev + 1);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const nextNews = AI_NEWS[newsCounter % AI_NEWS.length];
        setVisibleNews(prev => {
            const newList = [nextNews, ...prev];
            return newList.slice(0, 4);
        });
    }, [newsCounter]);

    return (
        <section
            ref={containerRef}
            style={{
                padding: '0 5% 100px 5%',
                background: 'linear-gradient(to bottom, transparent 0%, #ffffff 15%, #ffffff 100%)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}
        >
            {/* Background depth effects */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '5%',
                        left: '15%',
                        width: '40vw',
                        height: '40vw',
                        background: 'radial-gradient(circle, rgba(95,214,254,0.2) 0%, transparent 60%)',
                        y: useTransform(scrollYProgress, [0, 1], [-50, 200]),
                    }}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px', paddingTop: '100px' }}>

                {/* News Stack Section */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)', fontWeight: 800, color: '#1d1d1f', marginBottom: '60px', lineHeight: 1.15 }}
                    >
                        En un mundo donde la IA <br />
                        <span style={gradientStyle}>avanza a pasos agigantados</span>
                    </motion.h2>

                    <div style={{
                        height: '240px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        perspective: '1200px',
                        width: '100%',
                        margin: '0 auto',
                        overflow: 'visible'
                    }}>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visibleNews.map((item, idx) => (
                                <motion.div
                                    key={`${item.text}-${newsCounter - idx}`}
                                    initial={windowWidth > 968 ? { opacity: 0, x: "calc(-50% + 50px)", scale: 0.95 } : { opacity: 0, x: "-50%" }}
                                    animate={{
                                        opacity: 1 - idx * 0.3,
                                        y: idx * 40,
                                        z: -idx * 40,
                                        x: "-50%", // ALWAYS TARGET CENTER
                                        scale: 1 - idx * 0.05,
                                        filter: 'none'
                                    }}
                                    exit={windowWidth > 968 ? { opacity: 0, x: "-60%", scale: 0.9, transition: { duration: 0.2 } } : { opacity: 0, transition: { duration: 0 } }}
                                    transition={windowWidth > 968 ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 0 }}
                                    style={{
                                        position: 'absolute',
                                        width: '90%',
                                        maxWidth: '440px',
                                        left: '50%',
                                        background: '#ffffff',
                                        padding: '20px',
                                        borderRadius: '24px',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        zIndex: 10 - idx,
                                        willChange: 'transform, opacity',
                                        backfaceVisibility: 'hidden'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.color, letterSpacing: '0.04em' }}>{item.company}</span>
                                        <motion.span
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            style={{
                                                fontSize: '0.6rem', fontWeight: 800, color: '#2079eb',
                                                background: 'rgba(32, 121, 235, 0.08)', padding: '2px 6px', borderRadius: '15px'
                                            }}
                                        >
                                            AHORA
                                        </motion.span>
                                    </div>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1d1d1f', margin: 0 }}>{item.text}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Complexity Image Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ fontSize: 'clamp(1.4rem, 4.2vw, 2.6rem)', fontWeight: 700, color: '#1d1d1f', marginBottom: '30px', lineHeight: 1.2 }}
                    >
                        Y saber implementar las <br />
                        <span style={gradientStyle}>herramientas correctas es complejo</span>
                    </motion.h3>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            width: '100%',
                            maxWidth: '320px',
                            margin: '0 auto',
                            position: 'relative'
                        }}
                    >
                        <img
                            src="/complexity-visual.webp"
                            alt="Complejidad de la IA"
                            width={1024}
                            height={682}
                            loading="lazy"
                            decoding="async"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '32px',
                                filter: 'drop-shadow(0 20px 40px rgba(95, 214, 254, 0.3)) drop-shadow(0 10px 15px rgba(32, 121, 235, 0.15))',
                                border: '1px solid rgba(255,255,255,0.2)',
                                position: 'relative',
                                zIndex: 2
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            height: '80%',
                            background: 'linear-gradient(45deg, rgba(95,214,254,0.1), rgba(32,121,235,0.1))',
                            filter: 'blur(60px)',
                            zIndex: 1,
                            borderRadius: '50%'
                        }} />
                    </motion.div>
                </div>

                {/* Final Statement - CARD WITH GRADIENT BORDER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        position: 'relative',
                        padding: '1px', // Border width
                        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                        borderRadius: '40px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}
                >
                    <div style={{
                        background: '#ffffff',
                        padding: '60px 40px',
                        borderRadius: '39px', // Sligtly smaller to match outer radius
                        textAlign: 'center',
                    }}>
                        <motion.h4
                            style={{
                                fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)',
                                fontWeight: 800,
                                ...gradientStyle,
                                marginBottom: '20px'
                            }}
                        >
                            Nosotros nos encargamos de eso.
                        </motion.h4>
                        <motion.p
                            style={{
                                fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                                fontWeight: 500, // Balanced weight for regular text
                                color: '#000000',
                                maxWidth: '800px',
                                margin: '0 auto',
                                lineHeight: 1.5
                            }}
                        >
                            Actuamos como una <span style={{ fontWeight: 800 }}>extensión de tu negocio</span>, proporcionándote una <span style={{ fontWeight: 800 }}>ventaja competitiva continua</span> y la certeza de que tu empresa trabaja siempre con <span style={{ fontWeight: 800 }}>lo último en IA</span>.
                        </motion.p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ProblemSection;


