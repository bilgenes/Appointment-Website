import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './pages/AuthForm.css';
import './pages/MyAppointments.css';

// Bootstrap CSS'ini projenin en üst seviyesinde import ediyoruz
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);