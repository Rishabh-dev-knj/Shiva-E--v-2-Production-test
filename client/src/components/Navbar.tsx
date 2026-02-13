import React from 'react';
import { Phone } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="navbar-icon">
                        <i className="ri-shining-fill"></i>
                    </span>
                    <h1 className="navbar-title premium-gradient-text logo-text">Shiva Enterprises</h1>
                    <a href="/admin" className="admin-shortcut" title="Admin Panel">
                        <i className="ri-settings-4-line"></i>
                    </a>
                </div>

                <div className="navbar-desktop-contact">
                    <a
                        href="https://wa.me/918707087053?text=Hello%20Shiva%20Enterprises,%20I'm%20interested%20in%20your%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="navbar-contact-btn">
                            <Phone size={18} className="phone-icon-animate" />
                            <span>Contact Us</span>
                        </button>
                    </a>
                </div>

                <div className="navbar-mobile-only">
                    <a
                        href="tel:+918707087053"
                        className="navbar-mobile-contact"
                        aria-label="Call Shiva Enterprises"
                    >
                        <Phone size={20} />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
