import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    title: string;
    description: string;
    type: 'magnetic' | 'aura' | 'network' | 'bubbles';
}

const BackgroundCard: React.FC<CardProps> = ({ title, description, type }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let mouse = { x: -100, y: -100 };

        const init = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        // --- Animation Logics ---
        const drawMagnetic = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const spacing = 20;
            for (let x = spacing; x < canvas.width; x += spacing) {
                for (let y = spacing; y < canvas.height; y += spacing) {
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    const force = Math.min(20, 1000 / dist);

                    ctx.strokeStyle = `rgba(32, 121, 235, ${Math.min(0.5, force / 10)})`;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + Math.cos(angle) * force, y + Math.sin(angle) * force);
                    ctx.stroke();
                }
            }
        };

        const drawAura = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
            gradient.addColorStop(0, 'rgba(95, 214, 254, 0.4)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const particles: any[] = [];
        const initNetwork = () => {
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1
                });
            }
        };

        const drawNetwork = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.fillStyle = 'rgba(32, 121, 235, 0.5)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Connect to mouse
                const dxm = mouse.x - p.x;
                const dym = mouse.y - p.y;
                if (Math.sqrt(dxm * dxm + dym * dym) < 80) {
                    ctx.strokeStyle = 'rgba(32, 121, 235, 0.2)';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 50) {
                        ctx.strokeStyle = `rgba(32, 121, 235, ${1 - dist / 50})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
        };

        const bubbles: any[] = [];
        const initBubbles = () => {
            for (let i = 0; i < 15; i++) {
                bubbles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 20 + 5,
                    vy: -Math.random() * 0.5 - 0.1
                });
            }
        };

        const drawBubbles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(b => {
                b.y += b.vy;
                if (b.y < -b.r) b.y = canvas.height + b.r;

                const dx = mouse.x - b.x;
                const dy = mouse.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const shiftX = dist < 100 ? (dx / dist) * -10 : 0;

                ctx.fillStyle = 'rgba(95, 214, 254, 0.15)';
                ctx.beginPath();
                ctx.arc(b.x + shiftX, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        if (type === 'network') initNetwork();
        if (type === 'bubbles') initBubbles();

        const animate = () => {
            if (type === 'magnetic') drawMagnetic();
            if (type === 'aura') drawAura();
            if (type === 'network') drawNetwork();
            if (type === 'bubbles') drawBubbles();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [type]);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid #f0f0f0',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div style={{ height: '160px', background: '#f8faff', borderRadius: '16px', overflow: 'hidden' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: '1.4' }}>{description}</p>
            </div>
        </motion.div>
    );
};

const BackgroundShowcase: React.FC = () => {
    return (
        <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Variantes de Interacción</h2>
                <p style={{ color: 'var(--text-gray)' }}>Desliza el mouse sobre las tarjetas para probar diferentes efectos de fondo.</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px'
            }}>
                <BackgroundCard
                    type="magnetic"
                    title="Magnetic Grid"
                    description="Líneas que se orientan y atraen hacia la posición del cursor."
                />
                <BackgroundCard
                    type="aura"
                    title="Aura Glow"
                    description="Un suave resplandor gradiente que ilumina el área cercana al mouse."
                />
                <BackgroundCard
                    type="network"
                    title="Neural Network"
                    description="Partículas conectadas por hilos que reaccionan al movimiento."
                />
                <BackgroundCard
                    type="bubbles"
                    title="Floating Bubbles"
                    description="Esferas translúcidas que se desplazan ante la presencia del puntero."
                />
            </div>
        </section>
    );
};

export default BackgroundShowcase;
