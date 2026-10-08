"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

/**
 * Server action to create a new lost/found report
 * Re-checks user authentication before mutation
 */
export async function createItem(formData) {
  try {
    const supabase = await createClient();

    // 1. Re-check authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนลงประกาศ" };
    }

    // 2. Parse input (supports both FormData and plain object)
    const rawData =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    const {
      item_type,
      title,
      category,
      description,
      location_name,
      latitude,
      longitude,
      image_path,
      occurred_at,
    } = rawData;

    // 3. Validate required fields
    if (!title || !String(title).trim()) {
      return { success: false, error: "กรุณาระบุชื่อสิ่งของ" };
    }
    if (!["lost", "found"].includes(item_type)) {
      return { success: false, error: "กรุณาระบุประเภทประกาศ (lost หรือ found)" };
    }
    if (!category || !String(category).trim()) {
      return { success: false, error: "กรุณาเลือกหมวดหมู่" };
    }

    // 4. Insert into database
    const { data, error } = await supabase
      .from("items")
      .insert({
        user_id: user.id,
        item_type,
        title: String(title).trim(),
        category: String(category).trim(),
        description: description ? String(description).trim() : null,
        location_name: location_name ? String(location_name).trim() : null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        image_path: image_path || null,
        occurred_at: occurred_at || new Date().toISOString(),
        status: "open",
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/items");

    return { success: true, item: data };
  } catch (err) {
    return {
      success: false,
      error: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    };
  }
}

/**
 * Server action to mark an item as resolved
 * Re-checks user authentication and ownership
 */
export async function markAsResolved(itemId) {
  try {
    const supabase = await createClient();

    // 1. Re-check authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
    }

    if (!itemId) {
      return { success: false, error: "ไม่พบรหัสประกาศ" };
    }

    // 2. Update item status to resolved
    const { data, error } = await supabase
      .from("items")
      .update({ status: "resolved" })
      .eq("id", itemId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/items");
    revalidatePath(`/items/${itemId}`);

    return { success: true, item: data };
  } catch (err) {
    return {
      success: false,
      error: err.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
    };
  }
}
