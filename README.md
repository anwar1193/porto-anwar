# Anwar Portfolio CMS

Portfolio pribadi Anwar dengan landing page publik, login admin, dan dashboard CMS. Autentikasi memakai Turso (libSQL), Drizzle ORM, bcrypt, dan database-backed session.

## Fitur

- Landing page portfolio yang responsif.
- Login admin dengan email dan password yang divalidasi di server.
- Session persisten di database dengan cookie `httpOnly`.
- Proteksi route `/admin` di server.
- Logout yang menghapus session database dan cookie.
- Rate limit login: 5 percobaan gagal per 15 menit per email + IP.
- Seed admin tanpa menyimpan password plaintext.
- Dashboard CMS untuk melihat ringkasan konten.
- Siap deploy ke Vercel Hobby + Turso free tier.

> Catatan: saat ini yang tersimpan di database adalah autentikasi dan session. Data project, experience, skill, dan certificate di dashboard masih berupa state React lokal dan akan reset saat refresh.

## Tech Stack

- Next.js 15 App Router + React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Turso (libSQL) + Drizzle ORM
- Zod
- bcryptjs
- Vitest

## Route

| Route | Akses | Fungsi |
|---|---|---|
| `/` | Publik | Landing page portfolio |
| `/login` | Publik | Login admin |
| `/admin` | Session valid | Dashboard CMS |

## Menjalankan Secara Lokal

Prasyarat: Node.js 20 atau lebih baru dan npm.

```bash
git clone https://github.com/anwar1193/porto-anwar.git
cd porto-anwar
npm install
```

### Opsi A: SQLite lokal

Cocok untuk development tanpa akun Turso.

```bash
cp .env.example .env.local
```

Ubah `.env.local` menjadi:

```bash
TURSO_DATABASE_URL="file:local.db"

ADMIN_EMAIL="admin@anwar.dev"
ADMIN_NAME="Anwar"
ADMIN_PASSWORD="ganti-dengan-password-minimal-12-karakter"
```

Lalu siapkan database dan admin:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Login di `/login` memakai nilai `ADMIN_EMAIL` dan `ADMIN_PASSWORD` yang Anda isi.

### Opsi B: Turso

```bash
turso auth login
turso db create porto-anwar
turso db show porto-anwar --url
turso db tokens create porto-anwar
```

Isi `.env.local`:

```bash
TURSO_DATABASE_URL="libsql://porto-anwar-<organization>.turso.io"
TURSO_AUTH_TOKEN="<token-dari-turso>"

ADMIN_EMAIL="admin@anwar.dev"
ADMIN_NAME="Anwar"
ADMIN_PASSWORD="ganti-dengan-password-minimal-12-karakter"
```

Jalankan migrasi dan seed:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

### Melihat Data

SQLite lokal:

```bash
sqlite3 local.db "SELECT email, name, role, length(password_hash) FROM users;"
sqlite3 local.db "SELECT id, user_id, datetime(expires_at, 'unixepoch') FROM sessions;"
```

Turso:

```bash
turso db shell porto-anwar "SELECT email, name, role, length(password_hash) FROM users;"
```

`created_at`, `expires_at`, dan `attempted_at` disimpan sebagai Unix timestamp detik. Gunakan `datetime(kolom, 'unixepoch')` untuk membacanya sebagai tanggal.

## Environment Variables

| Variable | Wajib | Keterangan |
|---|---|---|
| `TURSO_DATABASE_URL` | Ya | URL Turso atau `file:local.db` untuk development |
| `TURSO_AUTH_TOKEN` | Ya untuk Turso | Token database; kosongkan untuk SQLite lokal |
| `ADMIN_EMAIL` | Ya saat seed | Email admin, disimpan lowercase |
| `ADMIN_NAME` | Ya saat seed | Nama tampilan admin |
| `ADMIN_PASSWORD` | Ya saat seed | Minimal 12 karakter; hanya dipakai untuk hashing |

Jangan commit `.env.local`. File tersebut sudah diabaikan oleh `.gitignore`.

## Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Production build |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm test` | Menjalankan seluruh test |
| `npm run test:watch` | Test mode watch |
| `npm run db:generate` | Generate migration setelah schema berubah |
| `npm run db:migrate` | Terapkan migration ke database |
| `npm run db:seed` | Membuat atau memperbarui admin dari env |

## Alur Autentikasi

1. Request ke `/admin` masuk ke server component.
2. `requireAdmin()` membaca cookie session dan memvalidasi hash token ke tabel `sessions`.
3. Jika tidak valid, user diarahkan ke `/login?next=/admin`.
4. Login memvalidasi input dengan Zod, mengecek rate limit, lalu membandingkan password dengan bcrypt.
5. Jika berhasil, server membuat token acak 32 byte, menyimpan SHA-256 token di database, dan mengirim cookie `httpOnly`.
6. Logout menghapus row session lalu menghapus cookie.

Session berlaku 7 hari, atau 30 hari jika "Ingat saya" dicentang.

## Keamanan

- Password disimpan sebagai hash bcrypt cost 12.
- Pesan gagal login selalu generik.
- Database hanya menyimpan hash token session.
- Cookie memakai `httpOnly`, `sameSite=lax`, `secure` di production, dan `path=/`.
- Parameter redirect `next` hanya menerima path internal.
- Rate limit dan cleanup session/attempts dijalankan di server.
- Server Actions memvalidasi origin secara bawaan Next.js.

## Test

```bash
npm test
```

Test mencakup hashing password, pembuatan dan hashing token, expiry session, validasi redirect, rate limit, cleanup, dan lifecycle session terhadap database SQLite sementara.

## Deploy ke Vercel

1. Buat database Turso dan jalankan `npm run db:migrate` serta `npm run db:seed` dari lokal/CI.
2. Tambahkan `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` di Vercel Project Settings untuk Production dan Preview.
3. Jangan menambahkan `ADMIN_PASSWORD` ke runtime Vercel.
4. Deploy project.
5. Uji login dan logout pada preview deployment.

Migrasi tidak dijalankan otomatis saat build Vercel untuk menghindari race condition.

## Struktur Utama

```text
app/
  admin/            Dashboard dan Server Action logout
  login/            Halaman login dan Server Action login
  page.tsx          Landing page
components/
  admin/            UI dashboard CMS
  landing/          Section landing page
  login/            Form login
  ui/               Komponen shadcn/ui
lib/
  auth/             Password, session, cookie, guard, rate limit
  db/               Schema dan client Drizzle/libSQL
drizzle/            Migration SQL
scripts/
  seed-admin.ts     Seed admin dari environment
```
