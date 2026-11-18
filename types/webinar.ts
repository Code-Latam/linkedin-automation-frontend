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
