import Link from "next/link";
import ItemCard from "../../components/ItemCard";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { demoItems } from "../../lib/demo-items";

export const metadata = { title: "รายการประกาศ | ตามหา" };

export default function ItemsPage() {
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
          <div className="demo-banner"><span aria-hidden="true">ⓘ</span> ข้อมูลตัวอย่างสำหรับพรีวิวหน้าตาแอป</div>
          <div className="search-panel">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="ค้นหาประกาศ" placeholder="ค้นหาชื่อสิ่งของหรือสถานที่…" disabled /></label>
            <button className="button button-primary" type="button" aria-disabled="true">ค้นหา</button>
          </div>
          <div className="filter-row" aria-label="ตัวกรองตัวอย่าง">
            <span className="filter-chip active">ทั้งหมด</span><span className="filter-chip">ของหาย</span><span className="filter-chip">ของที่พบ</span><span className="filter-chip">⌄ หมวดหมู่</span><span className="filter-chip">⌖ สถานที่</span>
          </div>
          <div className="results-bar"><span>แสดง <b>{demoItems.length} ประกาศตัวอย่าง</b></span><span>เรียงตาม: ล่าสุด</span></div>
          <div className="listing-grid">{demoItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
