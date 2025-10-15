import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';

function ManageAvailability() {
    const [personnel, setPersonnel] = useState([]);
    const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
    const [availabilities, setAvailabilities] = useState([
        { day_of_week: 1, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 2, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 3, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 4, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 5, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 6, start_time: '09:00', end_time: '18:00', active: false },
        { day_of_week: 7, start_time: '09:00', end_time: '18:00', active: false },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };
    const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/users', apiHeaders);
                const staff = response.data.data.filter(user => user.role === 'personal' || user.role === 'admin');
                setPersonnel(staff);
            } catch (err) {
                setError('Personel listesi yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };
        fetchPersonnel();
    }, []);

    const handleAvailabilityChange = (day, field, value) => {
        const updatedAvailabilities = availabilities.map(avail =>
            avail.day_of_week === day ? { ...avail, [field]: value } : avail
        );
        setAvailabilities(updatedAvailabilities);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedPersonnelId) {
            setError('Lütfen bir personel seçin.');
            return;
        }

        const activeAvailabilities = availabilities
            .filter(avail => avail.active)
            .map(({ day_of_week, start_time, end_time }) => ({
                day_of_week, start_time, end_time
            }));

        // --- YENİ KONTROL ---
        // Eğer kullanıcı tüm günleri kapattıysa, boş göndermeden önce bir uyarı ver.
        if (activeAvailabilities.length === 0) {
            if (!window.confirm('Hiçbir çalışma günü seçmediniz. Bu personelin tüm çalışma takvimini silmek istediğinizden emin misiniz?')) {
                return; // Kullanıcı "Hayır" derse işlemi iptal et.
            }
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/staff/availability', {
                user_id: selectedPersonnelId,
                availabilities: activeAvailabilities,
            }, apiHeaders);
            setSuccess('Çalışma saatleri başarıyla güncellendi!');
        } catch (err) {
            setError('Güncelleme sırasında bir hata oluştu.');
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Row>
            <Col md={4}>
                <h2>Personel Seç</h2>
                <Form.Select onChange={(e) => setSelectedPersonnelId(e.target.value)} value={selectedPersonnelId}>
                    <option value="">Bir personel seçin...</option>
                    {personnel.map(p => <option key={p.id} value={p.id}>{p.name} {p.surname}</option>)}
                </Form.Select>
            </Col>
            <Col md={8}>
                <h2>Haftalık Çalışma Saatleri</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {availabilities.map((avail, index) => (
                        <Card key={avail.day_of_week} className="mb-2">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={3}>
                                        <Form.Check
                                            type="switch"
                                            id={`day-switch-${avail.day_of_week}`}
                                            label={weekDays[index]}
                                            checked={avail.active}
                                            onChange={(e) => handleAvailabilityChange(avail.day_of_week, 'active', e.target.checked)}
                                        />
                                    </Col>
                                    <Col md={4}><Form.Control type="time" value={avail.start_time} disabled={!avail.active} onChange={(e) => handleAvailabilityChange(avail.day_of_week, 'start_time', e.target.value)} /></Col>
                                    <Col md={1} className="text-center">-</Col>
                                    <Col md={4}><Form.Control type="time" value={avail.end_time} disabled={!avail.active} onChange={(e) => handleAvailabilityChange(avail.day_of_week, 'end_time', e.target.value)} /></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button type="submit" className="mt-3" disabled={!selectedPersonnelId}>Saatleri Kaydet</Button>
                </Form>
            </Col>
        </Row>
    );
}

export default ManageAvailability;

