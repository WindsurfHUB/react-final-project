import Link from "next/link";

export default function ItemCard({ item }) {
  // TODO(Pond): Render item.imagePath when the team settles the Storage read-access strategy.
  return (
    <article className="item-card">
      <Link href={`/items/${item.id}`} aria-label={`ดูรายละเอียด ${item.title}`}>
        <div className={`item-card-photo ${item.tone}`}>
          <span className="badge">{item.type === "found" ? "พบของ" : "ตามหาของ"}</span>
          <span className="card-heart" aria-hidden="true">♡</span>
          <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
        </div>
        <div className="item-card-body">
          <h3>{item.title}</h3>
          <div className="item-card-meta"><span aria-hidden="true">⌖</span>{item.location}</div>
          <div className="item-card-footer">
            <span>{item.when} · {item.category}</span>
            <b>ดูรายละเอียด ↗</b>
          </div>
        </div>
      </Link>
    </article>
  );
}
