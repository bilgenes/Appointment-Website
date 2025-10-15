import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Gerekli tüm bileşenleri kendi dosyalarından import ediyoruz
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import ManageServices from './pages/admin/ManageServices';
import ManageUsers from './pages/admin/ManageUsers';
// --- YENİ EKLENEN KISIM BAŞLANGICI ---
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageAvailability from './pages/admin/ManageAvailability';
import MyAppointments from './pages/MyAppointments';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/admin/Dashboard';

// --- YENİ EKLENEN KISIM SONU ---

// react-router-dom v7+ için yönlendirme listesini oluşturuyoruz
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // Ana çerçeve (Navbar vb.) tüm sayfalara uygulanacak
        children: [
            // Genel Rotalar
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "randevularim", element: <MyAppointments /> },
            { path: "randevu-al", element: <BookAppointment /> },

            // Korumalı Admin Rotaları
            {
                element: <AdminRoute />, // Bu, içindeki tüm rotaları koruma altına alır
                children: [
                    {
                        path: "admin",
                        element: <AdminPanel />,
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: "dashboard", element: <Dashboard /> },

                            { path: "services", element: <ManageServices /> },
                            { path: "users", element: <ManageUsers /> },
                            // --- YENİ EKLENEN KISIM BAŞLANGICI ---
                            { path: "appointments", element: <ManageAppointments /> },
                            { path: "availability", element: <ManageAvailability /> },
                            // --- YENİ EKLENEN KISIM SONU ---
                        ],
                    },
                ],
            },

            // Eşleşmeyen diğer tüm URL'leri anasayfaya yönlendir
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
]);

// App bileşeninin tek görevi, oluşturduğumuz bu rota listesini ekrana basmaktır.
function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;