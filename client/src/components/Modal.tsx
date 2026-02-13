import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Share2, Maximize2 } from 'lucide-react';
import { Design } from '../App';
import './Modal.css';

interface ModalProps {
    design: Design;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ design, onClose }) => {
    const [fullScreen, setFullScreen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleEnquiry = () => {
        const baseUrl = window.location.origin;
        const deepLink = `${baseUrl}?id=${design.id}`;
        const whatsappMsg = encodeURIComponent(`Hello Shiva Enterprises, I'm interested in this design: ${deepLink}\n\nDetails: ${design.title || 'Premium Design'}`);
        window.open(`https://wa.me/918707087053?text=${whatsappMsg}`, '_blank');
    };

    const isVideo = design.type === 'video' || (design.imageUrl && design.imageUrl.toLowerCase().includes('.mp4'));

    return (
        <>
            <div className="modal-overlay">
                <div
                    className="modal-backdrop"
                    onClick={onClose}
                />

                <div className="modal-content animate-scale">
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                    >
                        <X size={24} />
                    </button>

                    <div className="modal-media-container" onClick={() => setFullScreen(true)}>
                        {isVideo ? (
                            <video
                                src={design.imageUrl}
                                className="modal-media"
                                muted
                                autoPlay
                                loop
                                playsInline
                            />
                        ) : (
                            <img
                                src={design.imageUrl}
                                alt={design.title}
                                className="modal-media"
                            />
                        )}
                        <div className="modal-media-hint">
                            <div className="modal-media-hint-icon">
                                <Maximize2 size={28} />
                            </div>
                            <span className="modal-media-hint-text">View Full Size</span>
                        </div>
                    </div>

                    <div className="modal-info-panel">
                        <div className="modal-header-info">
                            <p className="modal-badge">Premium Design</p>
                            <h3 className="modal-title">{design.title || 'Artisan Metalwork'}</h3>
                            <div className="modal-divider"></div>
                        </div>

                        <div className="info-cards-grid">
                            <div className="info-card">
                                <span className="info-label">Estimated Rate</span>
                                <span className="info-value">{design.rate || 'Custom Inquiry'}</span>
                            </div>
                            <div className="info-card">
                                <span className="info-label">Core Material</span>
                                <span className="info-value">{design.material || 'Premium Steel'}</span>
                            </div>
                        </div>

                        <div className="charges-section">
                            <div className="charges-header">
                                <h4 className="charges-title">Other Charges</h4>
                                <div className="charges-line"></div>
                            </div>

                            <div className="charges-list">
                                <div className="charge-item">
                                    <div className="charge-info">
                                        <span className="charge-name">GST (18%)</span>
                                        <span className="charge-status status-included">Applicable</span>
                                    </div>
                                    <span className="charge-value">{design.gst || 'As per Govt.'}</span>
                                </div>
                                <div className="charge-item">
                                    <div className="charge-info">
                                        <span className="charge-name">Transportation</span>
                                        <span className="charge-status status-extra">Standard</span>
                                    </div>
                                    <span className="charge-value">{design.transport || 'Extra'}</span>
                                </div>
                                <div className="charge-item">
                                    <div className="charge-info">
                                        <span className="charge-name">Installation / Fitting</span>
                                        <span className="charge-status status-varies">Varies</span>
                                    </div>
                                    <span className="charge-value">{design.installation || 'Contact Us'}</span>
                                </div>
                            </div>

                            <p className="charges-note">
                                * Final pricing depends on actual dimensions and site location.
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={handleEnquiry}
                                className="enquiry-btn"
                            >
                                <div className="enquiry-btn-overlay"></div>
                                <i className="ri-whatsapp-line" style={{ fontSize: '24px' }}></i>
                                <span>Enquire Now</span>
                            </button>

                            <div className="utility-btns-row">
                                <button className="utility-btn">
                                    <Share2 size={14} /> <span>Share</span>
                                </button>
                                <button className="utility-btn">
                                    <ExternalLink size={14} /> <span>Link</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {fullScreen && (
                <div className="fullscreen-overlay animate-reveal" onClick={() => setFullScreen(false)}>
                    <button
                        className="fullscreen-close"
                        onClick={(e) => { e.stopPropagation(); setFullScreen(false); }}
                    >
                        <X size={32} />
                    </button>

                    {isVideo ? (
                        <video
                            src={design.imageUrl}
                            controls
                            autoPlay
                            loop
                            className="fullscreen-media"
                        />
                    ) : (
                        <img
                            src={design.imageUrl}
                            alt={design.title}
                            className="fullscreen-media"
                        />
                    )}

                    <div className="fullscreen-hint">
                        Click anywhere to close
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
