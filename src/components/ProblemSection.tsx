import React from 'react';

const ProblemSection: React.FC = () => {
    const gradientStyle = {
        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    };

    return (
        <section
            style={{
                padding: '0 5% 100px 5%',
                background: 'linear-gradient(to bottom, transparent 0%, #ffffff 15%, #ffffff 100%)',
                minHeight: '100vh'
            }}
        >
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: '60px' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
                            fontWeight: 800,
                            color: '#1d1d1f',
                            marginBottom: '20px',
                            lineHeight: 1.15
                        }}
                    >
                        En un mundo donde la IA <br />
                        <span style={gradientStyle}>avanza a pasos agigantados</span>
                    </h2>
                </div>

                <div style={{ marginBottom: '60px' }}>
                    <h3
                        style={{
                            fontSize: 'clamp(1.4rem, 4.2vw, 2.6rem)',
                            fontWeight: 700,
                            color: '#1d1d1f',
                            marginBottom: '20px',
                            lineHeight: 1.2
                        }}
                    >
                        Y saber implementar las <br />
                        <span style={gradientStyle}>herramientas correctas es complejo</span>
                    </h3>
                </div>

                <div
                    style={{
                        position: 'relative',
                        padding: '1px',
                        background: 'linear-gradient(45deg, #5fd6fe, #2079eb)',
                        borderRadius: '40px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}
                >
                    <div style={{
                        background: '#ffffff',
                        padding: '60px 40px',
                        borderRadius: '39px',
                        textAlign: 'center',
                    }}>
                        <h4
                            style={{
                                fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)',
                                fontWeight: 800,
                                ...gradientStyle,
                                marginBottom: '20px'
                            }}
                        >
                            Nosotros nos encargamos de eso.
                        </h4>
                        <p
                            style={{
                                fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                                fontWeight: 500,
                                color: '#000000',
                                maxWidth: '800px',
                                margin: '0 auto',
                                lineHeight: 1.5
                            }}
                        >
                            Actuamos como una <span style={{ fontWeight: 800 }}>extensión de tu negocio</span>, proporcionándote una <span style={{ fontWeight: 800 }}>ventaja competitiva continua</span> y la certeza de que tu empresa trabaja siempre con <span style={{ fontWeight: 800 }}>lo último en IA</span>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
