import Link from "next/link";
import ItemCard from "../../components/ItemCard";
import ItemFilters from "../../components/ItemFilters";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import StateMessage from "../../components/StateMessage";
import { getItems } from "../../lib/items";

export const metadata = { title: "รายการประกาศ | ตามหา" };
export const dynamic = "force-dynamic";

export default async function ItemsPage({ searchParams }) {
  const params = await searchParams;
  const search = (params?.search || "").toLowerCase().trim();
  const type = params?.type || "all";
  const category = params?.category || "all";
  const status = params?.status || "all";

  const { items: allItems, error } = await getItems();

  // กรองข้อมูลตาม searchParams
  const filteredItems = (allItems || []).filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (category !== "all" && item.category !== category) return false;
    if (status !== "all" && item.status !== status) return false;

    if (search) {
      const titleMatch = (item.title || "").toLowerCase().includes(search);
      const locMatch = (item.location || "").toLowerCase().includes(search);
      const descMatch = (item.description || "").toLowerCase().includes(search);
      const catMatch = (item.category || "").toLowerCase().includes(search);
      if (!titleMatch && !locMatch && !descMatch && !catMatch) {
        return false;
      }
    }

    return true;
  });

  const isDemo = filteredItems.some((item) => item.isDemo);
  const hasActiveFilters = Boolean(
    search || type !== "all" || category !== "all" || status !== "all"
  );

  return (
    <div className="site-shell">
      <SiteHeader active="items" />
      <main className="container" id="main-content" tabIndex="-1">
        <div className="page-top">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link>
            <span>›</span>
            <span>รายการประกาศ</span>
          </div>

          <div className="page-title-row">
            <div>
              <div className="eyebrow">BROWSE THE BOARD</div>
              <h1>รายการประกาศ</h1>
              <p>เลือกดูของที่พบ หรือช่วยตามหาของที่หายไป</p>
            </div>
            <Link className="button button-primary" href="/report">
              ＋ แจ้งของหาย
            </Link>
          </div>

          {isDemo ? (
            <div className="demo-banner">
              <span aria-hidden="true">ⓘ</span> ข้อมูลตัวอย่างสำหรับพรีวิวหน้าตาแอป
            </div>
          ) : null}

          <ItemFilters totalCount={filteredItems.length} />

          {error ? (
            <StateMessage
              icon="!"
              title="โหลดข้อมูลไม่สำเร็จ"
              text="ลองรีเฟรชหน้านี้อีกครั้ง"
              action={{ href: "/items", label: "ลองใหม่" }}
            />
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true">{hasActiveFilters ? "⌕" : "📦"}</span>
              <h2>{hasActiveFilters ? "ไม่พบประกาศที่ตรงกับเงื่อนไข" : "ยังไม่มีประกาศ"}</h2>
              <p>
                {hasActiveFilters
                  ? "ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรายการทั้งหมด"
                  : "เป็นคนแรกที่ลงประกาศของหายหรือของที่พบในแคมปัส"}
              </p>
              {hasActiveFilters ? (
                <Link className="button button-light" href="/items">
                  ล้างตัวกรองทั้งหมด
                </Link>
              ) : (
                <Link className="button button-primary" href="/report">
                  แจ้งประกาศ
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="results-bar">
                <span>
                  แสดง <b>{filteredItems.length} ประกาศ</b>
                  {hasActiveFilters ? ` (จากทั้งหมด ${allItems.length} รายการ)` : ""}
                </span>
                <span>เรียงตาม: ล่าสุด</span>
              </div>
              <div className="listing-grid">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
