import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Dashboard CMS",
  description:
    "Panel manajemen konten portofolio Anwar: proyek, pengalaman, keahlian, dan pesan masuk.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
