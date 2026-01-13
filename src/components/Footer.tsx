import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowUpRight, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
    onAdminClick: () => void;
    onNavigate: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onNavigate }) => {
    const currentYear = new Date().getFullYear();
    const blueGradient = 'linear-gradient(45deg, #5fd6fe, #2079eb)';

    const footerSections = [
        {
            title: 'Navegación',
            links: [
                { name: 'Servicios', id: 'services-section' },
                { name: 'Casos de Éxito', id: 'case-studies-section' },
                { name: 'Inversión', id: 'investment-section' },
                { name: 'Agendar Llamada', id: 'booking-section' }
            ]
        },
        {
            title: 'Contacto',
            links: [
                { name: 'soporte@automatizate.ar', url: 'mailto:soporte@automatizate.ar', icon: <Mail size={16} /> },
                { name: '+54 9 221 679-3522', url: 'https://wa.me/+5492216793522', icon: <Phone size={16} /> },
                { name: 'WhatsApp', url: 'https://wa.me/+5492216793522', icon: <MessageCircle size={16} /> }
            ]
        }
    ];

    return (
        <footer style={{
            background: '#ffffff',
            padding: '80px 20px 30px 20px',
            color: '#4b5563',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid #f1f5f9'
        }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(32,121,235,0.03) 0%, transparent 70%)',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>

                    {/* Brand Info */}
                    <div style={{ flex: '1.2' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: '#1d1d1f',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <img
                                src="/logo.png"
                                alt="Logo"
                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                            />
                            <span style={{
                                marginLeft: '-6px',
                                background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 900,
                                fontSize: '1.2rem'
                            }}>
                                utomatizate
                            </span>
                        </div>
                        <p style={{ lineHeight: 1.6, color: '#64748b', maxWidth: '340px', fontSize: '0.95rem' }}>
                            El futuro de las empresas no es humano vs IA, es humano impulsado por IA. Nosotros construimos ese puente.
                        </p>
                        <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <a href="mailto:soporte@automatizate.ar" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#2079eb'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                                <Mail size={22} />
                            </a>
                            <a href="https://wa.me/+5492216793522" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#25D366'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                                <MessageCircle size={22} />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section, idx) => (
                        <div key={idx}>
                            <h4 style={{ color: '#1d1d1f', fontWeight: 800, marginBottom: '24px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section.title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {section.links.map((link: any, lIdx) => (
                                    <li key={lIdx} style={{ marginBottom: '14px' }}>
                                        {link.id ? (
                                            <button
                                                onClick={() => onNavigate(link.id!)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#64748b',
                                                    cursor: 'pointer',
                                                    fontSize: '0.95rem',
                                                    padding: 0,
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s',
                                                    fontWeight: 500,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.color = '#2079eb';
                                                    e.currentTarget.style.transform = 'translateX(5px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.color = '#64748b';
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                <ArrowUpRight size={14} style={{ opacity: 0.5 }} /> {link.name}
                                            </button>
                                        ) : (
                                            <a
                                                href={link.url}
                                                target={link.url.startsWith('http') ? "_blank" : undefined}
                                                rel={link.url.startsWith('http') ? "noopener noreferrer" : undefined}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#64748b',
                                                    fontSize: '0.95rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    transition: 'color 0.2s',
                                                    fontWeight: 500
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.color = '#2079eb'}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                                            >
                                                <span style={{ color: '#2079eb', opacity: 0.8 }}>{link.icon}</span> {link.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* CTA Small */}
                    <div>
                        <h4 style={{ color: '#1d1d1f', fontWeight: 800, marginBottom: '24px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trabajamos Juntos</h4>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 500 }}>
                            ¿Listo para tener la IA trabajando para tu empresa?
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(32,121,235,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('booking-section')}
                            style={{
                                background: blueGradient,
                                color: '#fff',
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                boxShadow: '0 4px 15px rgba(32,121,235,0.1)'
                            }}
                        >
                            Agendar Ahora <ArrowUpRight size={18} />
                        </motion.button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                        © {currentYear} Automatizate.ar | IA & Automatización
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <button
                            onClick={onAdminClick}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#e2e8f0',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#94a3b8'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#e2e8f0'}
                        >
                            Panel de Control
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
