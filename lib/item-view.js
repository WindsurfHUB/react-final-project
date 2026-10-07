// แปลงแถวจากตาราง items (Supabase) -> รูปแบบที่ UI ใช้ (ItemCard / หน้า detail)
const EMOJI_BY_CATEGORY = {
  "อุปกรณ์อิเล็กทรอนิกส์": "🎧",
  "ของใช้ส่วนตัว": "👛",
  "เอกสารและบัตร": "🪪",
  "กุญแจและอุปกรณ์": "🔑",
  "อุปกรณ์การเรียน": "📔",
};

export function formatWhen(value) {
  if (!value) return "ไม่ระบุเวลา";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ไม่ระบุเวลา";
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });
}

export function mapRowToItem(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category ?? "อื่น ๆ",
    type: row.item_type, // "lost" | "found"
    status: row.status ?? "open", // "open" | "resolved"
    location: row.location_name ?? "ไม่ระบุสถานที่",
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    when: formatWhen(row.occurred_at),
    description: row.description ?? "",
    imagePath: row.image_path ?? null,
    emoji: EMOJI_BY_CATEGORY[row.category] ?? "📦",
    tone: row.item_type === "found" ? "tone-sage" : "tone-blue",
    isDemo: false,
  };
}
