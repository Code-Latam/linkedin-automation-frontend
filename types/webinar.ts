export type WebinarStatus = "draft" | "open" | "completed" | "cancelled";

export interface WebinarEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  meetingLink: string;
  recordingLink: string;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  status: WebinarStatus;
  capacity: number | null;
  remindersSent: string[];
  registeredCount?: number;
  createdAt: string;
  updatedAt: string;
  // Recurring series (anchor = repeatsWeekly, generated occurrence = seriesOf).
  repeatsWeekly?: boolean;
  recurrenceIntervalWeeks?: number; // 1 = weekly, 2 = every 2 weeks, 3, 4
  recurrenceEndsAt?: string | null;
  maxOccurrences?: number | null;
  lastGeneratedStartsAt?: string | null;
  seriesOf?: string | null;
  occurrenceIndex?: number | null;
  // Computed by GET /admin/webinars — next upcoming occurrence of the series.
  nextOccurrenceAt?: string | null;
}

export interface WebinarRegistration {
  _id: string;
  eventId: string;
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  linkedInUrl: string;
  status: "registered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Public view returned by GET /webinars/:slug
export interface PublicWebinarEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  status: WebinarStatus;
  capacity: number | null;
  registeredCount: number;
  isFull: boolean;
  meetingLink?: string;
  recordingLink?: string;
}
