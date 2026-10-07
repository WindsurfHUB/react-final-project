// จุดเดียวที่หน้า UI ใช้ดึงข้อมูล ("/", "/items", "/items/[id]")
// คืนค่า { items, error } / { item, error } ในรูปแบบ UI (ดู lib/item-view.js)
//
// TODO: เมื่อ Titan ส่ง query จริงมา ให้แก้เฉพาะ 2 ฟังก์ชัน queryRows / queryRowById ด้านล่าง
// ให้คืนแถวจากตาราง items แบบ { data, error } แล้วลบ fallback demo ออก

import { demoItems } from "./demo-items";
import { mapRowToItem } from "./item-view";

const withDemoFlag = (item) => ({ ...item, status: "open", isDemo: true });

// ---- SWAP HERE (Titan's queries) -------------------------------------------
async function queryRows({ limit } = {}) {
  // ตัวอย่างเมื่อมี query จริง:
  // return await fetchItems({ limit });   // -> { data: [rows], error }
  return { data: null, error: null, demo: demoItems.slice(0, limit ?? demoItems.length) };
}

async function queryRowById(id) {
  // return await fetchItemById(id);       // -> { data: row | null, error }
  return { data: null, error: null, demo: demoItems.find((i) => i.id === id) ?? null };
}
// ----------------------------------------------------------------------------

export async function getItems({ limit } = {}) {
  const res = await queryRows({ limit });
  if (res.error) return { items: [], error: res.error };
  if (res.data) return { items: res.data.map(mapRowToItem), error: null };
  return { items: (res.demo ?? []).map(withDemoFlag), error: null };
}

export async function getItemById(id) {
  const res = await queryRowById(id);
  if (res.error) return { item: null, error: res.error };
  if (res.data) return { item: mapRowToItem(res.data), error: null };
  return { item: res.demo ? withDemoFlag(res.demo) : null, error: null };
}
