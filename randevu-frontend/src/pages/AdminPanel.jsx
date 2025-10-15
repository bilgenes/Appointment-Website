import React from 'react';
import { Nav, Container, Card } from 'react-bootstrap';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

function AdminPanel() {
    const location = useLocation();
    return (
        <Container fluid>
            <h1 className="my-4">Admin Paneli</h1>
            <Card>
                <Card.Header>
                    {/* Bu menü, panelin sekmelerini oluşturur */}
                    <Nav variant="tabs" activeKey={location.pathname}>
                        <Nav.Item>
                            <Nav.Link as={NavLink} to="/admin/dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={NavLink} to="/admin/services">Servis Yönetimi</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={NavLink} to="/admin/users">Kullanıcı Yönetimi</Nav.Link>
                        </Nav.Item>

                        {/* YENİ EKLENEN SEKMELER */}
                        <Nav.Item>
                            <Nav.Link as={NavLink} to="/admin/appointments">Randevu Yönetimi</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={NavLink} to="/admin/availability">Çalışma Saatleri</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body>
                    {/* Tıklanan sekmenin içeriği (ilgili sayfa) burada gösterilecek */}
                    <Outlet />
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminPanel;

