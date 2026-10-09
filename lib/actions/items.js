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

const ITEM_CATEGORIES = new Set([
  "อุปกรณ์อิเล็กทรอนิกส์",
  "ของใช้ส่วนตัว",
  "เอกสารและบัตร",
  "กุญแจและอุปกรณ์",
  "อุปกรณ์การเรียน",
  "อื่น ๆ",
]);

function readFormValue(formData, name) {
  const value = formData instanceof FormData ? formData.get(name) : formData?.[name];
  return typeof value === "string" ? value.trim() : "";
}

function revalidateItemRoutes(itemId) {
  revalidatePath("/");
  revalidatePath("/items");
  revalidatePath("/saved");
  revalidatePath("/my-posts");
  if (itemId) revalidatePath(`/items/${itemId}`);
}

/** Update only the editable fields of a report owned by the current user. */
export async function updateItem(itemId, formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนแก้ไขประกาศ" };
    }
    if (typeof itemId !== "string" || !itemId.trim()) {
      return { success: false, error: "ไม่พบรหัสประกาศ" };
    }

    const itemType = readFormValue(formData, "item_type");
    const title = readFormValue(formData, "title");
    const category = readFormValue(formData, "category");
    const description = readFormValue(formData, "description");
    const locationName = readFormValue(formData, "location_name");

    if (!["lost", "found"].includes(itemType)) {
      return { success: false, error: "กรุณาเลือกประเภทประกาศ" };
    }
    if (!title || title.length > 120) {
      return { success: false, error: "ชื่อสิ่งของต้องมี 1–120 ตัวอักษร" };
    }
    if (!category || !ITEM_CATEGORIES.has(category)) {
      return { success: false, error: "กรุณาเลือกหมวดหมู่ที่ถูกต้อง" };
    }
    if (description.length > 2000 || locationName.length > 160) {
      return { success: false, error: "รายละเอียดหรือสถานที่ยาวเกินกำหนด" };
    }

    const { data, error } = await supabase
      .from("items")
      .update({
        item_type: itemType,
        title,
        category,
        description: description || null,
        location_name: locationName || null,
      })
      .eq("id", itemId)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "ไม่พบประกาศหรือคุณไม่มีสิทธิ์แก้ไข" };

    revalidateItemRoutes(itemId);
    return { success: true, item: data };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "เกิดข้อผิดพลาดในการแก้ไขประกาศ",
    };
  }
}

/** Delete a report owned by the current user and then remove its owned photo. */
export async function deleteItem(itemId) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนลบประกาศ" };
    }
    if (typeof itemId !== "string" || !itemId.trim()) {
      return { success: false, error: "ไม่พบรหัสประกาศ" };
    }

    const { data: item, error: lookupError } = await supabase
      .from("items")
      .select("id, image_path")
      .eq("id", itemId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) return { success: false, error: lookupError.message };
    if (!item) return { success: false, error: "ไม่พบประกาศหรือคุณไม่มีสิทธิ์ลบ" };

    const { data: deleted, error: deleteError } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (deleteError) return { success: false, error: deleteError.message };
    if (!deleted) return { success: false, error: "ลบประกาศไม่สำเร็จหรือคุณไม่มีสิทธิ์ลบ" };

    let warning = null;
    if (item.image_path) {
      if (!item.image_path.startsWith(`${user.id}/`)) {
        warning = "ลบประกาศแล้ว แต่ไม่ได้ลบรูปเนื่องจากไม่พบสิทธิ์เจ้าของไฟล์";
      } else {
        const { error: photoError } = await supabase.storage
          .from("item-photos")
          .remove([item.image_path]);
        if (photoError) warning = "ลบประกาศแล้ว แต่ลบรูปไม่สำเร็จ กรุณาติดต่อผู้ดูแลระบบ";
      }
    }

    revalidateItemRoutes(itemId);
    return { success: true, warning };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "เกิดข้อผิดพลาดในการลบประกาศ",
    };
  }
}
