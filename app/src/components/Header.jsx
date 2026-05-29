import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

import './Header.css'

function Header({ user }) {
    const handleLogout = () => {
        // Lógica de cierre de sesión
        console.log('Cerrar sesión');
    };

    return (
        <header>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="brand">
                        <img src={logo} alt="Logo" className="brand-logo" />
                    </Link>
                    <Link className="buscador nav-link" to="/lista">Buscador</Link>
                    <Link className="mapa nav-link" to="/mapa">Mapa</Link>
                    <Link className="about nav-link" to="/about">Quienes somos</Link>
                </div>

                <div className="nav-right">
                    <ThemeToggle />
                    {!user &&
                        <>
                            <Link className="login nav-link" to="/login">Login</Link>
                            <Link className="registro nav-btn" to="/registro">Registro</Link>
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
