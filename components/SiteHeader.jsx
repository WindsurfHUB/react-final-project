"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8.5 12 4l7 4.5v7L12 20l-7-4.5z" />
        <path d="m5.5 8.8 6.5 4 6.5-4M12 13v6.5" />
        <path d="m9.1 6 7 4.2" />
      </svg>
    </span>
  );
}

export default function SiteHeader({ active = "" }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (isMounted) setUser(currentUser ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "บัญชีของฉัน";
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const avatarInitial = Array.from(userName.trim())[0] || "ฉัน";

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" href="/" aria-label="ตามหา หน้าแรก">
          <Mark />
          <span>ตามหา<small>CAMPUS LOST &amp; FOUND</small></span>
        </Link>
        <nav className="nav-links" aria-label="เมนูหลัก">
          <Link href="/" aria-current={active === "home" ? "page" : undefined}>หน้าแรก</Link>
          <Link href="/items" aria-current={active === "items" ? "page" : undefined}>รายการของ</Link>
          <Link href="/saved" aria-current={active === "saved" ? "page" : undefined}>รายการที่บันทึก</Link>
        </nav>
        <div className="nav-actions">
          {user ? (
            <Link
              className="profile-link"
              href="/my-posts"
              aria-label="จัดการประกาศของฉัน"
              title={`${userName} · จัดการประกาศของฉัน`}
            >
              <span className="profile-avatar" aria-hidden="true">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" />
                ) : (
                  avatarInitial
                )}
              </span>
            </Link>
          ) : (
            <Link className="button button-light" href="/login">เข้าสู่ระบบ</Link>
          )}
          <Link className="button button-primary" href="/report"><span aria-hidden="true">＋</span> แจ้งของหาย</Link>
        </div>
      </div>
    </header>
  );
}
