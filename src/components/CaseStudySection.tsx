import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Package,
    Truck,
    LayoutDashboard,
    Bell,
    TrendingUp,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

interface CaseStudySectionProps {
    mode: 'preview' | 'detail';
    onNavigate?: () => void;
    onBack?: (targetId?: string) => void;
}

const CaseStudySection: React.FC<CaseStudySectionProps> = ({ mode, onNavigate, onBack }) => {
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gradientText = {
        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    const CASE_DATA = [
        {
            original: {
                title: "Captación manual",
                desc: "Los clientes se consiguen de forma orgánica y manual a través de redes sociales.",
                icon: <Users size={20} />
            },
            implementation: {
                title: "Marketing & Contenido Orgánico",
                points: [
                    "Estrategia centrada en flujo 100% orgánico.",
                    "Captación más eficaz y constante."
                ],
                icon: <TrendingUp size={20} />
            }
        },
        {
            original: {
                title: "Gestión manual",
                desc: "Los ingresos, egresos y stock se ordenan manualmente en un word.",
                icon: <Package size={20} />
            },
            implementation: {
                title: "Plataforma de Gestión Integral",
                points: [
                    "Control de stock logístico centralizado.",
                    "Gestión web por cliente."
                ],
                icon: <LayoutDashboard size={20} />
            }
        },
        {
            original: {
                title: "Despacho final",
                desc: "Se avisa manualmente a cada cliente la cantidad de pedidos y su stock actual.",
                icon: <Truck size={20} />
            },
            implementation: {
                title: "Notificaciones de Despacho",
                points: [
                    "Aviso automático tras actualización en plataforma.",
                    "Reporte instantáneo de unidades y stock."
                ],
                icon: <Bell size={20} />
            }
        }
    ];

    if (mode === 'preview') {
        return (
            <section id="case-studies-section" style={{ padding: '80px 20px', background: 'linear-gradient(to bottom, #ffffff, #f0f9ff)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                marginBottom: '12px',
                                display: 'inline-block'
                            }}
                        >
                            Ejemplo de nuestro trabajo
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                                fontWeight: 800,
                                color: '#1d1d1f',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Nuestro último <span style={gradientText}>caso de éxito</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => {
                            window.scrollTo(0, 0);
                            onNavigate?.();
                        }}
                        style={{
                            background: '#ffffff',
                            borderRadius: '32px',
                            padding: windowWidth > 768 ? '45px 35px' : '30px 20px',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{
                                background: 'rgba(32,121,235,0.05)',
                                padding: '10px 20px',
                                borderRadius: '100px',
                                color: '#2079eb',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                marginBottom: '20px'
                            }}>
                                LOGÍSTICA
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '16px', lineHeight: 1.2 }}>
                                Como NovaFlex pudo escalar su negocio a un x2 trabajando con Automatizate
                            </h3>
                            <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.6, maxWidth: '600px', marginBottom: '28px' }}>
                                Desde procesos 100% manuales, hasta sistemas donde se automatizaron más de la mitad de las tareas repetitivas del negocio. Gracias a ello pudieron escalar.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px 32px',
                                    borderRadius: '100px',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(32, 121, 235, 0.2)'
                                }}
                            >
                                Ver a detalle <ArrowRight size={18} />
                            </motion.button>
                        </div>

                        {/* Abstract Background Element */}
                        <div style={{
                            position: 'absolute',
                            right: '-5%',
                            top: '-10%',
                            width: '40%',
                            height: '140%',
                            background: 'radial-gradient(circle at 50% 50%, rgba(95,214,254,0.08), transparent 70%)',
                            zIndex: 1
                        }} />
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: '60px 20px 100px 20px', background: 'linear-gradient(to bottom, #ffffff, #f0f9ff)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => onBack?.()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '10px 0',
                        marginBottom: '40px'
                    }}
                >
                    <ArrowLeft size={20} /> Volver al Inicio
                </motion.button>

                {/* Case Detail Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                            display: 'inline-block'
                        }}
                    >
                        Análisis Detallado
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 900,
                            color: '#1d1d1f',
                            letterSpacing: '-0.04em',
                            marginBottom: '24px'
                        }}
                    >
                        Logística <span style={gradientText}>NovaFlex</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}
                    >
                        Evolución de una operación tradicional a un ecosistema basado en datos e Inteligencia Artificial.
                    </motion.p>
                </div>

                {/* Content Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>

                    {/* Section 1: Original Process Flow */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '32px', textAlign: 'center' }}>
                            <span style={{ color: '#8e8e93' }}>Los procesos originales</span>
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: windowWidth > 1100 ? `repeat(${CASE_DATA.length}, 1fr)` : windowWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
                            alignItems: 'start',
                            gap: '30px',
                            background: '#ffffff',
                            padding: '40px',
                            borderRadius: '40px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                            maxWidth: windowWidth > 1100 ? '900px' : '100%',
                            margin: '0 auto'
                        }}>
                            {CASE_DATA.map((item, index) => (
                                <div key={index} style={{
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '15px',
                                        background: 'rgba(142,142,147,0.1)',
                                        color: '#8e8e93',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px auto'
                                    }}>
                                        {item.original.icon}
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>
                                        {item.original.title}
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.5 }}>
                                        {item.original.desc}
                                    </p>

                                    {/* Arrow Logic */}
                                    {windowWidth > 1100 && index < CASE_DATA.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            right: '-25px',
                                            top: '25px',
                                            color: '#8e8e93',
                                            opacity: 0.3
                                        }}>
                                            <ArrowRight size={20} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Section 2: Implementation Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '32px', textAlign: 'center' }}>
                            La Transformación: <span style={gradientText}>Lo que implementamos</span>
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: windowWidth > 1100 ? `repeat(${CASE_DATA.length}, 1fr)` : windowWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
                            gap: '24px',
                            maxWidth: windowWidth > 1100 ? '1000px' : '100%',
                            margin: '0 auto'
                        }}>
                            {CASE_DATA.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    style={{
                                        padding: '30px',
                                        background: 'rgba(32,121,235,0.03)',
                                        borderRadius: '32px',
                                        border: '1px solid rgba(32,121,235,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.implementation.icon}
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '12px', minHeight: '2.4em', display: 'flex', alignItems: 'center' }}>
                                            {item.implementation.title}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {item.implementation.points.map((pt, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '10px', color: '#444', fontSize: '0.9rem', lineHeight: 1.4 }}>
                                                    <div style={{ minWidth: '5px', height: '5px', borderRadius: '50%', background: '#2079eb', marginTop: '6px' }} />
                                                    {pt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Conclusion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '80px',
                        padding: '60px 40px',
                        borderRadius: '40px',
                        background: '#ffffff',
                        border: '1px solid rgba(32,121,235,0.1)',
                        boxShadow: '0 20px 60px rgba(32,121,235,0.05)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            marginBottom: '24px',
                            background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            El Impacto Real
                        </h3>
                        <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7, maxWidth: '850px', margin: '0 auto' }}>
                            Con NovaFlex no solo <span style={{ color: '#1d1d1f', fontWeight: 700 }}>logramos automatizar y agilizar tareas</span>, sino que pudimos <span style={{ color: '#1d1d1f', fontWeight: 700 }}>reducir el error humano</span> y lograr una <span style={{ color: '#1d1d1f', fontWeight: 700 }}>organización completa</span> de cada área. Además, mediante el <span style={{ color: '#1d1d1f', fontWeight: 700 }}>contenido orgánico</span> logramos una <span style={{ color: '#1d1d1f', fontWeight: 700 }}>captación de cliente mucho mas eficaz</span>. Gracias a nuestros sistemas la empresa pudo <span style={{ color: '#1d1d1f', fontWeight: 700 }}>duplicar los clientes</span> con los que trabaja, con el mismo personal.
                        </p>
                    </div>

                    {/* Soft blue gradient blobs */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '40%',
                        height: '140%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(95,214,254,0.05), transparent 70%)',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '40%',
                        height: '140%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(32,121,235,0.05), transparent 70%)',
                        zIndex: 1
                    }} />
                </motion.div>

                {/* Back to Home Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginTop: '60px' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onBack?.('investment-section')}
                        style={{
                            background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                            color: 'white',
                            border: 'none',
                            padding: '18px 36px',
                            borderRadius: '100px',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(32, 121, 235, 0.15)'
                        }}
                    >
                        <ArrowLeft size={20} /> Volver a la página
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default CaseStudySection;
