import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './AuthForm.css';

function Register() {
    const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '', birth_date: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.post('http://127.0.0.1:8000/api/register', formData);
            alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert('Kayıt sırasında bir hata oluştu.');
            }
        }
    };

    return (
        <div className="auth-container">
            {/* --- DEĞİŞİKLİK BURADA: Inline style eklendi --- */}
            <div
                className="aurora-card"
                style={{ maxWidth: '600px', backgroundColor: 'rgba(17, 24, 39, 0.75)' }}
            >
                <h2>Aramıza Katıl</h2>
                <Form onSubmit={handleSubmit} className="aurora-form">
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Ad</Form.Label><Form.Control type="text" name="name" onChange={handleChange} isInvalid={!!errors.name} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Soyad</Form.Label><Form.Control type="text" name="surname" onChange={handleChange} isInvalid={!!errors.surname} /></Form.Group></Col>
                    </Row>
                    <Form.Group className="mb-3"><Form.Label>Email Adresi</Form.Label><Form.Control type="email" name="email" onChange={handleChange} isInvalid={!!errors.email} /></Form.Group>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon</Form.Label><Form.Control type="text" name="phone" onChange={handleChange} isInvalid={!!errors.phone} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Doğum Tarihi</Form.Label><Form.Control type="date" name="birth_date" onChange={handleChange} isInvalid={!!errors.birth_date} /></Form.Group></Col>
                    </Row>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Şifre</Form.Label><Form.Control type="password" name="password" onChange={handleChange} isInvalid={!!errors.password} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Şifre Tekrar</Form.Label><Form.Control type="password" name="password_confirmation" onChange={handleChange} /></Form.Group></Col>
                    </Row>
                    <div className="d-grid mt-3">
                        <Button type="submit" className="btn-aurora">
                            Hesabımı Oluştur
                        </Button>
                    </div>
                </Form>
                <p className="mt-4 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Zaten bir hesabın var mı? <NavLink to="/login" style={{ color: '#26D0CE', fontWeight: '500' }}>Giriş yap.</NavLink>
                </p>
            </div>
        </div>
    );
}

export default Register;