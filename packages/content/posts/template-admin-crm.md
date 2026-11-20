---
title: Apa saja isi template admin CRM?
excerpt: Kebanyakan tabel, yaitu tabel yang bisa dipersempit, bisa mengurus banyak baris sekaligus, dan tiap barisnya membuka halaman sendiri.
tags: Design System, React, Tailwind CSS, TanStack, Web App
publishedAt: 2026-11-19
lang: id
translationOf: crm-admin-template
cover: https://haryarrahman.tech/posts/crm-admin-template/companies-v2.jpg
share: https://haryarrahman.tech/og/template-admin-crm.png
---

*Seri Template, bagian 5 dari 6. Kodenya ada di repo.*

Jawaban singkat: kebanyakan tabel. Tabel yang bisa dipersempit, bisa mengurus banyak baris sekaligus, dan tiap barisnya membuka halaman sendiri. Deal tampil sebagai board, dan hampir semuanya putih dan abu-abu.

## Yang saya buat

Tidewell, admin CRM contoh. Isinya perusahaan, orang, board deal, tugas, catatan, dan laporan. Semua namanya rekaan.

Coba di sini: [tidewell.blog.haryarrahman.tech](https://tidewell.blog.haryarrahman.tech)

![Tabel perusahaan Tidewell dengan view, kolom, filter, pill status, dan pemilik](https://haryarrahman.tech/posts/crm-admin-template/companies-v2.jpg)

*Daftar perusahaan. Birunya hampir cuma ada di tombol New company.*

## Tabel panjang harus bisa dipersempit

Daftar perusahaan cepat jadi panjang, dan mencari satu nama dengan scroll itu melelahkan.

Jadi tabelnya punya kotak cari, view seperti My companies, dan filter. Tiap filter tampil sebagai chip yang terbaca seperti kalimat, misalnya "Status is Customer". Tiap kolom juga bisa diurutkan.

![Kiri: daftar perusahaan yang panjang tanpa filter. Kanan: daftar yang sama dengan chip Status is Customer, tinggal tiga baris](https://haryarrahman.tech/posts/crm-admin-template/narrow-id.png)

*Satu chip, dan yang tersisa cuma pelanggan.*

## Banyak baris bisa diurus sekaligus

Kadang banyak baris perlu diubah dengan cara yang sama. Satu per satu itu lambat.

Jadi tiap baris punya kotak centang. Begitu ada yang dicentang, muncul bar dengan Assign, Add to list, Email, dan Delete. Pilihanmu berlaku untuk semua baris yang dicentang.

![Kiri: pemilik diganti di satu baris saja. Kanan: tiga baris dicentang dan bar aksi muncul di bawahnya](https://haryarrahman.tech/posts/crm-admin-template/bulk-id.png)

*Tiga baris dicentang, satu bar untuk ketiganya.*

## Deal itu tahapan, bukan daftar

Deal bergerak dari Lead sampai Won atau Lost. Di tabel, tahap itu cuma satu kata di kolom.

Jadi deal saya tampilkan sebagai board. Tiap tahap jadi kolom dengan totalnya, dan memindah deal cukup dengan menggeser kartunya. Tampilan tabelnya tetap ada.

![Kiri: deal sebagai daftar dengan kolom tahap. Kanan: deal sebagai board dengan kolom Lead, Qualified, dan Proposal, satu kartu sedang digeser](https://haryarrahman.tech/posts/crm-admin-template/board-id.png)

*Kartu yang digeser pindah tahap, dan total kolomnya ikut berubah.*

## Warna cuma dipakai kalau ada artinya

Tabel CRM penuh nama, angka, dan status. Kalau tombol dan avatar ikut berwarna, mata tidak tahu harus melihat ke mana.

Jadi hampir semuanya putih dan abu-abu. Ada satu biru untuk yang bisa diklik, seperti tombol utama dan link. Avatar tetap abu-abu. Warna lain cuma dipakai untuk membedakan, seperti pill status yang kecil.

![Kiri: tombol dan avatar dengan banyak warna. Kanan: tabel yang sama dengan satu tombol biru dan avatar abu-abu](https://haryarrahman.tech/posts/crm-admin-template/colour-id.png)

*Tabel yang sama. Di kanan, yang penting langsung kelihatan.*

## Sisanya ikut tabel

- **Tabelnya dibuat sekali.** Perusahaan, orang, dan tabel deal memakainya, jadi semuanya bekerja dengan cara yang sama.
- **Tiap baris membuka halaman sendiri**, berisi catatan, tugas, deal, dan aktivitas perusahaan atau orang itu.
- **Sisanya ada di sekitarnya**: home, tugas, catatan, laporan, settings, dan pencarian dengan ⌘K.

![Board deal dengan kolom Lead, Qualified, dan Proposal, tiap kartu menampilkan nilai, tanggal, dan pemilik](https://haryarrahman.tech/posts/crm-admin-template/deals-board-v2.jpg)

*Board deal yang asli. Tiap tahap punya warna titiknya sendiri; tombol New deal biru.*

Layout-nya dari Attio, lewat layarnya di Mobbin: sidebar berkelompok, tabel lebar, dan halaman untuk tiap perusahaan dan orang. Yang saya ambil cuma idenya, bukan nama, logo, ikon, atau warnanya.

## Kesimpulan

Isi template admin CRM sebagian besar tabel, dan tiga hal membuatnya enak dipakai:

- Tabel yang bisa dipersempit dan mengurus banyak baris sekaligus.
- Board untuk deal, karena deal bergerak antar tahap.
- Satu biru untuk aksi, dan warna lain cuma untuk membedakan.

## Angka-angkanya

| | Light | Dark |
|---|---|---|
| Latar | `#FFFFFF` | `#0F0F0F` |
| Sidebar | `#FAFAFA` | `#141414` |
| Garis | `#EBEBEB` | `#2A2A2A` |
| Teks | `#141414` | `#F5F5F5` |
| Label | `#737373` | `#9A9A9A` |
| Aksi | `#2450E6` | `#2450E6` |
| Link | `#2450E6` | `#8FA5FF` |
| Avatar | `#EAEAEA` | `#2A2A2A` |
| Status | `#34C759` `#FF9500` `#FF3B30` `#8E8E93` | sama |

Font-nya font bawaan sistem. Teks biasa 15px, tabel dan tombol 14px, judul 20 sampai 24px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/app-crm](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-crm).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-crm
   (live preview: https://tidewell.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Bagian 6](https://haryarrahman.tech/blog/template-dashboard-keuangan-gelap) adalah Ledgerfinch, dashboard keuangan yang dimulai dalam dark mode.
