# Anwar Portfolio CMS

Portfolio pribadi Anwar dengan landing page publik, login admin, dan dashboard CMS. Seluruh konten project, experience, skill, dan achievement disimpan di Turso (libSQL) melalui Drizzle ORM. Autentikasi memakai bcrypt dan database-backed session.

## Fitur

- Landing page portfolio responsif yang membaca konten `published` dari database.
- Login admin dengan email dan password yang divalidasi di server.
- Session persisten di database dengan cookie `httpOnly`.
- Proteksi seluruh route `/admin` dan Server Action dengan `requireAdmin()`.
- Logout yang menghapus session database dan cookie.
- Rate limit login: 5 percobaan gagal per 15 menit per email + IP.
- CRUD Projects, Experiences & Career, Skills & Tech Stack, dan Achievements & Certs.
- Status draft/published, pencarian, filter, publish/unpublish, dan pengurutan naik/turun.
- Konfirmasi hapus, validasi Zod di server, error field, toast, dan empty state.
- Seed admin dan seed konten awal tanpa menyimpan password plaintext.
- Siap deploy ke Vercel Hobby + Turso free tier.

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
| `/` | Publik | Landing page dengan konten published |
| `/login` | Publik | Login admin |
| `/admin` | Session valid | Ringkasan statistik dan konten terbaru |
| `/admin/projects` | Session valid | CRUD project |
| `/admin/experiences` | Session valid | CRUD experience dan career |
| `/admin/skills` | Session valid | CRUD skill dan tech stack |
| `/admin/achievements` | Session valid | CRUD certificate dan award |

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

Lalu siapkan database, admin, dan konten awal:

```bash
npm run db:migrate
npm run db:seed
npm run db:seed:content
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
npm run db:seed:content
npm run dev
```

### Melihat Data

SQLite lokal:

```bash
sqlite3 local.db "SELECT email, name, role, length(password_hash) FROM users;"
sqlite3 local.db "SELECT id, user_id, datetime(expires_at, 'unixepoch') FROM sessions;"
sqlite3 local.db "SELECT status, count(*) FROM projects GROUP BY status;"
```

Turso:

```bash
turso db shell porto-anwar "SELECT email, name, role, length(password_hash) FROM users;"
turso db shell porto-anwar "SELECT status, count(*) FROM projects GROUP BY status;"
```

`created_at`, `expires_at`, `attempted_at`, dan `published_at` disimpan sebagai Unix timestamp detik. Gunakan `datetime(kolom, 'unixepoch')` untuk membacanya sebagai tanggal.

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
| `npm run db:seed:content` | Mengisi konten awal; ID yang sudah ada dilewati |

## Alur Autentikasi

1. Request ke `/admin` masuk ke server component.
2. `requireAdmin()` membaca cookie session dan memvalidasi hash token ke tabel `sessions`.
3. Jika tidak valid, user diarahkan ke `/login?next=/admin`.
4. Login memvalidasi input dengan Zod, mengecek rate limit, lalu membandingkan password dengan bcrypt.
5. Jika berhasil, server membuat token acak 32 byte, menyimpan SHA-256 token di database, dan mengirim cookie `httpOnly`.
6. Logout menghapus row session lalu menghapus cookie.

Session berlaku 7 hari, atau 30 hari jika "Ingat saya" dicentang.

## Alur CMS

1. Admin membuka halaman modul, misalnya `/admin/projects`.
2. Page server memanggil `requireAdmin()`, lalu membaca seluruh data (draft + published) dari database.
3. Form create/edit mengirim Server Action.
4. Action memanggil `requireAdmin()`, memvalidasi input dengan Zod, lalu insert/update/delete melalui `lib/cms/`.
5. Setelah mutasi, action memanggil `revalidatePath()` untuk halaman admin dan `/`.
6. Landing page hanya membaca data `published` dan langsung menampilkan perubahan.

Konten baru default berstatus draft. Gunakan tombol publish untuk menampilkannya di landing page. Gambar diisi lewat URL (HTTPS atau path internal `/...`), belum ada upload file.

## Data dan Validasi

- `projects`: title, summary, description, category, tags, image/repo/live URL, badge, status, sort order.
- `experiences`: role, organization, location, start/end date (`YYYY-MM`), current, description, icon, status, sort order.
- `skills`: name, category, years label, proficiency 0–100, icon, status, sort order.
- `achievements`: kind (`certificate`/`award`), title, issuer, issued date, image/credential URL, description, status, sort order.
- `endDate` wajib kosong untuk posisi yang masih aktif dan tidak boleh lebih awal dari `startDate`.
- Tags project menerima input dipisahkan koma dan disimpan sebagai array JSON.
- URL hanya menerima `https://`, `http://`, atau path internal `/...`.
- Delete bersifat permanen dan memakai dialog konfirmasi.
- `sortOrder` diatur ulang otomatis saat konten dipindahkan naik/turun.

## Keamanan

- Password disimpan sebagai hash bcrypt cost 12.
- Pesan gagal login selalu generik.
- Database hanya menyimpan hash token session.
- Cookie memakai `httpOnly`, `sameSite=lax`, `secure` di production, dan `path=/`.
- Parameter redirect `next` hanya menerima path internal.
- Setiap halaman admin dan Server Action memanggil `requireAdmin()`.
- Error database tidak dikirim ke client; client menerima pesan generik.
- Rate limit dan cleanup session/attempts dijalankan di server.
- Server Actions memvalidasi origin secara bawaan Next.js.

## Test

```bash
npm test
```

Test mencakup hashing password, pembuatan dan hashing token, expiry session, validasi redirect, rate limit, cleanup, lifecycle session, validasi Zod CMS, serta CRUD dan pengurutan konten terhadap database SQLite sementara.

## Deploy ke Vercel

1. Buat database Turso dan jalankan `npm run db:migrate`, `npm run db:seed`, serta `npm run db:seed:content` dari lokal/CI.
2. Tambahkan `TURSO_DATABASE_URL` dan `TURSO_AUTH_TOKEN` di Vercel Project Settings untuk Production dan Preview.
3. Jangan menambahkan `ADMIN_PASSWORD` ke runtime Vercel.
4. Deploy project.
5. Uji login, CRUD, publish/unpublish, dan landing page pada preview deployment.

Migrasi dan seed tidak dijalankan otomatis saat build Vercel untuk menghindari race condition.

## Struktur Utama

```text
app/
  admin/            Dashboard dan halaman modul CRUD + Server Actions
  login/            Halaman login dan Server Action login
  page.tsx          Landing page yang membaca konten published
components/
  admin/            UI dashboard dan modul CMS
  landing/          Section landing page
  login/            Form login
  ui/               Komponen shadcn/ui
lib/
  auth/             Password, session, cookie, guard, rate limit
  cms/              Tipe, validasi, query/mutasi, format, seed data
  db/               Schema dan client Drizzle/libSQL
drizzle/            Migration SQL
scripts/
  seed-admin.ts     Seed admin dari environment
  seed-content.ts   Seed konten portfolio awal
```
