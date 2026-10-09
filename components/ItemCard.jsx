import Link from "next/link";
import { getItemImageUrl } from "../lib/item-image";
import BookmarkButton from "./BookmarkButton";

export default function ItemCard({ item }) {
  const imageUrl = getItemImageUrl(item.imagePath);

  return (
    <article className="item-card">
      <div className="item-card-inner">
        <Link href={`/items/${item.id}`} aria-label={`ดูรายละเอียด ${item.title}`}>
          <div className={`item-card-photo ${item.tone}`}>
            <span className="badge">
              {item.type === "found" ? "พบของ" : "ตามหาของ"}
              {item.status === "resolved" ? " · ปิดแล้ว" : ""}
            </span>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title}
                className="item-card-img"
                loading="lazy"
              />
            ) : (
              <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
            )}
          </div>
          <div className="item-card-body">
            <h3>{item.title}</h3>
            <div className="item-card-meta">
              <span aria-hidden="true">⌖</span>
              <span>{item.location}</span>
            </div>
            <div className="item-card-footer">
              <span>{item.when} · {item.category}</span>
              <b>ดูรายละเอียด ↗</b>
            </div>
          </div>
        </Link>
        <BookmarkButton itemId={item.id} title={item.title} />
      </div>
    </article>
  );
}
