import Link from "next/link";

export default function StateMessage({ icon = "⌕", title, text, action }) {
  return (
    <div className="empty-state" role="status">
      <span aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
      {action ? (
        action.href ? (
          <Link className="button button-primary" href={action.href}>{action.label}</Link>
        ) : (
          <button className="button button-primary" type="button" onClick={action.onClick}>{action.label}</button>
        )
      ) : null}
    </div>
  );
}
