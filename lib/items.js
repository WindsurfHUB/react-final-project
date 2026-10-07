// จุดเดียวที่หน้า UI ใช้ดึงข้อมูล ("/", "/items", "/items/[id]")
// คืนค่า { items, error } / { item, error } ในรูปแบบ UI (ดู lib/item-view.js)
//
// TODO: เมื่อ Titan ส่ง query จริงมา ให้แก้เฉพาะ 2 ฟังก์ชัน queryRows / queryRowById ด้านล่าง
// ให้คืนแถวจากตาราง items แบบ { data, error } แล้วลบ fallback demo ออก

import { createClient } from "./supabase/server";
import { mapRowToItem } from "./item-view";

// ---- Titan's Supabase queries -----------------------------------------------
async function queryRows({ limit } = {}) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      return { data: null, error: { message: error.message } };
    }
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}

async function queryRowById(id) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { data: null, error: { message: error.message } };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}
// ----------------------------------------------------------------------------

export async function getItems({ limit } = {}) {
  const res = await queryRows({ limit });
  if (res.error) return { items: [], error: res.error };
  return { items: (res.data ?? []).map(mapRowToItem), error: null };
}

export async function getItemById(id) {
  const res = await queryRowById(id);
  if (res.error) return { item: null, error: res.error };
  return { item: res.data ? mapRowToItem(res.data) : null, error: null };
}
