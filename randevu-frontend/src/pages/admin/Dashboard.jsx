import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';

// DEĞİŞİKLİK: 'date-fns' paketine olan bağımlılık kaldırıldı.

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics', apiHeaders);
                setStats(response.data);
            } catch (err) {
                setError('İstatistikler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // DEĞİŞİKLİK: Tarihleri formatlamak için yeni, dahili bir fonksiyon
    const formatTrDate = (dateString, options) => {
        return new Date(dateString).toLocaleString('tr-TR', options);
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <h2 className="mb-4">Genel Bakış</h2>
            {/* İSTATİSTİK KARTLARI */}
            <Row>
                <Col md={4} className="mb-4">
                    <Card bg="primary" text="white" className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title>Toplam Müşteri</Card.Title>
                            <Card.Text className="fs-1 fw-bold text-end">{stats?.total_customers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card bg="success" text="white" className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title>Bugünkü Ciro</Card.Title>
                            <Card.Text className="fs-1 fw-bold text-end">{stats?.daily_revenue.toFixed(2)} TL</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card bg="warning" text="dark" className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <Card.Title>Bu Haftaki Ciro</Card.Title>
                            <Card.Text className="fs-1 fw-bold text-end">{stats?.weekly_revenue.toFixed(2)} TL</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* YAKLAŞAN RANDEVULAR VE YENİ KULLANICILAR */}
            <Row>
                {/* YAKLAŞAN RANDEVULAR TABLOSU */}
                <Col lg={7} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Yaklaşan Randevular</Card.Header>
                        <Card.Body>
                            <Table responsive striped>
                                <thead><tr><th>Müşteri</th><th>Personel</th><th>Tarih</th></tr></thead>
                                <tbody>
                                {stats?.upcoming_appointments.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.customer.name} {app.customer.surname}</td>
                                        <td><Badge bg="info">{app.personal.name}</Badge></td>
                                        {/* DEĞİŞİKLİK: Yeni formatlama fonksiyonu kullanıldı */}
                                        <td>{formatTrDate(app.start_time, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* YENİ KULLANICILAR TABLOSU */}
                <Col lg={5} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Yeni Kaydolan Müşteriler</Card.Header>
                        <Card.Body>
                            <Table responsive striped>
                                <thead><tr><th>Ad Soyad</th><th>Kayıt Tarihi</th></tr></thead>
                                <tbody>
                                {stats?.recent_customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td>{customer.name} {customer.surname}</td>
                                        {/* DEĞİŞİKLİK: Yeni formatlama fonksiyonu kullanıldı */}
                                        <td>{formatTrDate(customer.created_at, { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Dashboard;

