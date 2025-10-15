import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './AuthForm.css';

function Login() {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.error || 'Giriş sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="auth-container">
            {/* --- DEĞİŞİKLİK BURADA: Inline style eklendi --- */}
            <div
                className="aurora-card"
                style={{ backgroundColor: 'rgba(17, 24, 39, 0.75)' }}
            >
                <h2>Tekrar Hoş Geldin!</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="aurora-form">
                    <Form.Group className="mb-3">
                        <Form.Label>Telefon Numarası</Form.Label>
                        <Form.Control type="text" name="phone" onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control type="password" name="password" onChange={handleChange} required />
                    </Form.Group>

                    <div className="d-grid">
                        <Button type="submit" className="btn-aurora">
                            Giriş Yap
                        </Button>
                    </div>
                </Form>
                <p className="mt-4 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Hesabın yok mu? <NavLink to="/register" style={{ color: '#26D0CE', fontWeight: '500' }}>Hemen kayıt ol.</NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login;