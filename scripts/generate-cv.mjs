import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Generates the downloadable CV referenced by the landing page.
 * Run with: node scripts/generate-cv.mjs
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/anwar-cv.pdf");

const INK = "0.043 0.110 0.188";
const BLUE = "0.000 0.357 0.686";
const MUTED = "0.251 0.278 0.329";
const RULE = "0.753 0.776 0.839";

const operations = [];

const escapePdf = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const text = (value, x, y, font, size, color) => {
  operations.push(
    `${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${escapePdf(value)}) Tj ET`,
  );
};

const rule = (y, x1 = 56, x2 = 539) => {
  operations.push(`${RULE} RG 0.8 w ${x1} ${y} m ${x2} ${y} l S`);
};

const wrap = (value, maxCharacters) => {
  const words = value.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharacters && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
};

let y = 790;

text("ANWAR", 56, y, "F1", 26, INK);
y -= 22;
text("Fullstack & Backend Engineer", 56, y, "F2", 11, BLUE);
y -= 15;
text(
  "contact@anwar.dev  |  github.com/darektoa  |  Indonesia",
  56,
  y,
  "F2",
  9,
  MUTED,
);
y -= 12;
rule(y);
y -= 26;

const section = (title) => {
  y -= 6;
  text(title, 56, y, "F1", 11, BLUE);
  y -= 16;
};

section("PROFILE");
for (const line of wrap(
  "Software engineering graduate focused on resilient backend architectures, REST APIs, and polished fullstack interfaces. Three years building and deploying production systems with Laravel, React, and cloud infrastructure.",
  96,
)) {
  text(line, 56, y, "F2", 10, INK);
  y -= 13;
}

section("EXPERIENCE");
const experiences = [
  {
    role: "Backend Engineer",
    org: "PT. Indonesia Hakiki Pertama",
    period: "Oct 2021 - Present",
    description:
      "Deploy cloud servers and API providers with their web dashboards; own backend delivery from schema design to release.",
  },
  {
    role: "Frontend & Backend Engineer",
    org: "PT. Solusi Intek Indonesia",
    period: "Apr 2021 - Sep 2021",
    description:
      "Internship at a cyber technology company, shipping frontend and backend web features.",
  },
  {
    role: "Backend Mentor",
    org: "Dicoding Indonesia",
    period: "Jun 2021",
    description:
      "Facilitated the Backend for Beginner class during the AWS Cloud and Backend Scholarship 2021.",
  },
  {
    role: "Frontend Mentor",
    org: "Dicoding Indonesia",
    period: "Sep 2020",
    description:
      "Facilitated the MPWA class during the Baparekraf Digital Talent 2020 program.",
  },
];

for (const experience of experiences) {
  text(`${experience.role} - ${experience.org}`, 56, y, "F1", 10, INK);
  text(experience.period, 430, y, "F2", 9, MUTED);
  y -= 13;

  for (const line of wrap(experience.description, 104)) {
    text(line, 56, y, "F2", 9.5, MUTED);
    y -= 12;
  }

  y -= 6;
}

section("SELECTED WORK");
for (const line of [
  "Jakarta Marathon 2022 - REST API and admin dashboard for participant telemetry and race timing.",
  "Yukita App - REST microservices for community content distribution and tokenized auth.",
  "School Fintech Template - fee reconciliation, virtual account webhooks, and accounting statements.",
]) {
  for (const wrapped of wrap(line, 104)) {
    text(wrapped, 56, y, "F2", 9.5, MUTED);
    y -= 12;
  }
  y -= 2;
}

section("SKILLS");
for (const line of [
  "Frontend: HTML, CSS, JavaScript, React.js, Tailwind CSS, Bootstrap, Figma",
  "Backend: PHP, Laravel, Node.js, REST API design, authentication flows",
  "Data & Ops: MySQL, MariaDB, Redis, Git, Docker, Linux, CI/CD, Nginx",
]) {
  for (const wrapped of wrap(line, 104)) {
    text(wrapped, 56, y, "F2", 9.5, MUTED);
    y -= 12;
  }
}

section("CERTIFICATIONS");
for (const line of [
  "Dicoding - MPWA/Frontend Facilitator and Completion Certificates",
  "Dicoding - Backend Facilitator Certificate (AWS Cloud & Backend Scholarship)",
  "Progate - Node.js Path Completion Certificate",
  "Kominfo RI - Ready Set Code SQL Path Completion Certificate",
]) {
  text(line, 56, y, "F2", 9.5, MUTED);
  y -= 12;
}

rule(58);
text(
  "Portfolio: anwar.dev - Generated from the live portfolio content.",
  56,
  44,
  "F2",
  8,
  MUTED,
);

const content = operations.join("\n");
const objects = [];

objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
objects[3] =
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>";
objects[4] =
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
objects[5] =
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
objects[6] = `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`;

let pdf = "%PDF-1.4\n";
const offsets = [];

for (let index = 1; index < objects.length; index += 1) {
  offsets[index] = Buffer.byteLength(pdf, "latin1");
  pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, "latin1");
const objectCount = objects.length;

pdf += `xref\n0 ${objectCount}\n`;
pdf += "0000000000 65535 f \n";

for (let index = 1; index < objectCount; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}

pdf += `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, Buffer.from(pdf, "latin1"));

console.log(`Wrote ${output}`);
