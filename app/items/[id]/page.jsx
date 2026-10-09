import Link from "next/link";
import { notFound } from "next/navigation";
import BookmarkButton from "../../../components/BookmarkButton";
import LocationMap from "../../../components/LocationMap";
import ResolveItemButton from "../../../components/ResolveItemButton";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { getItemImageUrl } from "../../../lib/item-image";
import { getItemById } from "../../../lib/items";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { item } = await getItemById(id);
  return { title: item ? `${item.title} | ตามหา` : "ไม่พบประกาศ | ตามหา" };
}

export default async function ItemDetailPage({ params }) {
  const { id } = await params;
  const { item, error } = await getItemById(id);
  if (error) throw new Error(error.message ?? "โหลดประกาศไม่สำเร็จ");
  if (!item) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canResolve = Boolean(user && user.id === item.userId && item.status === "open");
  const imageUrl = getItemImageUrl(item.imagePath);

  return (
    <div className="site-shell">
      <SiteHeader active="items" />
      <main className="container" id="main-content" tabIndex="-1">
        <div className="page-top">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link>
            <span>›</span>
            <Link href="/items">รายการประกาศ</Link>
            <span>›</span>
            <span>รายละเอียด</span>
          </div>
        </div>
        <div className="detail-layout">
          <div className={`detail-photo ${item.tone}`}>
            <span className="badge">
              {item.type === "found" ? "พบของ" : "ตามหาของ"}
              {item.status === "resolved" ? " · ปิดแล้ว" : ""}
            </span>
            <div className="detail-actions-top">
              <BookmarkButton itemId={item.id} title={item.title} className="detail-heart" />
            </div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title}
                className="detail-photo-img"
              />
            ) : (
              <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
            )}
          </div>
          <div className="detail-content">
            <span className="eyebrow">
              <span className="eyebrow-dot" /> {item.type === "found" ? "FOUND ITEM" : "LOST ITEM"}
            </span>
            <h1>{item.title}</h1>
            <div className="detail-meta">
              ลงประกาศ {item.when} · หมวดหมู่ {item.category}
              {item.status === "resolved" && (
                <span className="status-badge-resolved">✓ ปิดประกาศแล้ว (ส่งคืนเรียบร้อย)</span>
              )}
            </div>
            <p className="detail-description">{item.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
            <div className="detail-info">
              <div className="detail-info-row">
                <span className="trust-icon">⌖</span>
                <span>
                  <b>สถานที่</b>
                  <span>{item.location}</span>
                </span>
              </div>
              <div className="detail-info-row">
                <span className="trust-icon">◷</span>
                <span>
                  <b>เวลาที่พบ/ทำหาย</b>
                  <span>{item.when}</span>
                </span>
              </div>
              <div className="detail-info-row">
                <span className="trust-icon">●</span>
                <span>
                  <b>สถานะประกาศ</b>
                  <span>{item.status === "resolved" ? "ส่งคืนเรียบร้อยแล้ว" : "กำลังติดตาม / รอดำเนินการ"}</span>
                </span>
              </div>
            </div>
            <LocationMap label={item.location} />
            {canResolve ? <ResolveItemButton itemId={item.id} /> : null}
            {item.isDemo ? <div className="demo-banner">ข้อมูลประกาศนี้เป็นตัวอย่างสำหรับพรีวิว</div> : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
