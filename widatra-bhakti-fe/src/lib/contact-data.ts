// Shared types + seed data for the Admin "Contact Inbox" module.
// Every Contact form on the public site writes into this same store, so
// submissions show up in the Admin inbox in real time without a reload.

export type ContactReply = {
  id: string;
  message: string;
  sentAt: string; // ISO timestamp
};

export type ContactInquiry = {
  id: string;
  name: string;
  organization?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Which form on the site this came from, e.g. "Contact Page". */
  source: string;
  receivedAt: string; // ISO timestamp
  read: boolean;
  archived: boolean;
  replies: ContactReply[];
};

/** Derived, display-only status used for the StatusPill / filters. */
export type ContactStatus = "Unread" | "Read" | "Replied" | "Archived";

export function getContactStatus(inquiry: ContactInquiry): ContactStatus {
  if (inquiry.archived) return "Archived";
  if (inquiry.replies.length > 0) return "Replied";
  if (inquiry.read) return "Read";
  return "Unread";
}

/** Formats an ISO timestamp as a short relative label, e.g. "2h ago". */
export function formatReceivedAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function isoDaysAgo(days: number, hours = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    id: "ci-seed-1",
    name: "RS Premier Bintaro",
    organization: "RS Premier Bintaro",
    email: "procurement@rspremierbintaro.co.id",
    phone: "+62-21-7455-999",
    subject: "Bulk supply — Infusion NaCl 0.9%",
    message:
      "We are looking to place a recurring monthly order of Infusion NaCl 0.9% for our inpatient wards. Could you share pricing for bulk quantities and lead time?",
    source: "Contact Page",
    receivedAt: isoDaysAgo(0, 2),
    read: false,
    archived: false,
    replies: [],
  },
  {
    id: "ci-seed-2",
    name: "PT Kimia Farma Trading",
    organization: "PT Kimia Farma Trading & Distribution",
    email: "partnership@kimiafarma-trading.co.id",
    phone: "+62-21-4520-000",
    subject: "Distribution partnership inquiry",
    message:
      "Kimia Farma Trading is interested in exploring a regional distribution partnership for your infusion product line across East Indonesia. Please advise on next steps.",
    source: "Contact Page",
    receivedAt: isoDaysAgo(1),
    read: true,
    archived: false,
    replies: [],
  },
  {
    id: "ci-seed-3",
    name: "Dinas Kesehatan Jatim",
    organization: "Dinas Kesehatan Provinsi Jawa Timur",
    email: "pengadaan@dinkesjatim.go.id",
    phone: "+62-31-8280-000",
    subject: "Tender quotation request",
    message:
      "We are preparing a tender for provincial hospital supply and would like an official quotation for your infusion product catalog for FY2027.",
    source: "Contact Page",
    receivedAt: isoDaysAgo(2),
    read: true,
    archived: false,
    replies: [
      {
        id: "cr-seed-1",
        message:
          "Thank you for reaching out — our sales team has attached the FY2027 catalog and quotation to a follow-up email.",
        sentAt: isoDaysAgo(1, 20),
      },
    ],
  },
];
