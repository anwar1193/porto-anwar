import {
  adminProjectImages,
  certificateImages,
  landingPortrait,
  projectImages,
} from "./images";

/* ------------------------------------------------------------------ */
/* Landing page content                                                */
/* ------------------------------------------------------------------ */

export type LandingProject = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  image: string;
};

export const landingProjects: LandingProject[] = [
  {
    title: "Rest API and Admin Dashboard Jakarta Marathon 2022",
    description:
      "High-concurrency marathon participant telemetry endpoints with real-time race timing and administrative portal.",
    tags: ["#Laravel", "#PHP", "#Bootstrap"],
    category: "Backend & CMS",
    image: projectImages[0],
  },
  {
    title: "Rest API and Admin Dashboard Yukita App",
    description:
      "Centralized REST microservices architecture handling community content distribution and tokenized auth flow.",
    tags: ["#Laravel", "#PHP", "#Bootstrap"],
    category: "Fullstack API",
    image: projectImages[1],
  },
  {
    title: "School Fintech Full Feature Template",
    description:
      "Automated student fee reconciliation, virtual account webhooks, and granular parental accounting statements.",
    tags: ["#Laravel", "#Bootstrap", "#Javascript"],
    category: "Fintech Template",
    image: projectImages[2],
  },
  {
    title: "Laravel Component Admin Template",
    description:
      "Reusable Blade component architecture with zero-dependency vanilla script helpers and datatable bindings.",
    tags: ["#Laravel", "#Bootstrap", "#Javascript"],
    category: "Admin System",
    image: projectImages[3],
  },
  {
    title: "Kampoeng Cireundeu Tasikmalaya Profile Website",
    description:
      "Cultural preservation and local news hub optimized for fast mobile indexing and accessible community engagement.",
    tags: ["#ReactJs", "#HTML", "#CSS"],
    category: "Community Web",
    image: projectImages[4],
  },
  {
    title: "Indodesign Company Profile Website",
    description:
      "Tailored corporate agency identity site with high-performance asset loading, lead capture, and custom Gutenberg blocks.",
    tags: ["#Wordpress", "#HTML", "#CSS"],
    category: "Agency Site",
    image: projectImages[5],
  },
  {
    title: "Gmail Landing Page Clone - 98% Identical",
    description:
      "Pixel-precise responsive recreation of the Google Workspace consumer landing view with CSS layout mastery.",
    tags: ["#ReactJs", "#HTML", "#CSS"],
    category: "Frontend Clone",
    image: projectImages[6],
  },
  {
    title: "Generasi Cuan Profile Website",
    description:
      "Progressive Web Application delivering wealth-building masterclasses and offline-first community podcasts.",
    tags: ["#PWA", "#Javascript", "#HTML", "#CSS"],
    category: "PWA Showcase",
    image: projectImages[7],
  },
  {
    title: "Rexam Web App - Rexensoft Exam",
    description:
      "Resilient progressive examination engine with anti-cheat browser focus trapping and local storage state recovery.",
    tags: ["#PWA", "#Javascript", "#HTML", "#CSS"],
    category: "EdTech PWA",
    image: projectImages[8],
  },
  {
    title: "Frests Web App - Finding Restaurants",
    description:
      "Location-aware culinary locator application backed by IndexedDB cache and Indexed Search APIs for high efficiency.",
    tags: ["#PWA", "#Javascript", "#HTML", "#CSS"],
    category: "FoodTech PWA",
    image: projectImages[9],
  },
  {
    title: "Rexballs Web App - Football Standings",
    description:
      "Live football standings, match fixtures, and push notification integrations for top European league tournaments.",
    tags: ["#PWA", "#Javascript", "#HTML", "#CSS"],
    category: "Sports App",
    image: projectImages[10],
  },
];

export type Certificate = {
  issuer: string;
  title: string;
  image: string;
};

export const certificates: Certificate[] = [
  {
    issuer: "Dicoding Indonesia",
    title: "Dicoding - MPWA/Frontend Facilitator Certificate",
    image: certificateImages[0],
  },
  {
    issuer: "AWS & Dicoding",
    title: "Dicoding - Backend Facilitator Certificate",
    image: certificateImages[1],
  },
  {
    issuer: "Dicoding Academy",
    title: "Dicoding - MPWA/Frontend Completion Certificate",
    image: certificateImages[2],
  },
  {
    issuer: "Intek Cyber Tech",
    title: "PT. Solusi Intek Indonesia - Internship Completion Certificate",
    image: certificateImages[3],
  },
  {
    issuer: "Progate",
    title: "Progate - Node.js Path Completion Certificate",
    image: certificateImages[4],
  },
  {
    issuer: "Kominfo RI",
    title: "Ready Set Code Kominfo - SQL Path Completion Certificate",
    image: certificateImages[5],
  },
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  description: string;
  icon: string;
  active?: boolean;
};

