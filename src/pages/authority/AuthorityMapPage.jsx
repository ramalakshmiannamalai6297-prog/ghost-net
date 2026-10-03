import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LeafletMap from '../../components/common/LeafletMap';
import { HOTSPOTS } from '../../data/reports';
import { MapPin, AlertCircle, Compass, Layers, Info, ChevronRight, Navigation } from 'lucide-react';

export const AuthorityMapPage = () => {
  const { reports } = useApp();
  const [mapCenter, setMapCenter] = useState([18.9802, 72.8214]);
  const [mapZoom, setMapZoom] = useState(10);
  const [selectedHotspotId, setSelectedHotspotId] = useState('hotspot-1');

  const handleZoomToHotspot = (hotspot) => {
    setSelectedHotspotId(hotspot.id);
    setMapCenter(hotspot.center);
    setMapZoom(12);
  };

  const handleResetMap = () => {
    setSelectedHotspotId(null);
    setMapCenter([18.90, 72.88]);
    setMapZoom(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Coastal Incident Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic density distribution of reported marine waste and active salvage craft
          </p>
        </div>

        <button
          onClick={handleResetMap}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded transition self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-sky-700" />
          <span>Reset Map View</span>
        </button>
      </div>

      {/* Main Grid: Left Map & Right Clusters Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Large Map Container */}
        <div className="lg:col-span-8 bg-white rounded border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Layers className="w-4 h-4 text-sky-700" />
              <span>OpenStreetMap Coastal Marine Layer</span>
            </span>
            <span>Click any marker to open incident summary</span>
          </div>

          <LeafletMap
            center={mapCenter}
            zoom={mapZoom}
            height="560px"
            reports={reports}
            hotspots={HOTSPOTS}
            role="authority"
          />

          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Operational Notice:</span>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Markers display active incidents categorized by hazard level. Circular zones highlight areas where recurring debris snags require priority salvage vessel scheduling.
              </p>
            </div>
          </div>
        </div>

        {/* Right Hotspots List Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">High Concentration Sectors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click a sector to focus the map</p>
            </div>

            <div className="space-y-3">
              {HOTSPOTS.map((spot) => {
                const isSelected = selectedHotspotId === spot.id;

                return (
                  <div
                    key={spot.id}
                    onClick={() => handleZoomToHotspot(spot)}
                    className={`p-3.5 rounded border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                        <h3 className="font-bold text-slate-900 text-xs">{spot.name}</h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        {spot.reportsCount} reports
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {spot.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Coordinates: {spot.center[0]}, {spot.center[1]}</span>
                      <span className="text-sky-700 font-semibold flex items-center gap-0.5">
                        Focus <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Coverage Stats */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900">Sector Surveillance Stats</h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Active Surveillance Sectors:</span>
                <strong className="text-slate-800">5 Coastal Sectors</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Average Retrieval Response:</span>
                <strong className="text-emerald-700">18.4 Hours</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>High-Risk Coral Formations:</span>
                <strong className="text-rose-700">3 Snag Sites</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityMapPage;
