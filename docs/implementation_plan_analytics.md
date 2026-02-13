# Implementation Plan - Analytics Dashboard

This plan outlines the steps to implement an analytics dashboard in the Shiva Enterprises app, allowing the admin to see active users and other key metrics.

## Proposed Changes

### [Component] Client-Side Firebase & Tracking

#### [NEW] [firebase.ts](file:///d:/Universal%20Folder%20for%20Code/Shiva%20Enterprises/shiva-enterprises-v2/client/src/firebase.ts)
- Initialize Firebase with the discovered config.
- Export `analytics` and `db` (Firestore).

#### [MODIFY] [App.tsx](file:///d:/Universal%20Folder%20for%20Code/Shiva%20Enterprises/shiva-enterprises-v2/client/src/App.tsx)
- Use `useEffect` to track user presence. When a user lands on the site, log an entry in a `presence` collection in Firestore with a `lastSeen` timestamp.
- This will provide the data for "Active Users".

### [Component] Server-Side Analytics API

#### [MODIFY] [index.js](file:///d:/Universal%20Folder%20for%20Code/Shiva%20Enterprises/shiva-enterprises-v2/server/index.js)
- Add a new endpoint `GET /api/analytics/stats`.
- Fetch:
  - **Active Users**: Count documents in `presence` collection where `lastSeen` > (Now - 5 minutes).
  - **Total Designs**: Count documents in `images` collection.
  - **Category Breakdown**: Group designs by their keywords.

### [Component] Admin Interface

#### [MODIFY] [AdminPage.tsx](file:///d:/Universal%20Folder%20for%20Code/Shiva%20Enterprises/shiva-enterprises-v2/client/src/pages/AdminPage.tsx)
- Add a "Real-time Stats" row at the top of the dashboard.
- Display cards for:
  - **Active Users** (with a green pulsating dot).
  - **Total Designs**.
  - **Popular Category**.
- Use a polling mechanism (e.g., every 30 seconds) to keep stats fresh.

#### [MODIFY] [AdminPage.css](file:///d:/Universal%20Folder%20for%20Code/Shiva%20Enterprises/shiva-enterprises-v2/client/src/pages/AdminPage.css)
- Add styles for the new stats cards (premium look, gradients, icons).

## Verification Plan

### Automated Tests
- No automated tests currently exist for this flow; verification will be manual.

### Manual Verification
1. Open the home page in a new browser tab (incognito or different session).
2. Check the Admin Dashboard to see if "Active Users" increments.
3. Add a new design and verify "Total Designs" increments.
4. Wait 5 minutes and verify "Active Users" decrements if the other tab is closed.

> [!IMPORTANT]
> This approach uses Firestore for presence tracking rather than directly pulling from Google Analytics, as the latter requires complex OAuth/Service Account permission setup in the Google Cloud Console. This provides a self-contained, reliable "Real-time" view within your app.
