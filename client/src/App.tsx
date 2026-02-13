import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import './App.css';

// Lazy load heavy components
const Gallery = lazy(() => import('./components/Gallery'));
const Modal = lazy(() => import('./components/Modal'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Interfaces for TypeScript
export interface Design {
  id: string;
  title?: string;
  imageUrl: string;
  rate?: string;
  material?: string;
  keyword?: string | string[];
  type?: 'video' | 'image';
  gst?: string;
  transport?: string;
  installation?: string;
}



import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const App: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Basic route detection
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
    }

    // Presence tracking (Real-time Analytics)
    const sessionId = Math.random().toString(36).substring(7);
    const presenceRef = doc(db, 'presence', sessionId);

    const updatePresence = async () => {
      try {
        await setDoc(presenceRef, {
          lastSeen: serverTimestamp(),
          path: window.location.pathname,
          platform: 'web'
        }, { merge: true });
      } catch (err) {
        console.warn('Presence tracking update failed');
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Grid Columns State
  const [columns, setColumns] = useState<number>(4);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/designs');
      const data: Design[] = response.data;
      setDesigns(data);
      setFilteredDesigns(data);

      // Check for shared design ID in URL
      const urlParams = new URLSearchParams(window.location.search);
      const sharedId = urlParams.get('id');
      if (sharedId) {
        const found = data.find(d => d.id === sharedId);
        if (found) setSelectedDesign(found);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredDesigns(designs);
    } else {
      const filtered = designs.filter(d => {
        if (!d.keyword) return false;
        const keywords = Array.isArray(d.keyword) ? d.keyword : [d.keyword];
        return keywords.some(kw => kw.toLowerCase().includes(filter.toLowerCase()));
      });
      setFilteredDesigns(filtered);
    }
  };

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="loading-screen">Loading Admin...</div>}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />

        <Suspense fallback={
          <div className="flex justify-center items-center py-20 text-[#a0a0a0]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        }>
          <Gallery
            designs={filteredDesigns}
            loading={loading}
            activeFilter={activeFilter}
            columns={columns}
            onFilterChange={handleFilter}
            onSelectDesign={setSelectedDesign}
            onColumnChange={setColumns}
          />
        </Suspense>
      </main>

      {selectedDesign && (
        <Suspense fallback={null}>
          <Modal
            design={selectedDesign}
            onClose={() => setSelectedDesign(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
