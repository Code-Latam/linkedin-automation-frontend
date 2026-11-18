import { PublicWebinarEvent } from "@/types/webinar";

/**
 * Fetch a public webinar event by slug from the backend API.
 * Returns null when the event does not exist (or is draft/cancelled),
 * which the page maps to a 404.
 */
export async function getPublicWebinarEvent(
  slug: string
): Promise<PublicWebinarEvent | null> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base}/webinars/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load event (${res.status})`);

    const json = await res.json();
    return json?.data ?? null;
  } catch (err) {
    console.error("getPublicWebinarEvent error:", err);
    return null;
  }
}

export function formatEventDate(iso: string, timezone?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString("en-US", {
      timeZone: timezone || "America/New_York",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return d.toLocaleString("en-US");
  }
}
