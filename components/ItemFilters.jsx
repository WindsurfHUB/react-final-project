"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = [
  "อุปกรณ์อิเล็กทรอนิกส์",
  "ของใช้ส่วนตัว",
  "เอกสารและบัตร",
  "กุญแจและอุปกรณ์",
  "อุปกรณ์การเรียน",
];

export default function ItemFilters({ totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("type") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentStatus = searchParams.get("status") || "all";

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get("search")?.toString().trim() || "";
    updateFilters({ search: searchVal });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    currentSearch || currentType !== "all" || currentCategory !== "all" || currentStatus !== "all"
  );

  return (
    <div className="filter-wrapper">
      <form className="search-panel" onSubmit={handleSearchSubmit}>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            name="search"
            defaultValue={currentSearch}
            key={currentSearch}
            aria-label="ค้นหาประกาศ"
            placeholder="ค้นหาชื่อสิ่งของ สถานที่ หรือรายละเอียด…"
          />
        </label>
        <button className="button button-primary" type="submit" disabled={isPending}>
          {isPending ? "กำลังค้นหา…" : "ค้นหา"}
        </button>
      </form>

      <div className="filter-controls">
        <div className="filter-group" aria-label="กรองประเภทประกาศ">
          <span className="filter-group-label">ประเภท:</span>
          <button
            type="button"
            className={`filter-chip ${currentType === "all" ? "active" : ""}`}
            onClick={() => updateFilters({ type: "all" })}
          >
            ทั้งหมด
          </button>
          <button
            type="button"
            className={`filter-chip ${currentType === "lost" ? "active" : ""}`}
            onClick={() => updateFilters({ type: "lost" })}
          >
            ของหาย
          </button>
          <button
            type="button"
            className={`filter-chip ${currentType === "found" ? "active" : ""}`}
            onClick={() => updateFilters({ type: "found" })}
          >
            ของที่พบ
          </button>
        </div>

        <div className="filter-group" aria-label="กรองหมวดหมู่และสถานะ">
          <label className="filter-select-label">
            <span className="visually-hidden">หมวดหมู่</span>
            <select
              className="filter-select"
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value })}
            >
              <option value="all">หมวดหมู่ทั้งหมด</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-select-label">
            <span className="visually-hidden">สถานะ</span>
            <select
              className="filter-select"
              value={currentStatus}
              onChange={(e) => updateFilters({ status: e.target.value })}
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="open">กำลังตามหา / ยังไม่คืน</option>
              <option value="resolved">ส่งคืน / ปิดประกาศแล้ว</option>
            </select>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              className="button button-light button-reset-filter"
              onClick={clearAllFilters}
            >
              ล้างตัวกรอง ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
