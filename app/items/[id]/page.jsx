import Link from "next/link";
import { notFound } from "next/navigation";
import LocationMap from "../../../components/LocationMap";
import SiteFooter from "../../../components/SiteFooter";
import SiteHeader from "../../../components/SiteHeader";
import { demoItems } from "../../../lib/demo-items";

export function generateStaticParams() {
  return demoItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = demoItems.find((entry) => entry.id === id);
  return { title: item ? `${item.title} | ตามหา` : "ไม่พบประกาศ | ตามหา" };
}

export default async function ItemDetailPage({ params }) {
  const { id } = await params;
  const item = demoItems.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <div className="site-shell">
      <SiteHeader active="items" />
      <main className="container">
        <div className="page-top">
          <div className="breadcrumb"><Link href="/">หน้าแรก</Link><span>›</span><Link href="/items">รายการประกาศ</Link><span>›</span><span>รายละเอียด</span></div>
        </div>
        <div className="detail-layout">
          <div className={`detail-photo ${item.tone}`}><span className="badge">{item.type === "found" ? "พบของ" : "ตามหาของ"}</span><span className="item-emoji" aria-hidden="true">{item.emoji}</span></div>
          <div className="detail-content">
            <span className="eyebrow"><span className="eyebrow-dot" /> {item.type === "found" ? "FOUND ITEM" : "LOST ITEM"}</span>
            <h1>{item.title}</h1>
            <div className="detail-meta">ลงประกาศ {item.when} · หมวดหมู่ {item.category}</div>
            <p className="detail-description">{item.description}</p>
            <div className="detail-info">
              <div className="detail-info-row"><span className="trust-icon">⌖</span><span><b>สถานที่</b><span>{item.location}</span></span></div>
              <div className="detail-info-row"><span className="trust-icon">◷</span><span><b>เวลาที่พบ/ทำหาย</b><span>{item.when}</span></span></div>
            </div>
            <LocationMap label={item.location} />
            <div className="demo-banner">ข้อมูลประกาศนี้เป็นตัวอย่างสำหรับพรีวิว</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
