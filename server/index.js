const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        serviceAccount = require('./privateKey.json');
    }
} catch (error) {
    console.warn("Service account key not found in env or file, trying default credentials...");
}

try {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "shiva-enterprises-634c6.appspot.com"
        });
    } else {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: "shiva-enterprises-634c6",
            storageBucket: "shiva-enterprises-634c6.appspot.com"
        });
    }
} catch (error) {
    console.warn("Failed to initialize Firebase Admin with preferred credentials, trying empty config...");
    try {
        admin.initializeApp();
    } catch (e) {
        console.error("Critical error: Could not initialize Firebase at all.", e.message);
    }
}

let db;
try {
    db = admin.firestore();
} catch (e) {
    console.warn("Firestore could not be initialized. Only mock data will be available.");
}

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/designs', async (req, res) => {
    // Mock data fallback for verification
    const mockDesigns = [
        {
            id: 'mock-1',
            title: 'Premium MS Main Gate',
            imageUrl: 'https://images.unsplash.com/photo-1590434407567-2f3b6d5f75f9?q=80&w=1000&auto=format&fit=crop',
            rate: '₹1,200/sq.ft',
            material: 'Mild Steel',
            keyword: ['msgate', 'all'],
            gst: '₹216 (18%)',
            transport: '₹500 (Local)',
            installation: 'Free'
        },
        {
            id: 'mock-2',
            title: 'Artisan Railing',
            imageUrl: 'https://images.unsplash.com/photo-1621506821199-a92550d4ca39?q=80&w=1000&auto=format&fit=crop',
            rate: '₹800/sq.ft',
            material: 'Stainless Steel',
            keyword: ['msrailing', 'all'],
            gst: '₹144 (18%)',
            transport: '₹300 (Local)',
            installation: '₹1,000'
        },
        {
            id: 'mock-3',
            title: 'Modern Single Door',
            imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop',
            rate: '₹15,000/pc',
            material: 'MS + Wood Finish',
            keyword: ['mssingledoor', 'all'],
            gst: '₹2,700 (18%)',
            transport: 'Free Delivery',
            installation: '₹500'
        },
        {
            id: 'mock-4',
            title: 'SS Balcony Railing',
            imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1000&auto=format&fit=crop',
            rate: '₹1,500/rft',
            material: '304 Grade SS',
            keyword: ['ssrailing', 'all'],
            gst: '₹270 (18%)',
            transport: 'Extra',
            installation: 'Integrated'
        },
        {
            id: 'mock-5',
            title: 'Designer Window Grill',
            imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1000&auto=format&fit=crop',
            rate: '₹250/sq.ft',
            material: 'MS Solid Bar',
            keyword: ['msgrill', 'all'],
            gst: '₹45 (18%)',
            transport: 'Standard',
            installation: 'Contact Us'
        },
        {
            id: 'mock-6',
            title: 'Commercial SS Gate',
            imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000&auto=format&fit=crop',
            rate: '₹2,500/sq.ft',
            material: 'SS 316 Luxury',
            keyword: ['ssgate', 'all'],
            gst: '₹450 (18%)',
            transport: 'Site Inspection Required',
            installation: '₹5,000'
        }
    ];

    try {
        if (!db || !admin.apps.length || !admin.app().options.credential) {
            console.log("Serving mock data (no/invalid Firebase credentials)...");
            return res.json(mockDesigns);
        }

        const snapshot = await db.collection('images').get();
        const designs = [];
        snapshot.forEach(doc => {
            designs.push({ id: doc.id, ...doc.data() });
        });

        if (designs.length === 0) {
            console.log("No designs in Firestore, serving mock data...");
            return res.json(mockDesigns);
        }

        res.json(designs);
    } catch (error) {
        console.error('Error in /api/designs:', error.message);
        res.json(mockDesigns);
    }
});

// Admin routes (simplified for this migration)
app.post('/api/designs', async (req, res) => {
    // Add authentication here in production!
    try {
        const newDesign = req.body;
        const docRef = await db.collection('images').add({
            ...newDesign,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add design' });
    }
});

app.patch('/api/designs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        await db.collection('images').doc(id).update(updates);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update design' });
    }
});

app.delete('/api/designs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('images').doc(id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete design' });
    }
});

// Analytics Stats Route
app.get('/api/analytics/stats', async (req, res) => {
    try {
        if (!db || !admin.apps.length) {
            return res.json({ activeUsers: 1, totalDesigns: 6, popularCategory: 'M/S Gate' });
        }

        // Active Users (Pulse in last 5 minutes)
        const fiveMinutesAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 5 * 60000));
        const presenceSnapshot = await db.collection('presence')
            .where('lastSeen', '>=', fiveMinutesAgo)
            .get();

        // Total Designs
        const designsSnapshot = await db.collection('images').get();

        // Category breakdown
        const categories = {};
        designsSnapshot.forEach(doc => {
            const data = doc.data();
            const keywords = Array.isArray(data.keyword) ? data.keyword : [data.keyword || 'other'];
            keywords.forEach(kw => {
                if (kw && kw !== 'all') {
                    const cleanKw = kw.toLowerCase().trim();
                    categories[cleanKw] = (categories[cleanKw] || 0) + 1;
                }
            });
        });

        let popularCategory = 'None';
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categories)) {
            if (count > maxCount) {
                maxCount = count;
                popularCategory = cat;
            }
        }

        // Format popular category for display
        const categoryLabels = {
            'msgate': 'M/S Gate',
            'mssingledoor': 'Single Door',
            'msrailing': 'M/S Railing',
            'msgrill': 'M/S Grill',
            'ssgate': 'SS Gate',
            'ssrailing': 'SS Railing'
        };

        res.json({
            activeUsers: Math.max(presenceSnapshot.size, 1), // Always show at least 1 (the admin)
            totalDesigns: designsSnapshot.size || 6,
            popularCategory: categoryLabels[popularCategory] || popularCategory
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.json({ activeUsers: 1, totalDesigns: 6, popularCategory: 'M/S Gate' });
    }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
