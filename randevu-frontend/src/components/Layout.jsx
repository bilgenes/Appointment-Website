import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';

function Layout() {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar expand="lg" className="navbar-bold" sticky="top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">🚀 RandevUpp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={NavLink} to="/" end className="mx-2">Ana Sayfa</Nav.Link>

                            {user && user.role === 'admin' && (
                                <Nav.Link as={NavLink} to="/admin" className="mx-2">Admin Panel</Nav.Link>
                            )}
                            {user && (
                                <Nav.Link as={NavLink} to="/randevularim" className="mx-2">Randevularım</Nav.Link>
                            )}

                            {user ? (
                                <NavDropdown title={<span className="fw-bold text-white">👋 {user.name}</span>} id="user-nav-dropdown" align="end" className="ms-2">
                                    <NavDropdown.Item as={NavLink} to="/profilim">Profilim</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                        Güvenli Çıkış
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Button as={NavLink} to="/register" variant="link" className="btn-bold-outline mx-2">
                                        Kayıt Ol
                                    </Button>
                                    <Button as={NavLink} to="/login" variant="link" className="btn-bold-outline mx-2">
                                        Giriş Yap
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <main className="flex-grow-1">
                <Container fluid className="py-5">
                    <Outlet />
                </Container>
            </main>
        </div>
    );
}

export default Layout;