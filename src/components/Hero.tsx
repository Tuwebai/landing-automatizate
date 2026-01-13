import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for blur circles
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Neural Network Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // --- PARAMETROS PARA AJUSTAR EL FONDO ---
    // Modifica estos valores para cambiar cómo se ve el fondo:
    const particleCount = 120;       // Cantidad de puntos (más puntos = fondo más lleno)
    const connectionDistance = 150;  // Distancia máxima para que dos puntos se conecten
    const mouseConnectionDistance = 250; // Distancia para conectar puntos con el mouse
    const particleOpacity = 0.15;     // Visibilidad de los puntos (0.1 a 1.0)
    const lineOpacity = 0.15;         // Visibilidad de las líneas (0.1 a 1.0)
    const lineWidth = 1.0;           // Grosor de las líneas
    const particleSize = 2.5;        // Tamaño de los puntos
    // ----------------------------------------

    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * particleSize + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(32, 121, 235, ${particleOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        const dxm = mouse.x - particles[i].x;
        const dym = mouse.y - particles[i].y;
        const distanceMouse = Math.sqrt(dxm * dxm + dym * dym);

        if (distanceMouse < mouseConnectionDistance) {
          ctx.strokeStyle = `rgba(32, 121, 235, ${lineOpacity * (1 - distanceMouse / mouseConnectionDistance)})`;
          ctx.lineWidth = lineWidth * 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        for (let i2 = i + 1; i2 < particles.length; i2++) {
          const dx = particles[i].x - particles[i2].x;
          const dy = particles[i].y - particles[i2].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(32, 121, 235, ${lineOpacity * 0.5 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[i2].x, particles[i2].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const x = (e.clientX - window.innerWidth / 2) / 10;
      const y = (e.clientY - window.innerHeight / 2) / 10;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  return (
    <section id="hero-section" className="hero-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      <div className="hero-background">
        <motion.div
          className="blur-circle"
          style={{
            x: smoothX,
            y: smoothY,
            top: '20%',
            left: '30%'
          }}
        />
        <motion.div
          className="blur-circle"
          style={{
            x: smoothY,
            y: smoothX,
            bottom: '10%',
            right: '20%',
            backgroundColor: '#2079eb33' // Increased to 0.2
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          className="gradient-text"
          style={{
            fontSize: 'clamp(2.5rem, 12vw, 7rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            fontWeight: 800
          }}
        >
          Automatizate
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(0.9rem, 3.5vw, 1.25rem)',
            color: '#000000', // Changed to black
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 500, // Medium weight for better legibility on clean background
            lineHeight: 1.6
          }}
        >
          Donde tu negocio implementa el potencial de lo ultimo en IA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}
        >
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            letterSpacing: '0.05em'
          }}>
            CONOCENOS
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="url(#arrowGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary-light)" />
                  <stop offset="100%" stopColor="var(--primary-dark)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
