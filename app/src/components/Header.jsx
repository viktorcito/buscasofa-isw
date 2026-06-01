import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

import './Header.css'

// Iconos SVG inline (sin librerías), trazo coherente
const icons = {
    buscador: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" />,
    mapa: <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3zM9 3v15M15 6v15" />,
    about: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
    login: <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />,
    registro: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />,
};

const Icon = ({ name }) => (
    <svg className="nav-icon" width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icons[name]}
    </svg>
);

function Header({ user, onLogout }) {
    const { pathname } = useLocation();
    const handleLogout = () => {
        if (onLogout) onLogout();
    };
    // Marca la clase 'active' según la ruta actual (sin tocar clases/textos/hrefs)
    const cls = (base, path) => `${base} nav-link${pathname === path ? ' active' : ''}`;

    return (
        <header>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="brand">
                        <img src={logo} alt="Logo" className="brand-logo" />
                    </Link>
                    <Link className={cls('buscador', '/lista')} to="/lista"><Icon name="buscador" />Buscador</Link>
                    <Link className={cls('mapa', '/mapa')} to="/mapa"><Icon name="mapa" />Mapa</Link>
                    <Link className={cls('about', '/about')} to="/about"><Icon name="about" />Quienes somos</Link>
                </div>

                <div className="nav-right">
                    <ThemeToggle />
                    {!user &&
                        <>
                            <Link className={cls('login', '/login')} to="/login"><Icon name="login" />Login</Link>
                            <Link className="registro nav-btn" to="/registro"><Icon name="registro" />Registro</Link>
                        </>
                    }
                    {user &&
                        <>
                            <span className="nav-user">Bienvenido, <Link to="/perfil">{user}</Link></span>
                            <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
                        </>
                    }
                </div>
            </nav>
        </header>
    );
}

export default Header;
