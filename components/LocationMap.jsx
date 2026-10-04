export default function LocationMap({ label = "จุดตัวอย่างบนแผนที่" }) {
  return (
    <div className="map-card" role="img" aria-label={`${label} แผนที่ตัวอย่าง`}>
      <span className="map-label">⌖ {label}</span>
      <span className="map-attribution">© OpenStreetMap</span>
    </div>
  );
}
