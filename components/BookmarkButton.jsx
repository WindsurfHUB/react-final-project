"use client";

import { useSavedItems } from "../lib/saved-items";

export default function BookmarkButton({ itemId, title, className = "card-heart" }) {
  const { isSaved, toggleSave, isReady } = useSavedItems();
  const saved = isReady && isSaved(itemId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(itemId);
  };

  return (
    <button
      type="button"
      className={`${className} ${saved ? "saved" : ""}`}
      onClick={handleClick}
      aria-label={saved ? `ยกเลิกการบันทึก ${title || "ประกาศ"}` : `บันทึก ${title || "ประกาศ"}`}
      title={saved ? "บันทึกแล้ว (คลิกเพื่อยกเลิก)" : "บันทึกรายการนี้"}
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
    </button>
  );
}
