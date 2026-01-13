import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const blueGradient = 'linear-gradient(45deg, #5fd6fe, #2079eb)';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Specific credentials as requested
        setTimeout(() => {
            if (username === 'Automatizate2026' && password === 'Automatizateweb2026!') {
                onLoginSuccess();
            } else {
                setError('Credenciales incorrectas. Verifique usuario y contraseña.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            color: '#1d1d1f',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    background: 'none',
                    border: 'none',
                    color: '#4b5563',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    padding: '10px'
                }}
            >
                <ArrowLeft size={20} /> Volver
            </motion.button>

            {/* Background Decoration */}
            <div style={{
                position: 'fixed',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(32,121,235,0.06) 0%, transparent 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    background: '#ffffff',
                    borderRadius: '32px',
                    padding: '48px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    position: 'relative'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(32,121,235,0.05)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#2079eb'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#1d1d1f' }}>Área de Desarrollo</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Automatizate Panel de Control</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '14px',
                                padding: '16px 16px 16px 48px',
                                color: '#1d1d1f',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, background-color 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2079eb';
                                e.target.style.backgroundColor = '#ffffff';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '14px',
                                padding: '16px 48px 16px 48px',
                                color: '#1d1d1f',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, background-color 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2079eb';
                                e.target.style.backgroundColor = '#ffffff';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#ff4b4b',
                                    fontSize: '0.85rem',
                                    background: 'rgba(255,75,75,0.1)',
                                    padding: '10px 14px',
                                    borderRadius: '10px'
                                }}
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        style={{
                            background: blueGradient,
                            color: 'white',
                            border: 'none',
                            padding: '18px',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: isLoading ? 'default' : 'pointer',
                            marginTop: '10px',
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: '0 10px 20px rgba(32,121,235,0.2)'
                        }}
                    >
                        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
