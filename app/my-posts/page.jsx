import Link from "next/link";
import { redirect } from "next/navigation";
import ItemCard from "../../components/ItemCard";
import OwnerPostActions from "../../components/OwnerPostActions";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import StateMessage from "../../components/StateMessage";
import { mapRowToItem } from "../../lib/item-view";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "ประกาศของฉัน | ตามหา" };

export default async function MyPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data: rows, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container" id="main-content" tabIndex="-1">
        <div className="page-top">
          <div className="breadcrumb">
            <Link href="/">หน้าแรก</Link>
            <span>›</span>
            <span>ประกาศของฉัน</span>
          </div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">YOUR POSTS</div>
              <h1>ประกาศของฉัน</h1>
              <p>จัดการประกาศของหายและของที่พบที่คุณลงไว้</p>
            </div>
            <Link className="button button-primary" href="/report">
              ＋ ลงประกาศใหม่
            </Link>
          </div>
        </div>

        {error ? (
          <StateMessage
            icon="!"
            title="โหลดประกาศของคุณไม่สำเร็จ"
            text="กรุณาลองใหม่อีกครั้ง"
          />
        ) : rows?.length ? (
          <div className="owner-post-grid">
            {rows.map((row) => {
              const item = mapRowToItem(row);
              return (
                <div className="owner-post-card" key={row.id}>
                  <ItemCard item={item} />
                  <OwnerPostActions item={row} />
                </div>
              );
            })}
          </div>
        ) : (
          <StateMessage
            icon="📦"
            title="คุณยังไม่มีประกาศ"
            text="ประกาศที่คุณลงไว้จะแสดงอยู่ที่หน้านี้"
            action={{ href: "/report", label: "ลงประกาศแรก" }}
          />
        )}
        <div style={{ height: 70 }} />
      </main>
      <SiteFooter />
    </div>
  );
}
