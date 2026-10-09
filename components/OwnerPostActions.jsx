"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteItem, updateItem } from "../lib/actions/items";

const CATEGORIES = [
  "อุปกรณ์อิเล็กทรอนิกส์",
  "ของใช้ส่วนตัว",
  "เอกสารและบัตร",
  "กุญแจและอุปกรณ์",
  "อุปกรณ์การเรียน",
  "อื่น ๆ",
];

export default function OwnerPostActions({ item }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleUpdate(event) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setFeedback(null);
    try {
      const result = await updateItem(item.id, new FormData(event.currentTarget));
      if (!result?.success) {
        setFeedback({ type: "error", message: result?.error || "แก้ไขประกาศไม่สำเร็จ" });
        return;
      }
      setEditing(false);
      setFeedback({ type: "success", message: "บันทึกการแก้ไขแล้ว" });
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "แก้ไขประกาศไม่สำเร็จ กรุณาลองอีกครั้ง" });
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (pending || !window.confirm(`ต้องการลบประกาศ “${item.title}” ใช่หรือไม่?`)) return;

    setPending(true);
    setFeedback(null);
    try {
      const result = await deleteItem(item.id);
      if (!result?.success) {
        setFeedback({ type: "error", message: result?.error || "ลบประกาศไม่สำเร็จ" });
        return;
      }
      if (result.warning) window.alert(result.warning);
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "ลบประกาศไม่สำเร็จ กรุณาลองอีกครั้ง" });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="owner-post-actions" aria-label={`จัดการประกาศ ${item.title}`}>
      {feedback ? (
        <p className={`auth-message auth-message-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
          {feedback.message}
        </p>
      ) : null}

      {editing ? (
        <form className="owner-edit-form" onSubmit={handleUpdate}>
          <div className="form-field">
            <label className="form-label" htmlFor={`type-${item.id}`}>ประเภทประกาศ</label>
            <select className="form-control" id={`type-${item.id}`} name="item_type" defaultValue={item.item_type} required disabled={pending}>
              <option value="lost">ของหาย</option>
              <option value="found">พบของ</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`title-${item.id}`}>ชื่อสิ่งของ</label>
            <input className="form-control" id={`title-${item.id}`} name="title" defaultValue={item.title} maxLength={120} required disabled={pending} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`category-${item.id}`}>หมวดหมู่</label>
            <select className="form-control" id={`category-${item.id}`} name="category" defaultValue={item.category} required disabled={pending}>
              {!CATEGORIES.includes(item.category) ? <option value={item.category}>{item.category}</option> : null}
              {CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`description-${item.id}`}>รายละเอียดเพิ่มเติม</label>
            <textarea className="form-control" id={`description-${item.id}`} name="description" defaultValue={item.description ?? ""} maxLength={2000} disabled={pending} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor={`location-${item.id}`}>สถานที่</label>
            <input className="form-control" id={`location-${item.id}`} name="location_name" defaultValue={item.location_name ?? ""} maxLength={160} disabled={pending} />
          </div>
          <div className="owner-action-buttons">
            <button className="button button-primary" type="submit" disabled={pending}>
              {pending ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button className="button button-light" type="button" onClick={() => { setEditing(false); setFeedback(null); }} disabled={pending}>
              ยกเลิก
            </button>
          </div>
        </form>
      ) : (
        <div className="owner-action-buttons">
          <button className="button button-light" type="button" onClick={() => { setFeedback(null); setEditing(true); }} disabled={pending}>
            แก้ไขประกาศ
          </button>
          <button className="button button-danger" type="button" onClick={handleDelete} disabled={pending}>
            {pending ? "กำลังลบ..." : "ลบประกาศ"}
          </button>
        </div>
      )}
    </section>
  );
}
