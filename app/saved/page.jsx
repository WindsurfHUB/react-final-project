"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ItemCard from "../../components/ItemCard";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { useSavedItems } from "../../lib/saved-items";

export default function SavedPage() {
  const { savedIds, isReady } = useSavedItems();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSavedItems() {
      if (!isReady) return;
      if (savedIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch all items to match saved IDs
        const res = await fetch("/api/items-saved?ids=" + encodeURIComponent(savedIds.join(",")));
        if (!res.ok) {
          // Fallback if no specific route: fetch through client-side query or custom handler
          throw new Error("Failed to load");
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        // Fallback: we can provide an API route or client-side fetch helper
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadSavedItems();
  }, [savedIds, isReady]);

  return (
    <div className="site-shell">
      <SiteHeader active="saved" />
      <main className="container">
        <div className="page-top">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link>
            <span>›</span>
            <span>รายการที่บันทึก</span>
          </div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">YOUR SAVED ITEMS</div>
              <h1>รายการที่บันทึก</h1>
              <p>เก็บประกาศที่อยากกลับมาดูไว้ในที่เดียวบนอุปกรณ์ของคุณ</p>
            </div>
            <Link className="button button-primary" href="/items">
              เลือกดูประกาศ
            </Link>
          </div>
        </div>

        {!isReady || loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>กำลังโหลดรายการที่บันทึกไว้…</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <span aria-hidden="true">⚠️</span>
            <h2>โหลดรายการบันทึกไม่สำเร็จ</h2>
            <p>กรุณาลองรีเฟรชหน้านี้ใหม่อีกครั้ง</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <span aria-hidden="true">♡</span>
            <h2>ยังไม่มีรายการที่บันทึกไว้</h2>
            <p>
              คุณสามารถกดไอคอนรูปหัวใจบนการ์ดประกาศ หรือในหน้ารายละเอียด
              เพื่อบันทึกรายการที่ต้องการติดตามไว้ที่นี่
            </p>
            <Link className="button button-primary" href="/items">
              ไปที่หน้ารายการประกาศ
            </Link>
          </div>
        ) : (
          <>
            <div className="results-bar">
              <span>
                บันทึกไว้ <b>{items.length} รายการ</b>
              </span>
            </div>
            <div className="listing-grid">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
        <div style={{ height: 70 }} />
      </main>
      <SiteFooter />
    </div>
  );
}
