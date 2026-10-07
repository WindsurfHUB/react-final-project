import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export default function Loading() {
  return (
    <div className="site-shell">
      <SiteHeader active="items" />
      <main className="container">
        <div className="page-top" aria-busy="true" aria-live="polite">
          <p>กำลังโหลดประกาศ…</p>
          <div className="listing-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="item-card" style={{ minHeight: 240, opacity: 0.5 }} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
