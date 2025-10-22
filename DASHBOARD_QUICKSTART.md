# 🚀 BlueBlock Dashboard Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Supabase project created
- `.env.local` file configured

## 1️⃣ Install Dependencies
```powershell
npm install
```

## 2️⃣ Seed the Database
**Important:** Run this first to populate sample data!

```powershell
npm run seed
```

This will create:
- 2 Organizations
- 2 Projects  
- 3 Sites
- 3 Species
- 3 Field Workers
- 2 Planting Batches
- 3 Sample Measurements

## 3️⃣ Start Development Server
```powershell
npm run dev
```

Visit: **http://localhost:3000**

---

## 📱 Dashboard URLs

### **Organization Dashboard**
**URL:** `/dashboard/org`

**Features:**
- View KPIs (projects, sites, total area)
- Create new projects (modal)
- View recent projects and sites

**Test Flow:**
1. Click "Create Project"
2. Fill in project details
3. Submit → see new project in list

---

### **Sites Management**
**URL:** `/dashboard/sites`

**Features:**
- View all sites in table
- Create new sites (modal)
- Access site details

**Test Flow:**
1. Click "Create Site"
2. Select project from dropdown
3. Enter coordinates, area, habitat type
4. Submit → see new site in table
5. Click "View" to see site details

---

### **Site Detail Page**
**URL:** `/dashboard/sites/[siteId]`

**Features:**
- View site metadata
- Add planting batches (modal)
- Manage field workers
- View measurements

**Test Flow:**
1. From sites list, click "View"
2. See site details with GPS coordinates
3. Click "Add Planting Batch"
4. Select species and quantities
5. Submit → batch created

---

### **Field Dashboard** (Mobile Optimized)
**URL:** `/dashboard/field`

**Features:**
- Select assigned site
- GPS auto-detection
- Mobile camera capture
- Submit measurements

**Test Flow (Desktop):**
1. Click on a site card
2. Click "📍 Auto-Detect GPS" (will fail on desktop, that's OK)
3. Manually enter latitude/longitude
4. Fill in measurement data
5. Click "📷 Capture Photos" (select files)
6. Submit measurement

**Test Flow (Mobile):**
1. Open `/dashboard/field` on phone
2. Select a site
3. GPS auto-detects your location ✅
4. Camera opens for rear camera capture 📸
5. Take photos of vegetation
6. Fill measurement form
7. Submit → returns to site selection

---

### **Verifier Dashboard**
**URL:** `/dashboard/verifier`

**Features:**
- View sites requiring verification
- Review recent measurements
- See pending verifications

**Test Flow:**
1. View sites table
2. Click "Review" on any site
3. See site details and measurements

---

## 🔍 Testing GPS on Mobile

**For Android:**
1. Connect phone to same WiFi
2. Get your computer's local IP: `ipconfig` (look for IPv4)
3. On phone, visit: `http://YOUR_IP:3000/dashboard/field`
4. Grant location permissions
5. GPS will auto-detect your coordinates

**For iOS:**
1. Same as Android
2. May need HTTPS for GPS to work
3. Use ngrok or similar for HTTPS tunnel

---

## 📊 Sample Data Overview

After seeding, you'll have:

### **Organizations:**
- Tamil Nadu Coastal Restoration
- Kerala Blue Carbon Initiative

### **Projects:**
- Pichavaram Mangrove Restoration 2024 (250.5 ha)
- Vembanad Lake Seagrass Restoration (180 ha)

### **Sites:**
- Pichavaram North Zone (75.2 ha) - Mangrove Forest
- Pichavaram South Zone (82.5 ha) - Mangrove Forest  
- Vembanad East Meadow (60 ha) - Seagrass Meadow

### **Field Workers:**
- Rajesh Kumar (Supervisor)
- Priya Sharma (Field Worker)
- Arun Nair (Field Worker)

### **Species:**
- Red Mangrove (*Rhizophora mangle*)
- Black Mangrove (*Avicennia germinans*)
- Eelgrass (*Zostera marina*)

---

## 🎯 Key Features to Test

### ✅ Modal Workflows
- All creation forms use modals
- ESC key closes modal
- Click outside closes modal
- Cancel button works

### ✅ GPS Integration (Field Dashboard)
- Auto-detection button
- Accuracy display (±Xm)
- Manual coordinate override
- Error handling for unsupported devices

### ✅ Mobile Camera
- Rear camera opens on mobile
- Multiple photos supported
- Photo preview with thumbnails
- Remove individual photos

### ✅ Responsive Design
- All dashboards work on mobile
- Tables scroll horizontally
- Buttons stack on small screens
- Touch-friendly hit areas

---

## 🐛 Troubleshooting

### Database Connection Error
```
Failed to fetch data
```
**Fix:** Check `.env.local` has correct Supabase credentials

### GPS Not Working
```
GPS not supported on this device
```
**Fix:** GPS only works in browser on mobile/HTTPS. Desktop requires manual entry.

### Photos Not Uploading
**Note:** Photo upload to Supabase Storage not yet implemented. Photos are captured and previewed locally only.

### No Sites Showing in Field Dashboard
**Fix:** Run `npm run seed` to create sample sites

---

## 📝 Next Steps

### **Implement Authentication:**
```typescript
// Add to middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
```

### **Add RLS Policies:**
```sql
-- Filter sites by organization
CREATE POLICY "Users see own org sites"
ON sites FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM user_organizations 
  WHERE organization_id = sites.project.organization_id
));
```

### **Photo Upload Integration:**
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('site-photos')
  .upload(`${siteId}/${Date.now()}.jpg`, photoFile);
```

---

## 🎉 You're All Set!

Run `npm run dev` and explore the dashboards. All features are functional and ready for testing!

**Questions?** Check `DASHBOARD_IMPLEMENTATION.md` for detailed technical documentation.
