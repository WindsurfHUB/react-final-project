import Link from "next/link";
import ItemCard from "../components/ItemCard";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import StateMessage from "../components/StateMessage";
import { getItems } from "../lib/items";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items: latestItems, error } = await getItems({ limit: 3 });

  return (
    <div className="site-shell">
      <SiteHeader active="home" />
      <main id="main-content" tabIndex="-1">
        <section className="container hero">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> CAMPUS COMMUNITY</div>
            <h1>ของหาย<br />ตามหาได้<em>ง่ายขึ้น</em></h1>
            <p className="hero-copy">พื้นที่เล็ก ๆ ที่ช่วยให้ของสำคัญได้กลับบ้าน ค้นหาของที่พบหรือแจ้งสิ่งที่กำลังตามหาได้ในที่เดียว</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/items">ดูรายการทั้งหมด <span aria-hidden="true">→</span></Link>
              <Link className="button button-light" href="/report">＋ แจ้งของหาย</Link>
            </div>
            <div className="hero-note">
              <span className="avatar-stack" aria-hidden="true"><i className="avatar">อ</i><i className="avatar">ม</i><i className="avatar">พ</i><i className="avatar">น</i></span>
              <span>ช่วยกันดูแลของสำคัญในแคมปัส</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="ตัวอย่างประกาศของที่พบ">
            <div className="orb" /><div className="orbit" />
            <div className="floating-pin" aria-hidden="true">⌖</div>
            <div className="hero-item-card">
              <div className="hero-photo tone-sage"><span className="hero-label">พบของ · วันนี้</span><span className="item-emoji" aria-hidden="true">🎧</span></div>
              <div className="hero-item-bottom"><div><strong>หูฟังไร้สาย เคสสีขาว</strong><span>หอสมุดกลาง · ชั้น 2</span></div><span className="heart" aria-hidden="true">♡</span></div>
            </div>
            <div className="floating-note"><span className="note-check">✓</span><span><b>หนึ่งประกาศ อาจช่วยได้มาก</b><small>ชุมชนช่วยกันส่งคืนของสำคัญ</small></span></div>
          </div>
        </section>

        <section className="container trust-strip" aria-label="ภาพรวมตัวอย่าง">
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </span>
            <span><b>ค้นหาได้ในที่เดียว</b><span>แยกตามประเภทและหมวดหมู่</span></span>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <span><b>ระบุตำแหน่งได้</b><span>เห็นจุดที่พบหรือทำหายบนแผนที่</span></span>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
                <path d="M8.5 12h7" />
              </svg>
            </span>
            <span><b>ช่วยกันส่งคืน</b><span>ติดตามประกาศจนกว่าจะได้คืน</span></span>
          </div>
        </section>

        <section className="container section">
          <div className="section-heading">
            <div><div className="eyebrow">RECENT REPORTS</div><h2>ประกาศล่าสุด</h2><p>รายการของที่หายและของที่พบล่าสุด</p></div>
            <Link className="text-link" href="/items">ดูทั้งหมด <span aria-hidden="true">→</span></Link>
          </div>
          {error ? (
            <StateMessage icon="!" title="โหลดประกาศไม่สำเร็จ" text="ลองรีเฟรชหน้านี้อีกครั้ง" />
          ) : latestItems.length === 0 ? (
            <StateMessage title="ยังไม่มีประกาศ" text="เป็นคนแรกที่ลงประกาศ" action={{ href: "/report", label: "แจ้งประกาศ" }} />
          ) : (
            <div className="item-grid">{latestItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
          )}
        </section>

        <section className="container cta-band">
          <div><h2>เจอของที่ใครสักคนกำลังตามหาอยู่ไหม?</h2><p>ลงประกาศไว้ แล้วช่วยกันพาของสำคัญกลับไปหาเจ้าของ</p></div>
          <Link className="button" href="/report">เริ่มแจ้งประกาศ <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
