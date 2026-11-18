// app/events/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/navbar";
import { getPublicWebinarEvents, formatEventDate } from "@/lib/events";
import { PublicWebinarEvent } from "@/types/webinar";

export const metadata: Metadata = {
  title: "Webinars & Events | Meeting Maker",
  description:
    "Register for upcoming webinars and watch recordings of past events.",
  robots: { index: true, follow: true },
};

export default async function EventsPage() {
  const events = await getPublicWebinarEvents();
  const upcoming = events.filter((e) => e.status === "open");
  const past = events.filter((e) => e.status === "completed");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Webinars &amp; Events</h1>
          <p className="text-gray-400 mt-3">
            Register for live webinars or watch recordings of past events.
          </p>
        </div>

        {events.length === 0 && (
          <p className="text-gray-400 text-center mt-16">
            No events right now — check back soon.
          </p>
        )}

        {upcoming.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming</h2>
            <div className="space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Past Events</h2>
            <div className="space-y-4">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function EventCard({ event }: { event: PublicWebinarEvent }) {
  const dateStr = formatEventDate(event.startsAt, event.timezone);
  const isOpen = event.status === "open";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          {dateStr && <p className="text-gray-400 mt-1">{dateStr}</p>}
          {event.location && <p className="text-gray-500 mt-1">{event.location}</p>}
        </div>
        {isOpen ? (
          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
            Registration open
          </span>
        ) : (
          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
            Past event
          </span>
        )}
      </div>

      <p className="text-cyan-400 mt-4 text-sm font-medium">
        {isOpen ? "Register →" : "Watch recording →"}
      </p>
    </Link>
  );
}
