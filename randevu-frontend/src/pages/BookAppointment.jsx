import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
    const [personnel, setPersonnel] = useState([]);
    const [services, setServices] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    const [selectedPersonnel, setSelectedPersonnel] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState('');

    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [personnelRes, servicesRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/personnel', apiHeaders),
                    axios.get('http://127.0.0.1:8000/api/services', apiHeaders)
                ]);
                setPersonnel(personnelRes.data.data);
                setServices(servicesRes.data.data);
            } catch (err) {
                setError('Gerekli veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedPersonnel && selectedService && selectedDate) {
            const fetchSlots = async () => {
                setSlotsLoading(true);
                setAvailableSlots([]);
                setSelectedSlot('');
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/staff/${selectedPersonnel}/available-slots`, {
                        params: { date: selectedDate, service_id: selectedService },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAvailableSlots(response.data.slots);
                } catch (err) {
                    setError('Müsait saatler alınamadı.');
                } finally {
                    setSlotsLoading(false);
                }
            };
            fetchSlots();
        }
    }, [selectedPersonnel, selectedService, selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPersonnel || !selectedService || !selectedDate || !selectedSlot) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        const startTime = `${selectedDate} ${selectedSlot}:00`;
        try {
            await axios.post('http://127.0.0.1:8000/api/appointments', {
                personal_id: selectedPersonnel,
                service_id: selectedService,
                start_time: startTime,
            }, apiHeaders);
            alert('Randevunuz başarıyla oluşturuldu!');
            navigate('/randevularim');
        } catch (err) {
            if (err.response?.status === 409) {
                alert('Üzgünüz, siz seçerken bu saat doldu. Lütfen başka bir saat seçin.');
                const event = { target: { value: selectedDate } };
                setSelectedDate(event.target.value);
            } else {
                alert('Randevu oluşturulurken bir hata oluştu.');
            }
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1>Yeni Randevu Oluştur</h1>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Label>1. Personel Seçin</Form.Label>
                                <Form.Select onChange={(e) => setSelectedPersonnel(e.target.value)} value={selectedPersonnel}>
                                    <option>-- Personel --</option>
                                    {personnel.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} {p.surname}
                                            {p.reviews_avg_rating ? ` (${parseFloat(p.reviews_avg_rating).toFixed(1)} ★)` : ''}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>2. Hizmet Seçin</Form.Label>
                                <Form.Select onChange={(e) => setSelectedService(e.target.value)} value={selectedService}>
                                    <option>-- Hizmet --</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price} TL)</option>)}
                                </Form.Select>
                            </Col>
                        </Row>

                        {selectedPersonnel && selectedService && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>3. Tarih Seçin</Form.Label>
                                    <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>4. Müsait Saatler</Form.Label>
                                    <div className="border p-3 rounded" style={{ minHeight: '100px' }}>
                                        {slotsLoading ? <Spinner animation="border" size="sm" /> :
                                            availableSlots.length > 0 ? (
                                                availableSlots.map(slot => (
                                                    <Button
                                                        key={slot}
                                                        variant={selectedSlot === slot ? 'primary' : 'outline-primary'}
                                                        className="me-2 mb-2"
                                                        onClick={() => setSelectedSlot(slot)}
                                                    >
                                                        {slot}
                                                    </Button>
                                                ))
                                            ) : <p>Bu tarih için uygun saat bulunamadı.</p>
                                        }
                                    </div>
                                </Form.Group>
                                <Button type="submit" className="mt-4" size="lg" disabled={!selectedSlot}>Randevuyu Onayla</Button>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default BookAppointment;