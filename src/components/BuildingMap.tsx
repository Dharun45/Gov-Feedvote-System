import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  buildings: any[];
  feedback?: any[];
  heatmapMode?: boolean;
}

const BuildingMap = ({ buildings, feedback = [], heatmapMode }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map Only Once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      });

      // Using a more modern base map theme fitting GovFeedback Hub aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current!;

    // Clear existing markers to prevent duplicates on re-render
    layerGroup.clearLayers();

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 36px; height: 36px;
        background: linear-gradient(135deg, hsl(222,80%,45%), hsl(160,84%,39%));
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 6px 16px hsla(222,47%,11%,0.4);
        display: flex; align-items: center; justify-content: center;
      ">
        <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    const bounds = L.latLngBounds([]);

    buildings.forEach(b => {
      const lat = parseFloat(b.latitude);
      const lng = parseFloat(b.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend([lat, lng]);

        if (heatmapMode) {
          const bFeedback = feedback.filter(f => f.buildingId === b._id || f.buildingId?._id === b._id);
          
          let totalScore = 0;
          bFeedback.forEach(f => {
            if (f.sentiment === 'Positive' || f.rating >= 4) totalScore += 1;
            else if (f.sentiment === 'Neutral' || f.rating === 3) totalScore += 0.5;
          });

          const avgScore = bFeedback.length ? totalScore / bFeedback.length : 0.5;
          
          const radius = Math.min(800, 200 + (bFeedback.length * 30));
          const color = avgScore < 0.4 ? '#ef4444' : avgScore > 0.6 ? '#22c55e' : '#f59e0b';
          
          L.circle([lat, lng], {
            radius: radius,
            fillColor: color,
            fillOpacity: 0.6,
            color: color,
            weight: 2
          }).addTo(layerGroup).bindPopup(`
            <div style="font-family: 'Inter', sans-serif; text-align: center; padding: 6px;">
              <div style="font-weight: 800; font-size: 15px; color: #0f172a;">${b.name}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                <span style="font-size: 16px; font-weight: bold; color: ${color};">${bFeedback.length}</span> Feedback Submissions<br/>
                <b>Avg Sentiment: ${(avgScore * 100).toFixed(0)}%</b>
              </div>
            </div>
          `);
        } else {
          const marker = L.marker([lat, lng], { icon }).addTo(layerGroup);
          marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 2px;">
              <div style="font-weight: 800; font-size: 15px; margin-bottom: 6px; color: #0f172a;">${b.name}</div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 10px; line-height: 1.4;">${b.address}</div>
              <div style="
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                background: hsl(222,80%,45%,0.1);
                color: hsl(222,80%,45%);
              ">${b.type}</div>
            </div>
          `);
        }
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      // Default to center of India if no valid coordinates
      map.setView([20.5937, 78.9629], 5);
    }

  }, [buildings, feedback, heatmapMode, navigate]);

  return <div ref={mapRef} className="w-full h-full rounded-xl z-0" style={{ minHeight: '400px' }} />;
};

export default BuildingMap;
