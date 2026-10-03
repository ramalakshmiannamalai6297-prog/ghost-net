import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LeafletMap from '../../components/common/LeafletMap';
import { HOTSPOTS } from '../../data/reports';
import { Flame, MapPin, AlertCircle, Compass, Layers, Info, ChevronRight, ShieldAlert, BarChart2 } from 'lucide-react';

export const AuthorityHotspotsPage = () => {
  const { reports } = useApp();
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);
  const [mapCenter, setMapCenter] = useState(HOTSPOTS[0].center);
  const [mapZoom, setMapZoom] = useState(11);

  const handleSelectHotspot = (spot) => {
    setActiveHotspot(spot);
    setMapCenter(spot.center);
    setMapZoom(12);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>High-Density Waste Concentrations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Marine Waste Hotspot Analysis</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial clustering of derelict gear along shipping channels, fishing corridors, and sensitive reefs
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Surveillance Sectors: <strong>{HOTSPOTS.length} Active Hotspot Zones</strong>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hotspot Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Identified Hotspots</h2>

            <div className="space-y-3">
              {HOTSPOTS.map((spot) => {
                const isSelected = activeHotspot.id === spot.id;

                return (
                  <div
                    key={spot.id}
                    onClick={() => handleSelectHotspot(spot)}
                    className={`p-4 rounded border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                        <h3 className="font-bold text-slate-900 text-sm">{spot.name}</h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                        {spot.reportsCount} incidents
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {spot.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Radius: {(spot.radius / 1000).toFixed(1)} km nautical buffer</span>
                      <span className="text-sky-700 font-semibold flex items-center gap-0.5">
                        Focus <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Recommended Preventative Interventions</span>
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Acoustic Beacons:</strong> Deploy sonar pingers near reef heads to deter gear abandonment.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Harbor Collection Incentives:</strong> Subsidize port return points at Sassoon and Versova docks.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Scheduled Patrol Trawls:</strong> Bi-weekly sweep by <em>Salvage Craft Sagar-1</em>.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Map Focused on Hotspots */}
        <div className="lg:col-span-7 bg-white rounded border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800">
              Focused Zone: {activeHotspot.name}
            </span>
            <span>Radius: {(activeHotspot.radius / 1000).toFixed(1)} km</span>
          </div>

          <LeafletMap
            center={mapCenter}
            zoom={mapZoom}
            height="520px"
            reports={reports}
            hotspots={HOTSPOTS}
            role="authority"
          />

          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Hotspot Clustering Logic:</span>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Hotspots represent spatial clusters where multiple incidents have been reported within intersecting nautical boundaries. Concentrated retrieval operations in these sectors prevent secondary gear entanglement and propeller hazards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityHotspotsPage;
