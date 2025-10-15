import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';

function ManageServices() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', duration_minutes: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/services', apiHeaders);
            setServices(response.data.data);
        } catch (err) {
            setError('Servisler yüklenirken bir hata oluştu.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await axios.post('http://127.0.0.1:8000/api/admin/services', formData, apiHeaders);
            setSuccess('Servis başarıyla eklendi!');
            fetchServices();
            setFormData({ name: '', description: '', price: '', duration_minutes: '' });
        } catch (err) { setError(err.response?.data?.message || 'Servis eklenirken bir hata oluştu.'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu servisi silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/admin/services/${id}`, apiHeaders);
                setSuccess('Servis başarıyla silindi!');
                fetchServices();
            } catch (err) { setError('Servis silinirken bir hata oluştu.'); }
        }
    };

    return (
        <Row>
            <Col md={4}><Card><Card.Header as="h5">Yeni Servis Ekle</Card.Header><Card.Body>
                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3"><Form.Control type="text" name="name" placeholder="Servis Adı" value={formData.name} onChange={handleChange} required /></Form.Group>
                    <Form.Group className="mb-3"><Form.Control as="textarea" rows={2} name="description" placeholder="Açıklama (İsteğe Bağlı)" value={formData.description} onChange={handleChange} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Control type="number" step="0.01" name="price" placeholder="Fiyat (TL)" value={formData.price} onChange={handleChange} required /></Form.Group>
                    <Form.Group className="mb-3"><Form.Control type="number" name="duration_minutes" placeholder="Süre (Dakika)" value={formData.duration_minutes} onChange={handleChange} required /></Form.Group>
                    <Button variant="primary" type="submit">Servisi Ekle</Button>
                </Form>
            </Card.Body></Card></Col>
            <Col md={8}><h2>Mevcut Servisler</h2>
                {loading ? <Spinner animation="border" /> : (
                    <Table striped bordered hover responsive>
                        <thead><tr><th>ID</th><th>Adı</th><th>Fiyat</th><th>Süre</th><th>İşlemler</th></tr></thead>
                        <tbody>{services.map(service => (<tr key={service.id}><td>{service.id}</td><td>{service.name}</td><td>{service.price} TL</td><td>{service.duration_minutes} dk</td><td><Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>Sil</Button></td></tr>))}</tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
}

export default ManageServices;
