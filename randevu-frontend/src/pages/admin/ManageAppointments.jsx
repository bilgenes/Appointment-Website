import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Badge, Dropdown } from 'react-bootstrap';

function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/staff/appointments', apiHeaders);
            setAppointments(response.data.data);
        } catch (err) {
            setError('Randevular yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/staff/appointments/${appointmentId}/status`, { status: newStatus }, apiHeaders);
            fetchAppointments(); // Listeyi güncelle
        } catch (err) {
            alert('Durum güncellenirken bir hata oluştu.');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'secondary',
            confirmed: 'success',
            completed: 'primary',
            cancelled: 'danger',
        };
        const statusTranslations = {
            pending: 'Beklemede',
            confirmed: 'Onaylandı',
            completed: 'Tamamlandı',
            cancelled: 'İptal Edildi',
        };
        return <Badge bg={variants[status] || 'light'}>{statusTranslations[status] || status}</Badge>;
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <h2>Tüm Randevular</h2>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Müşteri</th>
                    <th>Personel</th>
                    <th>Servis</th>
                    <th>Tarih & Saat</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map(app => (
                    <tr key={app.id}>
                        <td>{app.customer.name} {app.customer.surname}</td>
                        <td>{app.personal.name} {app.personal.surname}</td>
                        <td>{app.service.name}</td>
                        <td>{new Date(app.start_time).toLocaleString('tr-TR')}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-${app.id}`}>
                                    Durumu Değiştir
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleStatusChange(app.id, 'confirmed')}>Onayla</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleStatusChange(app.id, 'completed')}>Tamamlandı</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleStatusChange(app.id, 'cancelled')} className="text-danger">İptal Et</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export default ManageAppointments;

