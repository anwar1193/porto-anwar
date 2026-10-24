import { landingPortrait } from "./images";

/* ------------------------------------------------------------------ */
/* Non-CMS content                                                     */
/* ------------------------------------------------------------------ */

export const portrait = landingPortrait;

export const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "experiences", label: "Experiences" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const socialLinks = [
  {
    label: "GitHub Repository",
    href: "https://github.com/darektoa",
    icon: "code",
  },
  {
    label: "LinkedIn Profile",
    href: "https://linkedin.com",
    icon: "work",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "photo_camera",
  },
  {
    label: "Direct Email",
    href: "mailto:contact@anwar.dev",
    icon: "mail",
  },
];

/* ------------------------------------------------------------------ */
/* Demo-only inbox (CRUD inbox is out of scope for v1)                 */
/* ------------------------------------------------------------------ */

export type InboxMessage = {
  initials: string;
  name: string;
  role: string;
  time: string;
  message: string;
  email: string;
  tone: "primary" | "secondary" | "tertiary";
};

export const inboxMessages: InboxMessage[] = [
  {
    initials: "DS",
    name: "Dimas Setiawan",
    role: "Tech Recruiter • PT Finovasi Digital",
    time: "10m lalu",
    message:
      "\"Halo Anwar, kami tertarik dengan portfolio arsitektur backend Laravel & Kafka Anda. Apakah open untuk obrolan tech-lead screening minggu ini?\"",
    email: "recruiter@example.com",
    tone: "primary",
  },
  {
    initials: "NW",
    name: "Nadia Wijaya",
    role: "VP Product • SaaS ScaleUp SG",
    time: "2j lalu",
    message:
      "\"Hi Anwar, we saw your Omnichannel PWA showcase. We need a contractor to build our Next.js frontend checkout module over the next 2 months.\"",
    email: "nadia@example.sg",
    tone: "secondary",
  },
  {
    initials: "RI",
    name: "Rendy Irawan",
    role: "Founder • Studio Kreasi Web",
    time: "Kemarin",
    message:
      "\"Bro Anwar, minta izin kutip arsitektur repo Smart Attendance Anda untuk referensi skripsi kampus boleh?\"",
    email: "rendy@example.com",
    tone: "tertiary",
  },
];
