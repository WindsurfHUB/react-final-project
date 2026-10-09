"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LocationMap from "./LocationMap";
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

const reportSchema = z.object({
  item_type: z.enum(["lost", "found"]),
  title: z.string().trim().min(1, "กรุณาระบุชื่อสิ่งของ").max(120, "ชื่อสิ่งของต้องไม่เกิน 120 ตัวอักษร"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  description: z.string().max(2000, "รายละเอียดต้องไม่เกิน 2,000 ตัวอักษร"),
  occurred_at: z.string(),
  location_name: z.string().trim().min(1, "กรุณาระบุสถานที่").max(160, "สถานที่ต้องไม่เกิน 160 ตัวอักษร"),
});

const MAX_SOURCE_BYTES = Math.floor(3.5 * 1024 * 1024);

export default function ReportForm() {
  const [itemType, setItemType] = useState("lost");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const photoInputRef = useRef(null);
  const {
    register,
    handleSubmit: validateAndSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      item_type: "lost",
      title: "",
      category: "",
      description: "",
      occurred_at: "",
      location_name: "",
    },
  });

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

  async function handleSubmit(values) {
    if (pending) return;

    setPending(true);
    setFeedback(null);

    try {
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

      const result = await createItem({
        item_type: itemType,
        title: values.title,
        category: values.category,
        description: values.description,
        location_name: values.location_name,
        latitude: selectedPosition?.latitude ?? null,
        longitude: selectedPosition?.longitude ?? null,
        image_path: imagePath,
        occurred_at: values.occurred_at ? new Date(values.occurred_at).toISOString() : null,
      });

      if (!result.success) {
        if (imagePath) await deleteItemPhoto(imagePath);
        setFeedback({ type: "error", message: result.error });
        return;
      }

      reset();
      if (photoInputRef.current) photoInputRef.current.value = "";
      setPhoto(null);
      setItemType("lost");
      setSelectedPosition(null);
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
    <div className="form-layout">
      <section className="form-card">
        <h2>รายละเอียดสิ่งของ</h2>
        <p>กรอกข้อมูลพื้นฐานและตำแหน่ง เพื่อให้เจ้าของหรือผู้พบเห็นค้นหาได้ง่ายขึ้น</p>
        <form noValidate onSubmit={validateAndSubmit(handleSubmit)}>
          <input type="hidden" {...register("item_type")} />
          <fieldset className="report-type-picker" disabled={pending}>
            <legend className="form-label">ประเภทประกาศ</legend>
            <div className="choice-row">
            <button
              className={`choice ${itemType === "lost" ? "selected" : ""}`}
              type="button"
              aria-pressed={itemType === "lost"}
              onClick={() => {
                setItemType("lost");
                setValue("item_type", "lost", { shouldDirty: true, shouldValidate: true });
              }}
            >
              ◉ กำลังตามหาของ
            </button>
            <button
              className={`choice ${itemType === "found" ? "selected" : ""}`}
              type="button"
              aria-pressed={itemType === "found"}
              onClick={() => {
                setItemType("found");
                setValue("item_type", "found", { shouldDirty: true, shouldValidate: true });
              }}
            >
              ○ พบของ
            </button>
            </div>
          </fieldset>

        <div className="form-field">
          <label className="form-label" htmlFor="item-title">ชื่อสิ่งของ</label>
          <input className="form-control" id="item-title" maxLength={120} placeholder="เช่น หูฟังไร้สาย เคสสีขาว" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "item-title-error" : undefined} {...register("title")} />
          {errors.title ? <p className="form-error" id="item-title-error" role="alert">{errors.title.message}</p> : null}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-category">หมวดหมู่</label>
          <select className="form-control" id="item-category" defaultValue="" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "item-category-error" : undefined} {...register("category")}>
            <option value="" disabled>เลือกหมวดหมู่</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          {errors.category ? <p className="form-error" id="item-category-error" role="alert">{errors.category.message}</p> : null}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-description">รายละเอียดเพิ่มเติม</label>
          <textarea className="form-control" id="item-description" maxLength={2000} placeholder="สี ลักษณะ หรือจุดสังเกตของสิ่งของ" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "item-description-error" : undefined} {...register("description")} />
          {errors.description ? <p className="form-error" id="item-description-error" role="alert">{errors.description.message}</p> : null}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-date">วันที่พบหรือทำหาย</label>
          <input className="form-control" id="item-date" type="datetime-local" {...register("occurred_at")} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-location">สถานที่</label>
          <input className="form-control" id="item-location" maxLength={160} placeholder="อาคารหรือจุดที่พบ/ทำหาย" aria-invalid={Boolean(errors.location_name)} aria-describedby={errors.location_name ? "item-location-error" : undefined} {...register("location_name")} />
          {errors.location_name ? <p className="form-error" id="item-location-error" role="alert">{errors.location_name.message}</p> : null}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="item-photo">รูปภาพ (ไม่บังคับ)</label>
          <label className="upload-box upload-control" htmlFor="item-photo">
            {photoPreview ? <img className="report-photo-preview" src={photoPreview} alt="ตัวอย่างรูปภาพที่เลือก" /> : <span aria-hidden="true">＋</span>}
            <strong>{photo?.name || "เพิ่มรูปสิ่งของ"}</strong>
            <small>JPG, PNG หรือ WebP ไม่เกิน 3.5 MB · บีบอัดก่อนอัปโหลด</small>
            <input ref={photoInputRef} className="visually-hidden" id="item-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={pending} />
          </label>
          {photo ? <button className="button button-quiet report-remove-photo" type="button" onClick={() => { setPhoto(null); if (photoInputRef.current) photoInputRef.current.value = ""; }} disabled={pending}>เอารูปออก</button> : null}
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
      <aside className="form-aside">
        <h3>เลือกตำแหน่งบนแผนที่</h3>
        <p>แตะตำแหน่งที่ทำหายหรือพบ แล้วกรอกชื่ออาคารหรือสถานที่ในช่องสถานที่</p>
        <LocationMap
          label="เลือกตำแหน่งบนแผนที่ OpenStreetMap"
          interactive
          selectedPosition={selectedPosition}
          onSelect={setSelectedPosition}
        />
      </aside>
    </div>
  );
}
