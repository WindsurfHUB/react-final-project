import { NextResponse } from "next/server";
import { getItems } from "../../../lib/items";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ items: [] });
    }

    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const { items, error } = await getItems();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const matched = (items || []).filter((item) => ids.includes(item.id));
    return NextResponse.json({ items: matched });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
