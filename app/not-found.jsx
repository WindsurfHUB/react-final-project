import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-shell"><SiteHeader /><main className="container auth-wrap"><div className="empty-state"><span aria-hidden="true">⌕</span><h2>ไม่พบประกาศนี้</h2><p>ประกาศตัวอย่างนี้อาจไม่มีอยู่ ลองกลับไปดูรายการทั้งหมด</p><Link className="button button-primary" href="/items">ดูรายการประกาศ</Link></div></main><SiteFooter /></div>
  );
}
