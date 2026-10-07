import Link from "next/link";
import ItemCard from "../../components/ItemCard";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import StateMessage from "../../components/StateMessage";
import { getItems } from "../../lib/items";

export const metadata = { title: "รายการประกาศ | ตามหา" };
export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const { items, error } = await getItems();
  const isDemo = items.some((item) => item.isDemo);

  return (
    <div className="site-shell">
      <SiteHeader active="items" />
      <main className="container">
        <div className="page-top">
          <div className="breadcrumb"><Link href="/">หน้าแรก</Link><span>›</span><span>รายการประกาศ</span></div>
          <div className="page-title-row">
            <div><div className="eyebrow">BROWSE THE BOARD</div><h1>รายการประกาศ</h1><p>เลือกดูของที่พบ หรือช่วยตามหาของที่หายไป</p></div>
            <Link className="button button-primary" href="/report">＋ แจ้งของหาย</Link>
          </div>
          {isDemo ? <div className="demo-banner"><span aria-hidden="true">ⓘ</span> ข้อมูลตัวอย่างสำหรับพรีวิวหน้าตาแอป</div> : null}
          <div className="search-panel">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="ค้นหาประกาศ" placeholder="ค้นหาชื่อสิ่งของหรือสถานที่…" disabled /></label>
            <button className="button button-primary" type="button" aria-disabled="true">ค้นหา</button>
          </div>
          <div className="filter-row" aria-label="ตัวกรอง">
            <span className="filter-chip active">ทั้งหมด</span><span className="filter-chip">ของหาย</span><span className="filter-chip">ของที่พบ</span><span className="filter-chip">⌄ หมวดหมู่</span><span className="filter-chip">⌖ สถานที่</span>
          </div>
          {error ? (
            <StateMessage icon="!" title="โหลดข้อมูลไม่สำเร็จ" text="ลองรีเฟรชหน้านี้อีกครั้ง" action={{ href: "/items", label: "ลองใหม่" }} />
          ) : items.length === 0 ? (
            <StateMessage title="ยังไม่มีประกาศ" text="เป็นคนแรกที่ลงประกาศของหายหรือของที่พบ" action={{ href: "/report", label: "แจ้งประกาศ" }} />
          ) : (
            <>
              <div className="results-bar"><span>แสดง <b>{items.length} ประกาศ</b></span><span>เรียงตาม: ล่าสุด</span></div>
              <div className="listing-grid">{items.map((item) => <ItemCard key={item.id} item={item} />)}</div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
