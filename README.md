# Sistem Manajemen Media-Zefanya v3 (Taman)

Aplikasi web untuk manajemen data fasilitas taman dan vegetasi/tanaman yang terhubung langsung ke Supabase.

## Fitur Utama

- **Manajemen Taman & Tanaman** - Tambah, edit, hapus, dan lihat data area taman serta koleksi tanaman di dalamnya.
- **Pencarian & Status** - Filter kondisi tanaman dan pencarian nama taman secara instan.
- **Mode Guru** - Verifikasi keamanan khusus administrator menggunakan password (`zefanya123`).
- **Sinkronisasi Supabase** - Seluruh data tersimpan terpusat di proyek Supabase `dytcoemthbngxoamoetr` tabel `taman`.

## Tech Stack

- Frontend: HTML, CSS, JavaScript / Frontend Framework
- Backend / Database: Supabase PostgreSQL (`dytcoemthbngxoamoetr`)
- Deployment Lokal: PM2 Process Manager (Port 8082)

## Perbandingan Versi Media-Zefanya (v1, v2, v3)

| Versi | Nama Proyek / Topik | Tabel Supabase | Port PM2 | Repository GitHub | Deskripsi Singkat |
|---|---|---|---|---|---|
| **v1** | Skripsi | `skripsi` | 8080 | `Carelyk/Media-Zefanya` | Manajemen data skripsi & nilai mahasiswa |
| **v2** | Buku | `buku` | 8081 | `Carelyk/Media-Zefanya-v2` | Manajemen inventaris perpustakaan dan buku |
| **v3** | Taman | `taman` | 8082 | `Carelyk/Media-Zefanya-v3` | Manajemen data fasilitas taman kota & tanaman |
