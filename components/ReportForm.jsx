"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createItem } from "../lib/actions/items";
import { deleteItemPhoto, uploadItemPhoto } from "../lib/actions/item-photos";

const categories = [
  "อุปกรณ์อิเล็กทรอนิกส์",
  "ของใช้ส่วนตัว",
  "เอกสารและบัตร",
  "กุญแจและอุปกรณ์",
  "อุปกรณ์การเรียน",
  "อื่น ๆ",
];

const MAX_SOURCE_BYTES = Math.floor(3.5 * 1024 * 1024);

// Temporary working form for the Windsurf integration.
// TODO(Nick): Reconcile with your Zod/React Hook Form UI and interactive map picker.
export default function ReportForm() {
  const [itemType, setItemType] = useState("lost");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return undefined;
    }
    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0] ?? null;
    setFeedback(null);
    if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhoto(null);
      event.target.value = "";
      setFeedback({ type: "error", message: "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP" });
      return;
    }
    if (file && file.size > MAX_SOURCE_BYTES) {
      setPhoto(null);
      event.target.value = "";
      setFeedback({ type: "error", message: "รูปภาพต้องมีขนาดไม่เกิน 3.5 MB" });
      return;
    }
    setPhoto(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setFeedback(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      let imagePath = null;

      if (photo) {
        const photoData = new FormData();
        photoData.set("photo", photo);
        const uploadResult = await uploadItemPhoto(photoData);
        if (!uploadResult.success) {
          setFeedback({ type: "error", message: uploadResult.error });
          return;
        }
        imagePath = uploadResult.path;
      }

      const dateValue = String(formData.get("occurred_at") ?? "");
      const occurredAt = dateValue ? new Date(dateValue).toISOString() : null;
      const result = await createItem({
        item_type: itemType,
        title: formData.get("title"),
        category: formData.get("category"),
        description: formData.get("description"),
        location_name: formData.get("location_name"),
        // TODO(Nick): Replace these empty coordinates with the interactive map picker values.
        latitude: null,
        longitude: null,
        image_path: imagePath,
        occurred_at: occurredAt,
      });

      if (!result.success) {
        if (imagePath) await deleteItemPhoto(imagePath);
        setFeedback({ type: "error", message: result.error });
        return;
      }

      form.reset();
      setPhoto(null);
      setItemType("lost");
      setFeedback({ type: "success", itemId: result.item.id, message: "บันทึกประกาศแล้ว" });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "ส่งประกาศไม่สำเร็จ กรุณาลองอีกครั้ง",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="form-card">
      <h2>รายละเอียดสิ่งของ</h2>
      <p>กรอกข้อมูลพื้นฐานและตำแหน่ง เพื่อให้เจ้าของหรือผู้พบเห็นค้นหาได้ง่ายขึ้น</p>
      <form onSubmit={handleSubmit}>
        <fieldset className="report-type-picker" disabled={pending}>
          <legend className="form-label">ประเภทประกาศ</legend>
          <div className="choice-row">
            <button
              className={`choice ${itemType === "lost" ? "selected" : ""}`}
              type="button"
              aria-pressed={itemType === "lost"}
              onClick={() => setItemType("lost")}
            >
              ◉ กำลังตามหาของ
            </button>
            <button
              className={`choice ${itemType === "found" ? "selected" : ""}`}
              type="button"
              aria-pressed={itemType === "found"}
              onClick={() => setItemType("found")}
            >
              ○ พบของ
            </button>
          </div>
        </fieldset>

        <div className="form-field">
          <label className="form-label" htmlFor="item-title">ชื่อสิ่งของ</label>
          <input className="form-control" id="item-title" name="title" maxLength={120} placeholder="เช่น หูฟังไร้สาย เคสสีขาว" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-category">หมวดหมู่</label>
          <select className="form-control" id="item-category" name="category" defaultValue="" required>
            <option value="" disabled>เลือกหมวดหมู่</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-description">รายละเอียดเพิ่มเติม</label>
          <textarea className="form-control" id="item-description" name="description" maxLength={2000} placeholder="สี ลักษณะ หรือจุดสังเกตของสิ่งของ" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-date">วันที่พบหรือทำหาย</label>
          <input className="form-control" id="item-date" name="occurred_at" type="datetime-local" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-location">สถานที่</label>
          <input className="form-control" id="item-location" name="location_name" maxLength={160} placeholder="อาคารหรือจุดที่พบ/ทำหาย" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-photo">รูปภาพ (ไม่บังคับ)</label>
          <label className="upload-box upload-control" htmlFor="item-photo">
            {photoPreview ? <img className="report-photo-preview" src={photoPreview} alt="ตัวอย่างรูปภาพที่เลือก" /> : <span aria-hidden="true">＋</span>}
            <strong>{photo?.name || "เพิ่มรูปสิ่งของ"}</strong>
            <small>JPG, PNG หรือ WebP ไม่เกิน 3.5 MB · บีบอัดก่อนอัปโหลด</small>
            <input className="visually-hidden" id="item-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={pending} />
          </label>
          {photo ? <button className="button button-quiet report-remove-photo" type="button" onClick={() => setPhoto(null)} disabled={pending}>เอารูปออก</button> : null}
        </div>

        {feedback ? (
          <div className={`report-feedback report-feedback-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"} aria-live="polite">
            {feedback.message}
            {feedback.itemId ? <> · <Link href={`/items/${feedback.itemId}`}>ดูประกาศ</Link></> : null}
          </div>
        ) : null}

        <button className="button button-primary report-submit" type="submit" disabled={pending}>
          {pending ? "กำลังบันทึกประกาศ…" : "ส่งประกาศ"}
        </button>
      </form>
    </section>
  );
}
