"use client";

import dynamic from "next/dynamic";

const InteractiveLocationMap = dynamic(() => import("./InteractiveLocationMap"), {
  ssr: false,
  loading: () => <div className="map-card map-loading" aria-busy="true">กำลังโหลดแผนที่...</div>,
});

export default function LocationMap({
  label = "จุดตัวอย่างบนแผนที่",
  interactive = false,
  selectedPosition = null,
  onSelect,
}) {
  if (interactive) {
    return (
      <InteractiveLocationMap
        label={label}
        selectedPosition={selectedPosition}
        onSelect={onSelect}
      />
    );
  }

  return (
    <div className="map-card" role="img" aria-label={`${label} แผนที่ตัวอย่าง`}>
      <span className="map-label">⌖ {label}</span>
      <span className="map-attribution">© OpenStreetMap</span>
    </div>
  );
}
