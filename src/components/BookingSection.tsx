import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ArrowRight, UserCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

declare global {
    interface Window {
        fbq: any;
    }
}

const BookingSection: React.FC = () => {
    // States
    const [availability, setAvailability] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1); // 1: Calendar, 2: Form, 3: Success
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [hasLocalBooking, setHasLocalBooking] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const LOCAL_BOOKING_KEY = 'has_booked_automatizate';

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        // Verifica si ya tiene agenda en este navegador
        if (typeof window !== 'undefined') {
            const savedBooking = localStorage.getItem(LOCAL_BOOKING_KEY);

            if (savedBooking) {
                try {
                    const parsedBooking = JSON.parse(savedBooking);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (parsedBooking?.bookingDate) {
                        const bookingDate = new Date(`${parsedBooking.bookingDate}T00:00:00`);

                        if (bookingDate >= today) {
                            setHasLocalBooking(true);
                        } else {
                            localStorage.removeItem(LOCAL_BOOKING_KEY);
                        }
                    } else {
                        localStorage.removeItem(LOCAL_BOOKING_KEY);
                    }
                } catch {
                    localStorage.removeItem(LOCAL_BOOKING_KEY);
                }
            }
        }
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        socialMedia: '',
        phone: '',
        hasInvestment: false
    });

    const blueGradient = 'linear-gradient(45deg, #5fd6fe, #2079eb)';
    const gradientText = {
        background: blueGradient,
        WebkitBackgroundClip: 'text' as const,
        WebkitTextFillColor: 'transparent' as const,
        display: 'inline-block' as const
    };
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentMonth = new Date();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const { data } = await supabase
                .from('lndng_settings')
                .select('value')
                .eq('key', 'availability')
                .single();
            if (data) setAvailability(data.value);
        } catch (err) {
            console.error('Error fetching availability:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookedSlotsForDate = async (date: Date) => {
        setIsLoading(true);
        try {
            // Generar string de fecha local YYYY-MM-DD sin errores de zona horaria
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const { data, error } = await supabase
                .from('lndng_calls')
                .select('booking_time')
                .eq('booking_date', dateStr);

            if (error) throw error;
            
            // Importante: La BD puede devolver "14:00:00". Comparamos solo los primeros 5 caracteres.
            if (data) {
                setBookedSlots(data.map(call => call.booking_time.substring(0, 5)));
            } else {
                setBookedSlots([]);
            }
        } catch (err) {
            console.error('Error fetching booked slots:', err);
            setBookedSlots([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateSelect = async (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
        setSelectedTime(null);
        await fetchBookedSlotsForDate(date);
    };

    const isDateAvailable = (day: number) => {
        if (!availability) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dayName = daysOfWeek[date.getDay()];
        return availability[dayName]?.enabled && date >= new Date(new Date().setHours(0, 0, 0, 0));
    };

    const getDaySlots = () => {
        if (!selectedDate || !availability) return [];
        const dayName = daysOfWeek[selectedDate.getDay()];
        return availability[dayName]?.slots || [];
    };

    const handleSubmitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (hasLocalBooking) {
            setError('Ya tenés una llamada agendada desde este dispositivo. Si querés modificarla, contactate con soporte.');
            return;
        }

        if (!formData.hasInvestment) {
            setError('Lo sentimos, se requiere contar con la inversión mínima especificada para agendar esta llamada estratégica.');
            return;
        }

        if (!selectedDate || !selectedTime) {
            setError('Por favor seleccioná una fecha y horario para continuar.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Check Si el telefono ya reservo:
            const { data: existingCalls, error: phoneError } = await supabase
                .from('lndng_calls')
                .select('id')
                .eq('phone', formData.phone)
                .limit(1);

            if (phoneError) {
                console.error("Error validando duplicados:", phoneError);
            } else if (existingCalls && existingCalls.length > 0) {
                setError('El número de teléfono provisto ya tiene una asesoría programada agendada. Contactate con nosotros si hubo un error.');
                setIsSubmitting(false);
                return;
            }

            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const { error: dbError } = await supabase
                .from('lndng_calls')
                .insert({
                    booking_date: dateStr,
                    booking_time: selectedTime,
                    name: formData.name,
                    business_name: formData.businessName,
                    social_media: formData.socialMedia,
                    phone: formData.phone,
                    has_investment: formData.hasInvestment
                });

            if (dbError) throw dbError;

            // Guardar localmente que ya agendó
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_BOOKING_KEY, JSON.stringify({
                    bookingDate: dateStr,
                    bookingTime: selectedTime
                }));
                setHasLocalBooking(true);
            }

            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Schedule');
            }

            setStep(3);
        } catch (err) {
            setError('Hubo un error al procesar tu agenda. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="booking-section" style={{
            padding: '40px 20px 120px 20px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 1 }}>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            color: '#ff3b30',
                            padding: '10px 24px',
                            borderRadius: '100px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '24px',
                            border: '1px solid rgba(255, 59, 48, 0.2)'
                        }}
                    >
                        <UserCheck size={18} />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Solo 10 cupos disponibles
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            color: '#1d1d1f',
                            marginBottom: '24px',
                            letterSpacing: '-0.02em',
                            textAlign: 'center'
                        }}
                    >
                        No te quedes atrás, <br />
                        <span style={gradientText}>sumá a nuestro equipo</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.2rem',
                            color: '#666',
                            maxWidth: '700px',
                            margin: '0 auto',
                            lineHeight: 1.6
                        }}
                    >
                        Selecciona un horario para tu llamada estratégica
                    </motion.p>

                    {windowWidth <= 968 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            style={{
                                marginTop: '40px',
                                background: '#f8fafc',
                                padding: '24px',
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'left',
                                maxWidth: '500px',
                                margin: '40px auto 0 auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1d1d1f' }}>Cupos disponibles</span>
                                <span style={{ fontWeight: 800, color: '#2079eb', fontSize: '1.1rem' }}>4 disponibles</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} style={{ height: '10px', borderRadius: '4px', background: i < 6 ? blueGradient : '#e2e8f0' }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Booking Interface */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '40px',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>

                    {/* Step Content Container */}
                    <div style={{ flex: '1', maxWidth: '600px', width: '100%', position: 'relative' }}>
                        {isLoading && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '32px' }}>
                                <Loader2 className="animate-spin" size={32} color="#2079eb" />
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '32px',
                                        padding: '40px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                                        border: '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <CalendarIcon size={24} color="#2079eb" />
                                    </div>

                                    {/* Calendar Grid - Responsive Gap & Font */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: windowWidth > 640 ? '10px' : '5px',
                                        marginBottom: '32px'
                                    }}>
                                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                            <div key={d} style={{ fontSize: windowWidth > 640 ? '0.8rem' : '0.7rem', fontWeight: 700, color: '#94a3b8', textAlign: 'center', paddingBottom: '8px' }}>
                                                {d}
                                            </div>
                                        ))}
                                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const available = isDateAvailable(day);
                                            const selected = selectedDate?.getDate() === day;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => available && handleDateSelect(day)}
                                                    style={{
                                                        aspectRatio: '1',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        background: selected ? blueGradient : (available ? '#f8fafc' : 'transparent'),
                                                        color: selected ? '#fff' : (available ? '#1d1d1f' : '#cbd5e1'),
                                                        fontWeight: (available || selected) ? 700 : 400,
                                                        cursor: available ? 'pointer' : 'default',
                                                        fontSize: windowWidth > 640 ? '0.95rem' : '0.85rem',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Time Slots */}
                                    {selectedDate && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#1d1d1f' }}>
                                                Horarios disponibles para el {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}:
                                            </h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                                                {getDaySlots().length > 0 ? getDaySlots().map((slot: string) => {
                                                    const isBooked = bookedSlots.includes(slot);
                                                    return (
                                                        <button
                                                            key={slot}
                                                            onClick={() => !isBooked && setSelectedTime(slot)}
                                                            disabled={isBooked}
                                                            style={{
                                                                padding: '12px',
                                                                borderRadius: '10px',
                                                                border: selectedTime === slot ? '2px solid #2079eb' : (isBooked ? '1px solid #f1f5f9' : '1px solid #e2e8f0'),
                                                                background: selectedTime === slot ? 'rgba(32,121,235,0.05)' : (isBooked ? '#f8fafc' : '#fff'),
                                                                color: selectedTime === slot ? '#2079eb' : (isBooked ? '#cbd5e1' : '#64748b'),
                                                                fontWeight: 700,
                                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                                textDecoration: isBooked ? 'line-through' : 'none',
                                                                transition: 'all 0.2s',
                                                                opacity: isBooked ? 0.7 : 1
                                                            }}
                                                        >
                                                            {slot}
                                                        </button>
                                                    );
                                                }) : (
                                                    <p style={{ gridColumn: '1/-1', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No hay horarios configurados para este día.</p>
                                                )}
                                            </div>

                                            {selectedTime && (
                                                <button
                                                    id="btn-continuar-agenda"
                                                    onClick={() => {
                                                        if (typeof window !== 'undefined' && window.fbq) {
                                                            window.fbq('track', 'Lead');
                                                        }
                                                        setStep(2);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '32px',
                                                        background: blueGradient,
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '16px',
                                                        borderRadius: '14px',
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        animation: 'fadeIn 0.3s ease-out'
                                                    }}
                                                >
                                                    <span style={{ pointerEvents: 'none' }}>Continuar</span>
                                                    <ArrowRight size={20} style={{ pointerEvents: 'none' }} />
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '32px',
                                        padding: '40px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                                        border: '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                            ← Volver
                                        </button>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Detalles del Agendado</h3>
                                    </div>

                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        marginBottom: '32px',
                                        display: 'flex',
                                        flexDirection: windowWidth > 500 ? 'row' : 'column',
                                        gap: windowWidth > 500 ? '20px' : '10px'
                                    }}>
                                        <div style={{ textAlign: windowWidth > 500 ? 'center' : 'left', flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Día</div>
                                            <div style={{ fontWeight: 800 }}>{selectedDate?.toLocaleDateString()}</div>
                                        </div>
                                        {windowWidth > 500 && <div style={{ width: '1px', background: '#e2e8f0' }} />}
                                        <div style={{ textAlign: windowWidth > 500 ? 'center' : 'left', flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Hora</div>
                                            <div style={{ fontWeight: 800 }}>{selectedTime}hs</div>
                                        </div>
                                        {windowWidth > 500 && <div style={{ width: '1px', background: '#e2e8f0' }} />}
                                        <div style={{ textAlign: windowWidth > 500 ? 'center' : 'left', flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Duración</div>
                                            <div style={{ fontWeight: 800 }}>1 hora</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#1d1d1f' }}>Nombre Completo</label>
                                            <input
                                                type="text" required
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ej: Juan Perez"
                                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#1d1d1f' }}>¿Cómo se llama tu negocio?</label>
                                            <input
                                                type="text" required
                                                value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                                placeholder="Ej: Automatizate IA"
                                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#1d1d1f' }}>Redes sociales del negocio (Opcional)</label>
                                            <input
                                                type="text"
                                                value={formData.socialMedia} onChange={e => setFormData({ ...formData, socialMedia: e.target.value })}
                                                placeholder="Instagram o LinkedIn"
                                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#1d1d1f' }}>Número de teléfono</label>
                                            <input
                                                type="tel" required
                                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Ej: +54 9 11..."
                                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{
                                            padding: '16px 20px',
                                            borderRadius: '16px',
                                            background: '#f8fafc',
                                            border: '2px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s'
                                        }} onClick={() => setFormData({ ...formData, hasInvestment: !formData.hasInvestment })}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{
                                                    minWidth: '24px', height: '24px', borderRadius: '6px',
                                                    border: '2px solid #2079eb', background: formData.hasInvestment ? blueGradient : '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                                                    boxShadow: formData.hasInvestment ? '0 4px 10px rgba(32,121,235,0.2)' : 'none'
                                                }}>
                                                    {formData.hasInvestment && <CheckCircle2 size={18} strokeWidth={3} />}
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1d1d1f', lineHeight: 1.3 }}>
                                                    Cuento con la inversión necesaria (Se especifica en el apartado Inversión)
                                                </span>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '8px', background: 'rgba(239,68,68,0.05)', padding: '12px', borderRadius: '10px' }}
                                            >
                                                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                                {error}
                                            </motion.div>
                                        )}

                                        <button
                                            id="btn-confirmar-agenda"
                                            disabled={isSubmitting}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (isSubmitting) return;
                                                
                                                // Validación manual (sin form nativo)
                                                if (!formData.name.trim() || !formData.businessName.trim() || !formData.phone.trim()) {
                                                    setError("Por favor completá los campos obligatorios: Nombre, Negocio y Teléfono.");
                                                    return;
                                                }
                                                
                                                handleSubmitBooking(e as any);
                                            }}
                                            style={{
                                                width: '100%',
                                                background: blueGradient,
                                                color: '#fff',
                                                border: 'none',
                                                padding: '18px',
                                                borderRadius: '14px',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                cursor: isSubmitting ? 'default' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                marginTop: '10px',
                                                opacity: isSubmitting ? 0.7 : 1
                                            }}
                                        >
                                            {isSubmitting && <Loader2 className="animate-spin" size={20} style={{ pointerEvents: 'none' }} />}
                                            <span style={{ pointerEvents: 'none' }}>Confirmar Agenda</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '32px',
                                        padding: '60px 40px',
                                        textAlign: 'center',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                                        border: '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{
                                        width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)',
                                        borderRadius: '50%', color: '#10b981', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                                    }}>
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>¡Llamada Agendada!</h3>
                                    <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
                                        Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto para los siguientes pasos.
                                    </p>
                                    <button
                                        onClick={() => setStep(1)}
                                        style={{ background: blueGradient, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '100px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Volver al calendario
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Side Info */}
                    <div style={{ flex: '0.8', maxWidth: '450px' }}>
                        {windowWidth > 968 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{
                                    minWidth: '56px', height: '56px', borderRadius: '18px',
                                    background: 'rgba(32,121,235,0.05)', color: '#2079eb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '1.2rem'
                                }}>1</div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>Primera llamada: Nos conocemos a fondo</h4>
                                    <p style={{ color: '#666', lineHeight: 1.5, fontSize: '0.9rem' }}>Evaluamos tu modelo de negocio, te presentamos a nuestro equipo de I+D y definimos cómo Automatizate potenciará tu empresa. En esta fase se realiza la reserva del cupo mediante la seña del 50% (498 USD).</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{
                                    minWidth: '56px', height: '56px', borderRadius: '18px',
                                    background: 'rgba(32,121,235,0.05)', color: '#2079eb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '1.2rem'
                                }}>2</div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>
                                        Segunda llamada: <span style={{ ...gradientText, fontWeight: 800 }}>¡Bienvenido a Automatizate!</span>
                                    </h4>
                                    <p style={{ color: '#666', lineHeight: 1.5, fontSize: '0.9rem' }}>Realizamos una inmersión total en los procesos de tu negocio, presentamos el plan de implementación final y ponemos en marcha los sistemas de IA diseñados a medida.</p>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Progress Bar / Availability Urgency - Hidden on Mobile (moved up) */}
                        {windowWidth > 968 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                style={{
                                    marginTop: '48px',
                                    background: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1d1d1f' }}>Cupos disponibles</span>
                                    <span style={{ fontWeight: 800, color: '#2079eb', fontSize: '1.1rem' }}>4 disponibles</span>
                                </div>

                                {/* Segmented Progress Bar */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(10, 1fr)',
                                    gap: '6px',
                                    marginBottom: '12px'
                                }}>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                height: '10px',
                                                borderRadius: '4px',
                                                background: i < 6 ? blueGradient : '#e2e8f0',
                                                boxShadow: i < 6 ? '0 2px 8px rgba(32,121,235,0.2)' : 'none'
                                            }}
                                        />
                                    ))}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                                    <span style={{ fontWeight: 600 }}>Actualizado hace 12 segundos</span>
                                </div>
                            </motion.div>
                        )}

                        {/* WhatsApp Alternative Contact */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                marginTop: '24px',
                                textAlign: 'center',
                                padding: '24px',
                                background: 'rgba(32,121,235,0.03)',
                                borderRadius: '24px',
                                border: '1px dashed rgba(32,121,235,0.2)'
                            }}
                        >
                            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 500 }}>
                                ¿No encontrás un horario disponible o preferís hablar por otro medio?
                            </p>
                            <a
                                id="btn-whatsapp-contact"
                                href="https://wa.me/+5492216793522"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    if (window.fbq) {
                                        window.fbq('track', 'Contact');
                                    }
                                }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: '#25D366', // WhatsApp Green
                                    color: '#fff',
                                    padding: '12px 24px',
                                    borderRadius: '100px',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 20px rgba(37,211,102,0.15)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Contactar por WhatsApp
                            </a>
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                                +54 9 221 679-3522
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Decorative Background Blobs */}
        </section>
    );
};

export default BookingSection;


