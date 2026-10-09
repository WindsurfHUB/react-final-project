"use server";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "../supabase/server";

const ITEM_PHOTO_BUCKET = "item-photos";
const MAX_SOURCE_BYTES = Math.floor(3.5 * 1024 * 1024);
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadItemPhoto(formData) {
  try {
    const photo = formData.get("photo");
    if (!photo || typeof photo === "string" || typeof photo.arrayBuffer !== "function") {
      return { success: false, error: "กรุณาเลือกรูปภาพ" };
    }
    if (!ACCEPTED_IMAGE_TYPES.has(photo.type)) {
      return { success: false, error: "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP" };
    }
    if (photo.size > MAX_SOURCE_BYTES) {
      return { success: false, error: "รูปภาพต้องมีขนาดไม่เกิน 3.5 MB" };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง" };
    }

    const input = Buffer.from(await photo.arrayBuffer());
    const compressed = await sharp(input, { limitInputPixels: 36_000_000 })
      .rotate()
      .resize({ width: 1440, height: 1440, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();

    const path = `${user.id}/${randomUUID()}.jpg`;
    // TODO(Titan): Create the `item-photos` bucket and authenticated INSERT and
    // DELETE policies restricted to the caller's `<auth.uid()>/...` folder.
    // Decide and configure public/private read access before Pond renders photos.
    const { error } = await supabase.storage
      .from(ITEM_PHOTO_BUCKET)
      .upload(path, compressed, {
        cacheControl: "3600",
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      const lowerMessage = error.message?.toLowerCase() ?? "";
      if (error.statusCode === "404" || lowerMessage.includes("bucket not found")) {
        return {
          success: false,
          error: "ยังไม่ได้ตั้งค่า Storage bucket สำหรับรูปภาพ แจ้ง Titan ให้สร้าง bucket `item-photos` และกำหนด policy ก่อน หรือเอารูปออกแล้วส่งประกาศโดยไม่แนบรูป",
        };
      }
      return { success: false, error: `อัปโหลดรูปไม่สำเร็จ: ${error.message}` };
    }

    return { success: true, path };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองไฟล์อื่น",
    };
  }
}

export async function deleteItemPhoto(path) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || typeof path !== "string" || !path.startsWith(`${user.id}/`)) {
      return { success: false };
    }

    const { error } = await supabase.storage.from(ITEM_PHOTO_BUCKET).remove([path]);
    return { success: !error };
  } catch {
    return { success: false };
  }
}
