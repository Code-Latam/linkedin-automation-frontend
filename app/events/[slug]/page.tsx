// app/events/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/navbar";
import WebinarRegistrationForm from "@/components/events/registration-form";
import { getPublicWebinarEvent, formatEventDate, formatAttendeeCount } from "@/lib/events";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicWebinarEvent(slug);

  if (!event) {
    return { title: "Event not found | Meeting Maker" };
  }

  return {
    title: `${event.title} | Meeting Maker`,
    description: event.description || `Register for ${event.title}`,
    robots: { index: true, follow: true },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getPublicWebinarEvent(slug);

  if (!event) {
    notFound();
  }

  const dateStr = formatEventDate(event.startsAt, event.timezone);
  const attendeeLabel = formatAttendeeCount(event.registeredCount);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">{event.title}</h1>
          {dateStr && <p className="text-gray-300 mt-3 text-lg">{dateStr}</p>}
          {event.location && <p className="text-gray-400 mt-1">{event.location}</p>}
        </div>

        {event.description && (
          <p className="text-gray-300 leading-relaxed mb-8 text-center">{event.description}</p>
        )}

        {event.status === "open" && event.isFull && (
          <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">This event is full</h3>
            <p className="text-gray-300">Registration has reached capacity. Check back for future events.</p>
          </div>
        )}

        {event.status === "open" && !event.isFull && (
          <WebinarRegistrationForm slug={event.slug} attendeeLabel={attendeeLabel} />
        )}

        {event.status === "completed" && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">This event has ended</h3>
            {event.recordingLink ? (
              <>
                <p className="text-gray-300 mb-4">Watch the recording below.</p>
                <a
                  href={event.recordingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition"
                >
                  Watch recording
                </a>
              </>
            ) : (
              <p className="text-gray-300">A recording will be available soon.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
