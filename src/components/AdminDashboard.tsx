import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
    Calendar, Save,
    LogOut, Trash2, ExternalLink, RefreshCw,
    Settings, Users, X, Clock
} from 'lucide-react';

interface AvailabilityData {
    [key: string]: {
        enabled: boolean;
        slots: string[];
    };
}

interface Booking {
    id: string;
    created_at: string;
    booking_date: string;
    booking_time: string;
    name: string;
    business_name: string;
    social_media: string;
    phone: string;
    has_investment: boolean;
    status: string;
}

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' }
];

const DEFAULT_AVAILABILITY: AvailabilityData = {
    monday: { enabled: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    tuesday: { enabled: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    wednesday: { enabled: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    thursday: { enabled: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    friday: { enabled: true, slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] }
};

interface TimeSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (time: string) => void;
    dayName: string;
}

const TimeSelectorModal: React.FC<TimeSelectorModalProps> = ({ isOpen, onClose, onConfirm, dayName }) => {
    const [selectedTime, setSelectedTime] = useState("12:00");

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                style={{
                    background: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d1d1f' }}>Añadir horario para {dayName}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Selecciona la hora de inicio
                    </label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc',
                        padding: '16px 24px', borderRadius: '16px', border: '1px solid #e2e8f0'
                    }}>
                        <Clock size={20} color="#2079eb" />
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            style={{
                                border: 'none', background: 'none', outline: 'none', fontSize: '1.5rem',
                                fontWeight: 800, color: '#1d1d1f', width: '100%'
                            }}
                        />
                    </div>
                    <p style={{ marginTop: '12px', color: '#64748b', fontSize: '0.85rem' }}>
                        * La sesión tendrá una duración automática de 1 hora.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#1d1d1f', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(selectedTime)}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
                            background: 'linear-gradient(45deg, #5fd6fe, #2079eb)', color: '#fff',
                            fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px rgba(32,121,235,0.2)'
                        }}
                    >
                        Añadir
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'config' | 'bookings'>('config');
    const [availability, setAvailability] = useState<AvailabilityData | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayForModal, setSelectedDayForModal] = useState<{ id: string, name: string } | null>(null);

    const blueGradient = 'linear-gradient(45deg, #5fd6fe, #2079eb)';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: settingsData } = await supabase
                .from('lndng_settings')
                .select('value')
                .eq('key', 'availability')
                .single();

            if (settingsData) {
                setAvailability(settingsData.value);
            } else {
                setAvailability(DEFAULT_AVAILABILITY);
            }

            const { data: bookingsData } = await supabase
                .from('lndng_calls')
                .select('*')
                .order('booking_date', { ascending: true });

            if (bookingsData) setBookings(bookingsData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAvailability = async () => {
        if (!availability) return;
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const { error } = await supabase
                .from('lndng_settings')
                .upsert({ key: 'availability', value: availability });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Configuración guardada' });
        } catch (err) {
            console.error('Error saving availability:', err);
            setMessage({ type: 'error', text: 'Error al guardar la configuración' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const updateDayAvailability = (dayId: string, enabled: boolean) => {
        const current = availability || DEFAULT_AVAILABILITY;
        setAvailability({
            ...current,
            [dayId]: { ...current[dayId], enabled }
        });
    };

    const openAddModal = (dayId: string, dayName: string) => {
        setSelectedDayForModal({ id: dayId, name: dayName });
        setIsModalOpen(true);
    };

    const confirmAddSlot = (time: string) => {
        if (!selectedDayForModal || !availability) return;
        const dayId = selectedDayForModal.id;
        const currentDay = availability[dayId] || { enabled: true, slots: [] };

        if (currentDay.slots.includes(time)) {
            setMessage({ type: 'error', text: 'Este horario ya existe para este día' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        const sortedSlots = [...currentDay.slots, time].sort();
        setAvailability({
            ...availability,
            [dayId]: { ...currentDay, slots: sortedSlots }
        });

        setIsModalOpen(false);
        setSelectedDayForModal(null);
    };

    const removeSlot = (dayId: string, slot: string) => {
        if (!availability) return;
        const currentDay = availability[dayId];
        if (!currentDay) return;

        setAvailability({
            ...availability,
            [dayId]: {
                ...currentDay,
                slots: currentDay.slots.filter(s => s !== slot)
            }
        });
    };

    const updateSlotTime = (dayId: string, oldSlot: string, newTime: string) => {
        if (!availability) return;
        const currentDay = availability[dayId];
        if (!currentDay) return;

        // Check if new time already exists (unless it's the same slot being edited)
        if (newTime !== oldSlot && currentDay.slots.includes(newTime)) {
            return; // Simply prevent duplicate
        }

        const newSlots = currentDay.slots.map(s => s === oldSlot ? newTime : s).sort();
        setAvailability({
            ...availability,
            [dayId]: { ...currentDay, slots: newSlots }
        });
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw className="animate-spin" size={40} color="#2079eb" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>

            <TimeSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmAddSlot}
                dayName={selectedDayForModal?.name || ''}
            />

            {/* Simple Sidebar */}
            <aside style={{
                width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', padding: '32px 20px',
                position: 'fixed', height: '100vh', zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', padding: '0 12px' }}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: '#1d1d1f',
                        letterSpacing: '-0.02em',
                        marginLeft: '-6px',
                        background: 'linear-gradient(45deg, #2079eb, #5fd6fe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        utomatizate
                    </span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button
                        onClick={() => setActiveTab('config')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                            border: 'none', background: activeTab === 'config' ? 'rgba(32,121,235,0.05)' : 'transparent',
                            color: activeTab === 'config' ? '#2079eb' : '#64748b', cursor: 'pointer',
                            fontWeight: activeTab === 'config' ? 700 : 500, transition: 'all 0.2s', textAlign: 'left'
                        }}
                    >
                        <Settings size={20} /> Configuración
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                            border: 'none', background: activeTab === 'bookings' ? 'rgba(32,121,235,0.05)' : 'transparent',
                            color: activeTab === 'bookings' ? '#2079eb' : '#64748b', cursor: 'pointer',
                            fontWeight: activeTab === 'bookings' ? 700 : 500, transition: 'all 0.2s', textAlign: 'left'
                        }}
                    >
                        <Users size={20} /> Llamadas Agendadas
                    </button>
                </nav>

                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                        border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer',
                        fontWeight: 600, transition: 'all 0.2s', marginTop: 'auto'
                    }}
                >
                    <LogOut size={20} /> Cerrar Sesión
                </button>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '48px 60px' }}>

                {/* Save Message Float */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                position: 'fixed', bottom: '40px', right: '40px',
                                background: message.type === 'success' ? '#10b981' : '#ef4444',
                                color: '#fff', padding: '16px 32px', borderRadius: '16px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 100, fontWeight: 700
                            }}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {activeTab === 'config' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>Configuración</h1>
                                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Gestiona tu disponibilidad y horarios de atención.</p>
                                </div>
                                <button
                                    onClick={handleSaveAvailability}
                                    disabled={isSaving}
                                    style={{
                                        background: blueGradient, color: '#fff', border: 'none',
                                        padding: '14px 28px', borderRadius: '14px', fontWeight: 800,
                                        fontSize: '1rem', cursor: isSaving ? 'default' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        boxShadow: '0 10px 20px rgba(32,121,235,0.2)', opacity: isSaving ? 0.7 : 1
                                    }}
                                >
                                    <Save size={20} /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {DAYS.map(day => {
                                    const dayConfig = availability?.[day.id] || { enabled: false, slots: [] };
                                    return (
                                        <div key={day.id} style={{
                                            background: '#fff', padding: '24px', borderRadius: '24px',
                                            border: '1px solid #e2e8f0', transition: 'all 0.3s'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: dayConfig.enabled ? '24px' : 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <button
                                                        onClick={() => updateDayAvailability(day.id, !dayConfig.enabled)}
                                                        style={{
                                                            width: '50px', height: '28px', borderRadius: '20px',
                                                            background: dayConfig.enabled ? '#2079eb' : '#e2e8f0',
                                                            border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                                                            position: 'absolute', top: '4px', left: dayConfig.enabled ? '26px' : '4px',
                                                            transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }} />
                                                    </button>
                                                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: dayConfig.enabled ? '#1d1d1f' : '#94a3b8' }}>
                                                        {day.name}
                                                    </span>
                                                </div>
                                                {dayConfig.enabled && (
                                                    <button
                                                        onClick={() => openAddModal(day.id, day.name)}
                                                        style={{ background: 'rgba(32,121,235,0.05)', border: 'none', color: '#2079eb', padding: '8px 16px', borderRadius: '100px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                                                    >
                                                        + Añadir horario
                                                    </button>
                                                )}
                                            </div>

                                            {dayConfig.enabled && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                    {dayConfig.slots.length > 0 ? dayConfig.slots.map((slot, sIdx) => (
                                                        <div key={sIdx} style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0'
                                                        }}>
                                                            <input
                                                                type="time"
                                                                value={slot}
                                                                onChange={(e) => updateSlotTime(day.id, slot, e.target.value)}
                                                                style={{ border: 'none', outline: 'none', background: 'none', fontWeight: 700, color: '#1d1d1f', fontSize: '0.95rem' }}
                                                            />
                                                            <button
                                                                onClick={() => removeSlot(day.id, slot)}
                                                                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', padding: 0 }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )) : (
                                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No hay horarios para este día</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ marginBottom: '40px' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>Llamadas Agendadas</h1>
                                <p style={{ color: '#64748b', fontSize: '1rem' }}>Gestiona tus prospectos como una lista de tareas. Marca las llamadas como completadas para organizarte mejor.</p>
                            </div>

                            {/* PENDING TABLE */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Clock size={20} color="#2079eb" /> Llamadas Pendientes
                                    <span style={{ fontSize: '0.85rem', background: 'rgba(32,121,235,0.1)', color: '#2079eb', padding: '4px 10px', borderRadius: '100px' }}>
                                        {bookings.filter(b => b.status !== 'completed').length}
                                    </span>
                                </h2>

                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {bookings.filter(b => b.status !== 'completed').length > 0 ? bookings.filter(b => b.status !== 'completed').map(booking => (
                                        <div key={booking.id} style={{
                                            background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0',
                                            display: 'flex', gap: '20px', alignItems: 'flex-start'
                                        }}>
                                            <button
                                                onClick={async () => {
                                                    const { error } = await supabase.from('lndng_calls').update({ status: 'completed' }).eq('id', booking.id);
                                                    if (!error) setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'completed' } : b));
                                                }}
                                                style={{
                                                    width: '24px', height: '24px', borderRadius: '6px', border: '2px solid #e2e8f0',
                                                    background: 'none', cursor: 'pointer', marginTop: '4px', flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#2079eb')}
                                                onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2079eb', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                            <Calendar size={14} /> {new Date(booking.booking_date).toLocaleDateString()} — {booking.booking_time.slice(0, 5)}hs
                                                        </div>
                                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d1d1f' }}>{booking.name}</h3>
                                                        <p style={{ color: '#64748b', fontWeight: 500 }}>{booking.business_name}</p>
                                                    </div>
                                                    <div style={{
                                                        padding: '8px 16px', borderRadius: '100px',
                                                        background: booking.has_investment ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        color: booking.has_investment ? '#10b981' : '#ef4444',
                                                        fontSize: '0.8rem', fontWeight: 800
                                                    }}>
                                                        {booking.has_investment ? 'Inversión Confirmada' : 'Sin Inversión'}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Redes Sociales</span>
                                                        <div style={{ color: '#1d1d1f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <ExternalLink size={14} color="#64748b" /> {booking.social_media || 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Teléfono</span>
                                                        <div style={{ color: '#1d1d1f', fontWeight: 600 }}>📲 {booking.phone}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ textAlign: 'center', padding: '40px 0', background: 'transparent', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                                            <p style={{ color: '#94a3b8', fontWeight: 600 }}>No hay llamadas pendientes</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COMPLETED TABLE */}
                            <div>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    Llamadas Realizadas
                                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '100px' }}>
                                        {bookings.filter(b => b.status === 'completed').length}
                                    </span>
                                </h2>

                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {bookings.filter(b => b.status === 'completed').length > 0 ? bookings.filter(b => b.status === 'completed').map(booking => (
                                        <div key={booking.id} style={{
                                            background: 'rgba(248, 250, 252, 0.5)', padding: '16px 24px', borderRadius: '20px', border: '1px solid #e2e8f0',
                                            display: 'flex', gap: '16px', alignItems: 'center', opacity: 0.7
                                        }}>
                                            <button
                                                onClick={async () => {
                                                    const { error } = await supabase.from('lndng_calls').update({ status: 'pending' }).eq('id', booking.id);
                                                    if (!error) setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'pending' } : b));
                                                }}
                                                style={{
                                                    width: '22px', height: '22px', borderRadius: '6px', border: 'none',
                                                    background: '#10b981', cursor: 'pointer', flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Save size={14} color="#fff" />
                                            </button>

                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontWeight: 700, color: '#1d1d1f', marginRight: '12px' }}>{booking.name}</span>
                                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{booking.business_name} • {new Date(booking.booking_date).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>COMPLETADA</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>No has marcado ninguna llamada como realizada todavía</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
