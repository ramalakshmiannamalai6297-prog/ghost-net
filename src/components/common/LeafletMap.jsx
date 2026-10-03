import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issues with bundlers
const iconProto = Object.getPrototypeOf(new L.Icon.Default());
if (iconProto) delete iconProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin SVG icons for different waste types / priorities
const createCustomPin = (color = '#0284c7', label = '') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
          <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="3.5" fill="#ffffff" />
        </svg>
        ${label ? `<span style="position: absolute; top: -8px; background: #0f172a; color: #fff; font-size: 10px; font-weight: bold; padding: 1px 4px; border-radius: 4px; border: 1px solid #fff; white-space: nowrap;">${label}</span>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};

export const LeafletMap = ({
  center = [18.98, 72.82],
  zoom = 10,
  reports = [],
  hotspots = [],
  interactiveLocationSelect = false,
  selectedLocation = null,
  onLocationSelect = null,
  height = '420px',
  activeReportId = null,
  role = 'authority'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const hotspotsLayerRef = useRef(null);
  const navigate = useNavigate();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Handle map click in interactive location select mode
      if (interactiveLocationSelect && onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({
            lat: parseFloat(lat.toFixed(4)),
            lng: parseFloat(lng.toFixed(4))
          });
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center & zoom if changed externally
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Render Hotspots (circular highlight areas)
  useEffect(() => {
    if (!mapInstanceRef.current || !hotspotsLayerRef.current) return;
    hotspotsLayerRef.current.clearLayers();

    if (hotspots && hotspots.length > 0) {
      hotspots.forEach(spot => {
        const circle = L.circle(spot.center, {
          color: '#e11d48',
          weight: 2,
          opacity: 0.7,
          fillColor: '#f43f5e',
          fillOpacity: 0.12,
          radius: spot.radius || 4000
        });

        circle.bindTooltip(`
          <div style="font-size: 12px; font-weight: 600; padding: 2px 4px;">
            ⚠️ Marine Waste Hotspot: ${spot.name}<br/>
            <span style="font-size: 11px; font-weight: normal; color: #64748b;">${spot.reportsCount || 10} reported incidents</span>
          </div>
        `, { sticky: true });

        hotspotsLayerRef.current.addLayer(circle);
      });
    }
  }, [hotspots]);

  // Render Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // If in interactive location selection mode, just show the selected pin
    if (interactiveLocationSelect && selectedLocation) {
      const pin = createCustomPin('#0284c7', 'Selected Point');
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: pin,
        draggable: true
      });

      marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            lat: parseFloat(position.lat.toFixed(4)),
            lng: parseFloat(position.lng.toFixed(4))
          });
        }
      });

      marker.bindPopup(`
        <div class="p-2 text-xs">
          <p class="font-bold text-slate-800">Report Location</p>
          <p class="text-slate-600">Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}</p>
          <p class="text-slate-400 mt-1 italic">Drag marker or click map to adjust position</p>
        </div>
      `).openPopup();

      markersLayerRef.current.addLayer(marker);
      return;
    }

    // Normal reports markers
    if (reports && reports.length > 0) {
      reports.forEach(report => {
        if (!report.latitude || !report.longitude) return;

        // Choose color by priority and status
        let pinColor = '#0284c7'; // default ocean blue
        if (report.status === 'CLOSED') {
          pinColor = '#10b981'; // green
        } else if (report.priority === 'High') {
          pinColor = '#e11d48'; // red
        } else if (report.priority === 'Medium') {
          pinColor = '#f59e0b'; // amber
        }

        const isHighlight = activeReportId === report.id;
        const pin = createCustomPin(pinColor, report.id);
        const marker = L.marker([report.latitude, report.longitude], { icon: pin });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-xs min-w-[210px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span class="font-bold text-slate-900 text-sm">${report.id}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              report.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' :
              report.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }">${report.status}</span>
          </div>
          <div class="mt-2 space-y-1 text-slate-600">
            <p><strong class="text-slate-700">Type:</strong> ${report.wasteType}</p>
            <p><strong class="text-slate-700">Location:</strong> ${report.locationName || 'Coastal Area'}</p>
            <p><strong class="text-slate-700">Priority:</strong> ${report.priority || 'Normal'}</p>
            <p><strong class="text-slate-700">Date:</strong> ${report.date}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200 flex gap-1.5">
            <button id="view-btn-${report.id}" class="w-full text-center bg-sky-700 hover:bg-sky-800 text-white font-medium py-1.5 px-2 rounded text-xs transition">
              View Report
            </button>
          </div>
        `;

        // Attach event listener to view button
        const btn = popupContent.querySelector(`#view-btn-${report.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            const targetUrl = role === 'fisherman' 
              ? `/fisherman/reports/${report.id}`
              : `/authority/reports/${report.id}`;
            navigate(targetUrl);
          });
        }

        marker.bindPopup(popupContent);
        markersLayerRef.current.addLayer(marker);

        if (isHighlight) {
          marker.openPopup();
        }
      });
    }
  }, [reports, selectedLocation, interactiveLocationSelect, activeReportId, role]);

  return (
    <div className="relative w-full rounded border border-slate-200 overflow-hidden bg-slate-100" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Small Map Legend */}
      <div className="absolute bottom-2 right-2 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded px-2.5 py-1.5 text-[11px] text-slate-600 shadow-sm flex items-center gap-3">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> High
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Med
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Closed
        </span>
        {hotspots && hotspots.length > 0 && (
          <span className="flex items-center gap-1 font-medium text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full border border-rose-600 bg-rose-200 inline-block"></span> Hotspot
          </span>
        )}
      </div>
    </div>
  );
};

export default LeafletMap;
