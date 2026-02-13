import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutGrid,
    UploadCloud,
    Search,
    Trash2,
    Edit,
    Home,
    Plus,
    X,
    Loader2,
    Users,
    Zap
} from 'lucide-react';
import './AdminPage.css';

interface Design {
    id: string;
    title?: string;
    imageUrl: string;
    rate?: string;
    material?: string;
    keyword?: string | string[];
    gst?: string;
    transport?: string;
    installation?: string;
}

const AdminPage: React.FC = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [stats, setStats] = useState({ activeUsers: 0, totalDesigns: 0, popularCategory: '...' });

    // Form states
    const [newDesign, setNewDesign] = useState<Partial<Design>>({
        title: '',
        rate: '',
        material: '',
        imageUrl: '',
        keyword: [],
        gst: '',
        transport: '',
        installation: ''
    });
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Edit states
    const [editingDesign, setEditingDesign] = useState<Design | null>(null);
    const [editKeywords, setEditKeywords] = useState<string[]>([]);

    useEffect(() => {
        fetchDesigns();
        fetchStats();
        const statsInterval = setInterval(fetchStats, 30000);
        return () => clearInterval(statsInterval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/analytics/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchDesigns = async () => {
        try {
            const response = await axios.get('/api/designs');
            setDesigns(response.data);
        } catch (error) {
            console.error('Error fetching designs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddKeyword = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value && !selectedKeywords.includes(value)) {
            setSelectedKeywords([...selectedKeywords, value]);
        }
    };

    const handleRemoveKeyword = (kw: string) => {
        setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const dataToPublish = {
                ...newDesign,
                keyword: selectedKeywords
            };
            await axios.post('/api/designs', dataToPublish);
            alert('Design published successfully!');
            setNewDesign({
                title: '',
                rate: '',
                material: '',
                imageUrl: '',
                keyword: [],
                gst: '',
                transport: '',
                installation: ''
            });
            setSelectedKeywords([]);
            fetchDesigns();
        } catch (error) {
            alert('Failed to publish design');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this design?')) return;
        try {
            await axios.delete(`/api/designs/${id}`);
            fetchDesigns();
        } catch (error) {
            alert('Failed to delete design');
        }
    };

    const handleEditClick = (design: Design) => {
        setEditingDesign(design);
        setEditKeywords(Array.isArray(design.keyword) ? design.keyword : design.keyword ? [design.keyword] : []);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDesign) return;
        try {
            await axios.patch(`/api/designs/${editingDesign.id}`, {
                title: editingDesign.title,
                rate: editingDesign.rate,
                material: editingDesign.material,
                gst: editingDesign.gst,
                transport: editingDesign.transport,
                installation: editingDesign.installation,
                keyword: editKeywords
            });
            alert('Design updated successfully!');
            setEditingDesign(null);
            fetchDesigns();
        } catch (error) {
            alert('Failed to update design');
        }
    };

    const filtered = designs.filter(d => {
        const matchesSearch = (d.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const keywords = Array.isArray(d.keyword) ? d.keyword : [d.keyword || ''];
        const matchesCategory = filterCategory === 'all' || keywords.some(kw => kw.toLowerCase().includes(filterCategory.toLowerCase()));
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="admin-wrapper">
            <header className="admin-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <a href="/" className="home-link">
                        <Home size={18} />
                        <span>View Site</span>
                    </a>
                </div>
            </header>

            <main className="admin-main">
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon users"><Users size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Active Users</span>
                            <div className="stat-value-container">
                                <span className="stat-value">{stats.activeUsers}</span>
                                <span className="pulse-dot"></span>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon designs"><LayoutGrid size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Designs</span>
                            <span className="stat-value">{stats.totalDesigns}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon trend"><Zap size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Popular Now</span>
                            <span className="stat-value">{stats.popularCategory}</span>
                        </div>
                    </div>
                </div>

                <section className="admin-section upload-section">
                    <div className="section-header">
                        <h2><UploadCloud /> New Fabrication Design</h2>
                        <p>Add a new design to your website's collection.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Design Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Modern Lattice Gate"
                                    value={newDesign.title}
                                    onChange={e => setNewDesign({ ...newDesign, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Rate Details</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ₹450 / sq ft"
                                    value={newDesign.rate}
                                    onChange={e => setNewDesign({ ...newDesign, rate: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>GST Details</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ₹216 (18%)"
                                    value={newDesign.gst}
                                    onChange={e => setNewDesign({ ...newDesign, gst: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Transport Details</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ₹500 (Local)"
                                    value={newDesign.transport}
                                    onChange={e => setNewDesign({ ...newDesign, transport: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Installation Details</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Free / ₹1,000"
                                    value={newDesign.installation}
                                    onChange={e => setNewDesign({ ...newDesign, installation: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Primary Material</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mild Steel"
                                    value={newDesign.material}
                                    onChange={e => setNewDesign({ ...newDesign, material: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    placeholder="Paste link here..."
                                    value={newDesign.imageUrl}
                                    onChange={e => setNewDesign({ ...newDesign, imageUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Keywords (Categories)</label>
                                <div className="keyword-selector">
                                    <div className="selected-keywords">
                                        {selectedKeywords.map(kw => (
                                            <div key={kw} className="keyword">
                                                <span>{kw}</span>
                                                <button type="button" onClick={() => handleRemoveKeyword(kw)}><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="keyword-controls">
                                        <select onChange={handleAddKeyword} value="">
                                            <option value="" disabled>Select Category</option>
                                            <option value="msgate">M/S Gate</option>
                                            <option value="mssingledoor">Single Door</option>
                                            <option value="msrailing">Railing</option>
                                            <option value="msgrill">Grill</option>
                                            <option value="ssgate">SS Gate</option>
                                            <option value="ssrailing">SS Railing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn" disabled={isUploading}>
                            {isUploading ? <><Loader2 className="animate-spin" /> Publishing...</> : 'Publish Design'}
                        </button>
                    </form>
                </section>

                <section className="admin-section management-section">
                    <div className="section-header">
                        <h2><LayoutGrid /> Manage Collection</h2>
                        <p>Search, filter, and remove existing designs.</p>
                    </div>

                    <div className="management-controls">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-box">
                            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                                <option value="all">All Categories</option>
                                <option value="msgate">M/S Gate</option>
                                <option value="mssingledoor">Single Door</option>
                                <option value="msrailing">Railing</option>
                                <option value="msgrill">Grill</option>
                                <option value="ssgate">SS Gate</option>
                                <option value="ssrailing">SS Railing</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-gallery">
                        {loading ? (
                            <div className="loading-state">Loading designs...</div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">No designs found.</div>
                        ) : (
                            filtered.map(design => (
                                <div key={design.id} className="admin-card">
                                    <img src={design.imageUrl} alt={design.title} className="card-image" />
                                    <div className="card-info">
                                        <h3>{design.title || 'Untitled'}</h3>
                                        <p>{design.material || 'N/A'} • {design.rate || 'N/A'}</p>
                                    </div>
                                    <div className="card-actions">
                                        <button className="edit-btn" onClick={() => handleEditClick(design)}>
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(design.id)}>
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {editingDesign && (
                <div className="modal-admin-overlay">
                    <div className="modal-content-admin">
                        <div className="modal-header">
                            <h3>Edit Design</h3>
                            <button className="close-modal" onClick={() => setEditingDesign(null)}><X /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={editingDesign.title}
                                        onChange={e => setEditingDesign({ ...editingDesign, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rate</label>
                                    <input
                                        type="text"
                                        value={editingDesign.rate}
                                        onChange={e => setEditingDesign({ ...editingDesign, rate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GST</label>
                                    <input
                                        type="text"
                                        value={editingDesign.gst || ''}
                                        onChange={e => setEditingDesign({ ...editingDesign, gst: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Transport</label>
                                    <input
                                        type="text"
                                        value={editingDesign.transport || ''}
                                        onChange={e => setEditingDesign({ ...editingDesign, transport: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Installation</label>
                                    <input
                                        type="text"
                                        value={editingDesign.installation || ''}
                                        onChange={e => setEditingDesign({ ...editingDesign, installation: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Material</label>
                                    <input
                                        type="text"
                                        value={editingDesign.material}
                                        onChange={e => setEditingDesign({ ...editingDesign, material: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Keywords</label>
                                    <div className="keyword-selector">
                                        <div className="selected-keywords">
                                            {editKeywords.map(kw => (
                                                <div key={kw} className="keyword">
                                                    <span>{kw}</span>
                                                    <button type="button" onClick={() => setEditKeywords(editKeywords.filter(k => k !== kw))}><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <select onChange={e => {
                                            const val = e.target.value;
                                            if (val && !editKeywords.includes(val)) setEditKeywords([...editKeywords, val]);
                                        }} value="">
                                            <option value="" disabled>Add Category</option>
                                            <option value="msgate">M/S Gate</option>
                                            <option value="mssingledoor">Single Door</option>
                                            <option value="msrailing">Railing</option>
                                            <option value="msgrill">Grill</option>
                                            <option value="ssgate">SS Gate</option>
                                            <option value="ssrailing">SS Railing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setEditingDesign(null)}>Cancel</button>
                                <button type="submit" className="submit-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
