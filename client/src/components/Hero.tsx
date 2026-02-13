import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-badge animate-reveal">
                    Master Craftsmen Since 2010
                </div>
                <h2 className="hero-title animate-reveal">
                    Exquisite Metal <span className="premium-gradient-text">Artistry</span>
                </h2>
                <p className="hero-description animate-reveal">
                    Premium Gates, Railings, and Grills crafted with precision, passion, and superior durability.
                </p>
            </div>
        </section>
    );
};

export default Hero;
