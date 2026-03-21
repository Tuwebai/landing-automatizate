import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
    {
        number: '01',
        title: 'Pagina web',
        text: 'Creamos de 0 una pagina web, o mejoramos la actual, para lograr una presencia digital de calidad.'
    },
    {
        number: '02',
        title: 'Redes sociales',
        text: 'Analizamos a fondo tus redes sociales, la paleta de colores, el branding y el estilo de la marca. Luego lo mejoramos y creamos publicaciones para fomentar la interacción.'
    },
    {
        number: '03',
        title: 'Análisis de procesos',
        text: 'Estudiamos los procesos, detectamos cuellos de botella y diseñamos un plan de implementación para automatizar las tareas.'
    },
    {
        number: '04',
        title: 'Optimización con IA',
        text: 'Con toda esa información procedemos a generar sistemas y automatizaciones personalizadas a las necesidades del negocio.'
    }
];

const PostCallSection: React.FC = () => {
    const blueGradient = 'linear-gradient(45deg, #5fd6fe, #2079eb)';
    const gradientText = {
        background: blueGradient,
        WebkitBackgroundClip: 'text' as const,
        WebkitTextFillColor: 'transparent' as const,
        display: 'inline-block' as const
    };

    return (
        <section
            id="post-call-section"
            style={{
                padding: '40px 20px 120px 20px',
                background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 26%, #f4fbff 52%, #ffffff 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '34%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60vw',
                height: '320px',
                background: 'radial-gradient(circle, rgba(95,214,254,0.10) 0%, rgba(32,121,235,0.025) 45%, transparent 78%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    style={{
                        textAlign: 'center',
                        maxWidth: '720px',
                        margin: '0 auto 56px auto'
                    }}
                >
                    <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        ...gradientText
                    }}>
                        Después de la primera llamada
                    </span>

                    <h2 style={{
                        fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
                        lineHeight: 1.1,
                        color: '#1d1d1f',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        marginBottom: '14px'
                    }}>
                        El siguiente paso es simple
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        color: '#5b6472',
                        margin: 0
                    }}>
                        Agendamos una segunda llamada para profundizar en el negocio, analizar los procesos y, con esa información, empezar por tres frentes claros.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gap: '26px'
                }}>
                    {STEPS.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.08 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '72px minmax(0, 1fr)',
                                gap: '18px',
                                alignItems: 'start',
                                paddingBottom: '26px',
                                borderBottom: index !== STEPS.length - 1 ? '1px solid rgba(148, 163, 184, 0.22)' : 'none'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                background: 'rgba(32,121,235,0.07)',
                                color: '#2079eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                                boxShadow: 'inset 0 0 0 1px rgba(32,121,235,0.06)'
                            }}>
                                {step.number}
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '1.08rem',
                                    lineHeight: 1.3,
                                    color: '#1d1d1f',
                                    fontWeight: 800,
                                    marginBottom: '8px'
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.98rem',
                                    lineHeight: 1.7,
                                    color: '#5b6472',
                                    margin: 0,
                                    maxWidth: '680px'
                                }}>
                                    {step.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PostCallSection;
