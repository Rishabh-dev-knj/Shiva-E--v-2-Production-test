import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Loader2, LayoutGrid, ChevronDown } from 'lucide-react';
import { Design } from '../App';
import './Gallery.css';

interface Category {
    id: string;
    label: string;
}

const CATEGORIES: Category[] = [
    { id: 'all', label: 'All Collection' },
    { id: 'msgate', label: 'M/S Gate' },
    { id: 'mssingledoor', label: 'Single Door' },
    { id: 'msrailing', label: 'Railing' },
    { id: 'msgrill', label: 'Grill' },
    { id: 'ssgate', label: 'SS Gate' },
    { id: 'ssrailing', label: 'SS Railing' },
];

interface GalleryProps {
    designs: Design[];
    loading: boolean;
    activeFilter: string;
    columns: number;
    onFilterChange: (filter: string) => void;
    onSelectDesign: (design: Design) => void;
    onColumnChange: (columns: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({
    designs,
    loading,
    activeFilter,
    columns,
    onFilterChange,
    onSelectDesign,
    onColumnChange
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);
    const layoutMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (layoutMenuRef.current && !layoutMenuRef.current.contains(event.target as Node)) {
                setShowLayoutMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Forcing dynamic columns via inline style as it's the most reliable way without Tailwind JIT
    const gridStyle = {
        display: 'grid',
        gap: isMobile ? '8px' : '24px',
        gridTemplateColumns: `repeat(${isMobile ? Math.min(columns, 4) : columns}, minmax(0, 1fr))`,
    };

    return (
        <section className="gallery-section">
            <div className="gallery-controls-container">
                {/* Layout Toggle Button - Fixed to Left */}
                <div className="layout-toggle-section" ref={layoutMenuRef}>
                    <button
                        className={`layout-toggle-btn ${showLayoutMenu ? 'layout-toggle-active' : ''}`}
                        onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                        aria-label="Change Layout"
                    >
                        <LayoutGrid size={18} />
                        <span className="layout-btn-text">Layout</span>
                        <ChevronDown size={14} className={`layout-chevron ${showLayoutMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Layout Dropdown Menu */}
                    {showLayoutMenu && (
                        <div className="layout-dropdown animate-scale-top">
                            <div className="layout-dropdown-header">
                                <span>Grid Columns</span>
                                <div className="layout-header-line"></div>
                            </div>

                            <div className="layout-options-grid">
                                {[2, 3, 4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            onColumnChange(num);
                                            // Don't close immediately so user can see selection
                                        }}
                                        className={`layout-option ${columns === num ? 'layout-option-active' : ''}`}
                                        title={`${num} Columns`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <div className="layout-dropdown-footer">
                                <span className="layout-note">
                                    {isMobile ? "* Max 4 columns on mobile" : "* Adjust grid density"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider - Fixed next to layout controls */}
                <div className="category-divider"></div>

                <div className="category-scroll-container no-scrollbar">
                    <div className="category-list">

                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                className={`category-btn ${activeFilter === cat.id ? 'category-btn-active' : 'category-btn-inactive'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="gallery-loading">
                    <Loader2 className="loading-spinner" />
                    <p className="loading-text">Refining Premium Designs...</p>
                </div>
            ) : designs.length === 0 ? (
                <div className="gallery-empty">
                    <p className="empty-text">No designs found in this category.</p>
                </div>
            ) : (
                <div
                    style={gridStyle}
                    className="gallery-grid"
                >
                    {designs.map((item, index) => (
                        <div
                            key={item.id}
                            className="design-card-wrapper animate-reveal"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div
                                onClick={() => onSelectDesign(item)}
                                className="design-card"
                            >
                                {item.type === 'video' || (item.imageUrl && item.imageUrl.toLowerCase().includes('.mp4')) ? (
                                    <video
                                        src={item.imageUrl}
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                        className="design-media"
                                        preload="none"
                                    />
                                ) : (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="design-media"
                                    />
                                )}

                                <div className="hover-overlay">
                                    <div className="hover-icon">
                                        <Maximize2 size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Gallery;
