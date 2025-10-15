import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Home.css'; // Anasayfaya özel stil dosyasını import ediyoruz

function Home() {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="hero-section">
            <div className="hero-overlay"></div>
            <Container className="hero-content text-center text-white">
                <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
                    Tarzınıza Zaman Ayırın
                </h1>
                <p className="lead mb-5 animate__animated animate__fadeInUp">
                    Profesyonel ekibimizden, istediğiniz hizmet için saniyeler içinde randevunuzu oluşturun. <br /> Kalite ve stil parmaklarınızın ucunda.
                </p>
                <div>
                    {user ? (
                        <>
                            <Button as={NavLink} to="/randevularim" variant="light" size="lg" className="me-3">
                                Randevularım
                            </Button>
                            <Button variant="outline-light" size="lg" onClick={handleLogout}>
                                Çıkış Yap
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button as={NavLink} to="/login" variant="primary" size="lg" className="me-3">
                                Hemen Giriş Yap
                            </Button>
                            <Button as={NavLink} to="/register" variant="outline-light" size="lg">
                                Ücretsiz Kayıt Ol
                            </Button>
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Home;