export const experiences: Experience[] = [
  {
    role: "Frontend Mentor",
    org: "Dicoding Indonesia",
    period: "Sep 2020",
    description:
      "Been a mentor or facilitator in the MPWA dicoding class, during the Baparekraf Digital Talent 2020 event.",
    icon: "devices",
  },
  {
    role: "Backend Mentor",
    org: "Dicoding Indonesia",
    period: "Jun 2021",
    description:
      "Been a mentor or facilitator in the Backend for Beginner dicoding class, during the AWS Cloud and Backend Scholarship 2021 event.",
    icon: "dns",
  },
  {
    role: "Frontend & Backend Engineer",
    org: "PT. Solusi Intek Indonesia",
    period: "Apr 2021 - Sep 2021",
    description:
      "Internship at a cyber technology base company as a frontend and backend web engineer.",
    icon: "layers",
  },
  {
    role: "Backend Engineer",
    org: "PT. Indonesia Hakiki Pertama",
    period: "Oct 2021 - Present",
    description:
      "Work as backend engineer, deploy on cloud servers and API providers along with their web dashboards.",
    icon: "terminal",
    active: true,
  },
];

export type Skill = {
  name: string;
  years: string;
  icon: string;
};

export const skills: Skill[] = [
  { name: "HTML", years: "3 Years", icon: "html" },
  { name: "CSS", years: "3 Years", icon: "css" },
  { name: "Javascript", years: "3 Years", icon: "javascript" },
  { name: "PHP", years: "3 Years", icon: "php" },
  { name: "GIT", years: "3 Years", icon: "fork_right" },
  { name: "Laravel", years: "2 Years", icon: "dataset" },
  { name: "React Js", years: "2 Years", icon: "deployed_code" },
  { name: "Node Js", years: "6 Months", icon: "developer_board" },
  { name: "Bootstrap", years: "3 Years", icon: "grid_view" },
  { name: "Tailwind CSS", years: "3 Years", icon: "waves" },
  { name: "MySQL", years: "3 Years", icon: "database" },
  { name: "MariaDB", years: "3 Years", icon: "storage" },
  { name: "Figma", years: "3 Months", icon: "draw" },
];

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

export const portrait = landingPortrait;

/* ------------------------------------------------------------------ */
/* Admin CMS content                                                   */
/* ------------------------------------------------------------------ */

export type AdminProjectStatus = "Published" | "Draft";

export type AdminProject = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  status: AdminProjectStatus;
  views: string;
  image?: string;
  icon?: string;
  tag?: string;
};

export const adminProjectCategories = [
  "Fullstack Apps",
  "Backend Microservices",
  "Data Engineering",
];

export const initialAdminProjects: AdminProject[] = [
  {
    id: "erp-cloud",
    title: "ERP Cloud Enterprise Platform",
    summary:
      "Multi-tenant modular system with role-based access & automated invoicing",
    tags: ["Laravel 11", "React 18", "PostgreSQL", "Docker"],
    category: "Fullstack Apps",
    status: "Published",
    views: "4,921",
    image: adminProjectImages[0],
    tag: "ERP",
  },
  {
    id: "commerce-pwa",
    title: "Omichannel Commerce PWA",
    summary:
      "Instant checkout, Redis cart synchronization, and Midtrans gateway hook",
    tags: ["Next.js", "Tailwind CSS", "Redis", "Midtrans"],
    category: "Fullstack Apps",
    status: "Published",
    views: "3,410",
    image: adminProjectImages[1],
    tag: "PWA",
  },
  {
    id: "smart-attendance",
    title: "Smart Attendance & Geofencing",
    summary:
      "Biometric face match verification with mock-location anti-fraud engine",
    tags: ["Vue 3", "Express.js", "Leaflet"],
    category: "Backend Microservices",
    status: "Published",
    views: "2,154",
    image: adminProjectImages[2],
    tag: "IoT",
  },
  {
    id: "clickstream",
    title: "Micro-SaaS Clickstream Engine",
    summary: "High-throughput ingestion pipeline with ClickHouse & Apache Kafka",
    tags: ["Go / Golang", "ClickHouse", "Kafka"],
    category: "Data Engineering",
    status: "Draft",
    views: "-",
    icon: "data_thresholding",
    tag: "WIP",
  },
];

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

export type SkillLevel = {
  label: string;
  value: number;
  note: string;
  dotClass: string;
  barClass: string;
};

export const adminSkillLevels: SkillLevel[] = [
  {
    label: "PHP & Laravel Ecosystem",
    value: 92,
    note: "92% • Expert",
    dotClass: "bg-primary",
    barClass: "bg-primary",
  },
  {
    label: "JavaScript / TypeScript (React & Next)",
    value: 88,
    note: "88% • Advanced",
    dotClass: "bg-secondary-container",
    barClass: "bg-secondary-container",
  },
  {
    label: "SQL / Database & Redis Cache",
    value: 85,
    note: "85% • Proficient",
    dotClass: "bg-secondary",
    barClass: "bg-secondary",
  },
  {
    label: "DevOps (Docker, Linux CI/CD, Nginx)",
    value: 78,
    note: "78% • Intermediate",
    dotClass: "bg-tertiary",
    barClass: "bg-tertiary",
  },
];
