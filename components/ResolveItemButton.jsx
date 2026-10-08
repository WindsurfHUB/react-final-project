"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markAsResolved } from "../lib/actions/items";

export default function ResolveItemButton({ itemId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleResolve() {
    if (pending) return;

    setPending(true);
    setError("");

    try {
      const result = await markAsResolved(itemId);
      if (!result?.success) {
        setError(result?.error || "อัปเดตสถานะไม่สำเร็จ กรุณาลองอีกครั้ง");
        return;
      }
      router.refresh();
    } catch {
      setError("อัปเดตสถานะไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="resolve-action">
      <button className="button button-primary" type="button" onClick={handleResolve} disabled={pending}>
        {pending ? "กำลังอัปเดต..." : "ทำเครื่องหมายว่าได้คืนแล้ว"}
      </button>
      {error ? <p className="auth-message auth-message-error" role="alert">{error}</p> : null}
    </div>
  );
}
