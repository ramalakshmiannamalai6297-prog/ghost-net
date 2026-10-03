# Ghost Net Reporter

> A comprehensive marine conservation web platform connecting coastal fishing communities and maritime salvage authorities to detect, report, retrieve, and recycle derelict fishing gear ("ghost nets") and marine debris.

---

## 🌊 Overview

Derelict fishing gear is one of the most hazardous categories of marine pollution, endangering coastal navigation, snagging vessel propellers, and continuing indiscriminate ghost fishing of endangered marine life for decades.

**Ghost Net Reporter** provides a specialized dual-portal operational system:

1. **Fisherman Portal**: Empowers coastal fishermen and vessel crews at sea to capture incidents with mobile photo upload, automated computer vision classification, browser GPS geolocation, and multilingual voice descriptions.
2. **Maritime Authority Portal**: Enables port authorities and coastal agencies to monitor surveillance maps, prioritize hazards, dispatch salvage vessels, audit cleanup evidence, and record circular economy recycling.

---

## 🚀 Key Features

### For Fishermen
- **Role-Based Portal**: Dedicated access for registered vessel operators and coastal citizens.
- **Incident Photo Capture**: Real-time image upload supporting JPG, JPEG, PNG, and WEBP formats.
- **Vision Waste Classification**: Automated categorization into Fishing Net, Plastic Waste, or Other Marine Waste with confidence rating.
- **Browser GPS Geolocation**: High-accuracy coordinate detection with manual Leaflet map pin fine-tuning.
- **Multilingual Voice Input**: Speech-to-text integration supporting English, Hindi, Marathi, and Tamil for fast sea reporting.
- **Report Tracker & History**: Real-time status tracking from submission to salvage and closure.
- **Offline Reliability**: Automatic local report queuing when operating outside mobile range with auto-synchronization on reconnection.

### For Maritime Authorities
- **Surveillance Command Dashboard**: Comprehensive operational overview of active, verified, dispatched, and resolved incidents.
- **Interactive Marine Incident Map**: Real-time Leaflet GIS mapping with priority-coded markers and density hotspot analysis.
- **Closed-Loop Verification Lifecycle**: 9-stage operational progression (`REPORTED` → `VERIFIED` → `PRIORITIZED` → `CLEANUP ASSIGNED` → `CLEANUP DISPATCHED` → `WASTE REMOVED` → `WASTE CATEGORIZED` → `EVIDENCE UPLOADED` → `CLOSED`).
- **Photographic Evidence Audit**: Verification with before and after cleanup photo uploads.
- **Circularity & Recycling Audit**: Classification into Recycled, Reused, or Disposed waste streams.
- **Real-Time Recovery Analytics**: Dynamically computed volume, hazard priority, and material diversion metrics.
- **Data Management**: Full JSON registry export for maritime regulatory reporting.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS
- **Mapping & GIS**: Leaflet, OpenStreetMap
- **Icons**: Lucide React
- **Voice Recognition**: Web Speech API (Multilingual)
- **Computer Vision Interface**: Client-side vision inference ready for YOLO / FastAPI backend deployment
- **State & Storage**: React Context API with persistent browser storage

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/organization/ghostnet-reporter.git

# Navigate into the project directory
cd ghostnet-reporter

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Footer.jsx             # Isolated footer links
│       ├── LeafletMap.jsx         # Interactive Leaflet OpenStreetMap
│       ├── Navbar.jsx             # Role-separated navigation
│       ├── PriorityBadge.jsx      # Hazard priority indicators
│       ├── StatusBadge.jsx        # Operational lifecycle badge
│       └── Toast.jsx              # System notifications
├── context/
│   └── AppContext.jsx             # State management, persistence & offline sync
├── data/
│   └── reports.js                 # Baseline records, fleet teams, hotspots
├── pages/
│   ├── LandingPage.jsx            # Welcome & role selection screen
│   ├── fisherman/
│   │   ├── FishermanDashboard.jsx # Fisherman home & metrics
│   │   ├── FishermanLoginPage.jsx # Dedicated fisherman login & registration
│   │   ├── MyReportsPage.jsx      # Fisherman incident log
│   │   ├── ProfilePage.jsx        # Vessel & reporter settings
│   │   ├── ReportSuccessPage.jsx  # Submission confirmation
│   │   ├── ReportTrackerPage.jsx  # Individual report lifecycle tracker
│   │   └── ReportWastePage.jsx    # Complete 4-step reporting workflow
│   └── authority/
│       ├── AuthorityAnalyticsPage.jsx # Real-time recovery analytics
│       ├── AuthorityCleanupPage.jsx   # Fleet task board
│       ├── AuthorityDashboard.jsx     # Authority operations center
│       ├── AuthorityHotspotsPage.jsx  # Density cluster analysis
│       ├── AuthorityLoginPage.jsx     # Dedicated authority login & registration
│       ├── AuthorityMapPage.jsx       # Interactive coastal sector map
│       ├── AuthorityReportDetailPage.jsx # 9-step management & evidence audit
│       ├── AuthorityReportsPage.jsx   # Incident registry directory
│       └── AuthoritySettingsPage.jsx  # Registry export & configuration
└── services/
    └── aiClassification.js        # Computer vision classification service
```

---

## 📜 Incident Resolution Workflow

```
[Fisherman]
  1. Capture / Upload Photo
  2. Automated Vision Classification
  3. Obtain GPS Coordinates
  4. Voice / Text Field Description
  5. Submit Incident (Report ID: GN-YYYYMMDD-XXX)
       │
       ▼
[Maritime Authority]
  6. Review & Verify Report
  7. Set Hazard Priority (Low / Medium / High)
  8. Assign Salvage Craft & Schedule Date
  9. Dispatch Salvage Vessel
 10. Extract Marine Waste & Upload Photographic Evidence
 11. Categorize Waste Handling (Recycled / Reused / Disposed)
 12. Final Authority Verification & Ticket Closure
```

---

## 📄 License

This project is licensed under the MIT License.
