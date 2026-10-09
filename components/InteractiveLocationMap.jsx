"use client";

import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

const CAMPUS_CENTER = [18.7969, 98.9526];

function MapSelection({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });
  return null;
}

function CenterSelectionControl({ onSelect }) {
  const map = useMap();

  function selectCenter() {
    const center = map.getCenter();
    onSelect({
      latitude: Number(center.lat.toFixed(6)),
      longitude: Number(center.lng.toFixed(6)),
    });
  }

  return (
    <button
      className="map-center-control"
      type="button"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        selectCenter();
      }}
    >
      เลือกกึ่งกลางแผนที่
    </button>
  );
}

export default function InteractiveLocationMap({ label, selectedPosition, onSelect }) {
  const center = selectedPosition
    ? [selectedPosition.latitude, selectedPosition.longitude]
    : CAMPUS_CENTER;

  return (
    <div className="map-picker">
      <MapContainer
        className="map-card map-card-interactive"
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        keyboard
        aria-label={label}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSelection onSelect={onSelect} />
        <CenterSelectionControl onSelect={onSelect} />
        {selectedPosition ? (
          <CircleMarker
            center={center}
            radius={9}
            pathOptions={{ color: "#fff", weight: 3, fillColor: "#d77c52", fillOpacity: 1 }}
          />
        ) : null}
      </MapContainer>
      <p className="map-selection-status" aria-live="polite">
        {selectedPosition
          ? `พิกัดที่เลือก: ${selectedPosition.latitude}, ${selectedPosition.longitude}`
          : "แตะบนแผนที่ หรือเลื่อนแผนที่แล้วเลือกตำแหน่งกึ่งกลาง"}
      </p>
    </div>
  );
}