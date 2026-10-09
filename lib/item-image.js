// Helper สำหรับแปลง storage path เป็น public URL หรือเช็ค URL ของรูปภาพ

export function getItemImageUrl(imagePath) {
  if (!imagePath) return null;
  // ถ้าเป็น absolute URL อยู่แล้ว
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  
  // Storage public URL format สำหรับ bucket "item-photos"
  const cleanBase = supabaseUrl.replace(/\/+$/, "");
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${cleanBase}/storage/v1/object/public/item-photos/${cleanPath}`;
}
