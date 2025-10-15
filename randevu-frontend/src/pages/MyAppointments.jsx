import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Button, Spinner, Alert, Modal, Badge, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

// --- GEREKLİ BİLEŞENLER DOĞRUDAN BURAYA EKLENDİ ---

// 1. StarRating Bileşeni
function StarRating({ totalStars = 5, initialRating = 0, onRate, size = 24, editable = true }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const handleClick = (rate) => {
        if (!editable) return;
        setRating(rate);
        if (onRate) onRate(rate);
    };
    return (
        <div>
            {[...Array(totalStars)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        style={{
                            cursor: editable ? 'pointer' : 'default',
                            fontSize: `${size}px`,
                            color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'
                        }}
                        onMouseEnter={() => editable && setHover(ratingValue)}
                        onMouseLeave={() => editable && setHover(0)}
                        onClick={() => handleClick(ratingValue)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}


// 2. Sayfaya Özel Stiller
const MyAppointmentsStyles = () => (
    <style>{`
        .appointments-page {
          padding: 1rem;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        .page-header h1 {
          font-weight: 700;
          color: #212529;
        }
        .appointment-item-card {
          display: flex;
          align-items: stretch;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .appointment-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            border-color: #0d6efd;
        }
        .card-date-section {
            background-color: #0d6efd;
            color: white;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            width: 120px;
            min-width: 120px;
        }
        .date-day {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1;
        }
        .date-month-year {
            font-size: 0.9rem;
            text-transform: uppercase;
            font-weight: 500;
        }
        .card-details {
            padding: 1.5rem;
            flex-grow: 1;
        }
        .card-details h5 {
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .card-details p {
            color: #6c757d;
            margin-bottom: 0.3rem;
            display: flex;
            align-items: center;
        }
        .card-details p svg {
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        .card-actions {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            min-width: 150px;
        }
    `}</style>
);


// --- İKONLAR ---
const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>;

// --- DURUM ETİKETİ BİLEŞENİ ---
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { variant: 'warning', text: 'Onay Bekliyor' },
        confirmed: { variant: 'success', text: 'Onaylandı' },
        completed: { variant: 'primary', text: 'Tamamlandı' },
        cancelled: { variant: 'danger', text: 'İptal Edildi' },
        rejected: { variant: 'dark', text: 'Reddedildi' },
    };
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge pill bg={config.variant}>{config.text}</Badge>;
};

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [currentRating, setCurrentRating] = useState(0);

    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/my-appointments', apiHeaders);
            setAppointments(response.data.data);
        } catch (err) { setError('Randevularınız yüklenirken bir hata oluştu.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}`, apiHeaders);
                fetchAppointments();
            } catch (err) { alert('Randevu iptal edilirken bir hata oluştu.'); }
        }
    };

    const openRateModal = (appointment) => { setSelectedAppointment(appointment); setShowRateModal(true); setCurrentRating(0); };
    const closeRateModal = () => setShowRateModal(false);
    const handleRateSubmit = async () => {
        if (currentRating === 0) { alert('Lütfen 1-5 arası bir puan verin.'); return; }
        try {
            await axios.post('http://127.0.0.1:8000/api/reviews', {
                appointment_id: selectedAppointment.id,
                rating: currentRating,
            }, apiHeaders);
            closeRateModal();
            fetchAppointments();
        } catch (err) { alert(err.response?.data?.error || 'Puanlama sırasında bir hata oluştu.'); }
    };

    return (
        <>
            <MyAppointmentsStyles />
            <Container className="appointments-page">
                <div className="page-header">
                    <h1>Randevularım</h1>
                    <Button as={NavLink} to="/randevu-al" size="lg" variant="primary">Yeni Randevu Oluştur</Button>
                </div>

                {loading && <div className="text-center"><Spinner animation="border" /></div>}
                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && appointments.length > 0 ? (
                    <div>
                        {appointments.map(app => {
                            const appointmentDate = new Date(app.start_time);
                            const day = appointmentDate.getDate();
                            const month = appointmentDate.toLocaleString('tr-TR', { month: 'short' });
                            const year = appointmentDate.getFullYear();
                            const time = appointmentDate.toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                            const isCompleted = app.status === 'completed';
                            const isReviewed = !!app.review;
                            const isCancelable = app.status === 'pending' || app.status === 'confirmed';

                            return (
                                <div className="appointment-item-card" key={app.id}>
                                    <div className="card-date-section">
                                        <div className="date-day">{day}</div>
                                        <div className="date-month-year">{month} '{year.toString().slice(-2)}</div>
                                    </div>
                                    <div className="card-details">
                                        <h5>{app.service.name}</h5>
                                        <p><PersonIcon /> {app.personal.name} {app.personal.surname}</p>
                                        <p><ClockIcon /> {time}</p>
                                    </div>
                                    <div className="card-actions">
                                        <div className="mb-2"><StatusBadge status={app.status} /></div>

                                        {isCompleted && !isReviewed && (
                                            <Button variant="outline-warning" size="sm" onClick={() => openRateModal(app)}>Puanla ★</Button>
                                        )}
                                        {isReviewed && (
                                            <div className="text-center">
                                                <small className="d-block text-muted mb-1">Puanınız</small>
                                                <StarRating initialRating={app.review.rating} editable={false} size={22} />
                                            </div>
                                        )}
                                        {isCancelable && (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleCancel(app.id)}>
                                                İptal Et
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    !loading && <div className="text-center p-5 bg-white rounded shadow-sm"><h4 className="text-muted">Henüz bir randevunuz bulunmuyor.</h4></div>
                )}

                <Modal show={showRateModal} onHide={closeRateModal} centered>
                    <Modal.Header closeButton><Modal.Title>Personeli Değerlendir</Modal.Title></Modal.Header>
                    <Modal.Body className="text-center">
                        <p><strong>{selectedAppointment?.personal.name} {selectedAppointment?.personal.surname}</strong> için hizmet deneyiminizi puanlayın.</p>
                        <StarRating onRate={setCurrentRating} size={36} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeRateModal}>Vazgeç</Button>
                        <Button variant="primary" onClick={handleRateSubmit}>Puanı Gönder</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default MyAppointments;

