import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// DEĞİŞİKLİK: 'Row' ve 'Col' bileşenleri import satırına eklendi.
import { Table, Spinner, Alert, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

function ManageUsers() {
    const [users, setUsers] = useState([]); // API'den gelen orijinal ve tam liste
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Arama çubuğunun değerini tutacak state

    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/users', apiHeaders);
            setUsers(response.data.data);
        } catch (err) {
            setError('Kullanıcılar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ARAMA FİLTRELEME MANTIĞI
    const filteredUsers = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        if (!lowercasedFilter) {
            return users;
        }
        return users.filter(user => {
            return (user.name.toLowerCase() + ' ' + user.surname.toLowerCase()).startsWith(lowercasedFilter);
        });
    }, [users, searchTerm]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/users/${userId}/role`, { role: newRole }, apiHeaders);
            fetchUsers();
            alert('Rol başarıyla güncellendi!');
        } catch (err) {
            alert('Rol güncellenirken bir hata oluştu.');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <Row className="justify-content-between align-items-center mb-3">
                <Col md={8}>
                    <h2>Sistemdeki Kullanıcılar ({filteredUsers.length})</h2>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Text>🔍</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Ad veya soyada göre ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                <tr><th>ID</th><th>Ad Soyad</th><th>Email</th><th>Rol</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name} {user.surname}</td>
                            <td>{user.email}</td>
                            <td>
                                <Form.Select defaultValue={user.role} id={`role-select-${user.id}`}>
                                    <option value="customer">Customer</option>
                                    <option value="personal">Personal</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </td>
                            <td>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => {
                                        const newRole = document.getElementById(`role-select-${user.id}`).value;
                                        handleRoleChange(user.id, newRole);
                                    }}>
                                    Güncelle
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">Arama kriterlerine uygun kullanıcı bulunamadı.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </>
    );
}

export default ManageUsers;

