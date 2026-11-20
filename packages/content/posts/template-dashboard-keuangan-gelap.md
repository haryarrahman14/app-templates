---
title: Gimana mendesain dashboard keuangan yang dimulai dalam dark mode?
excerpt: Latar hampir hitam, teks putih, dan tiap warna diberi satu tugas. Begini urutan keputusannya, dengan angkanya.
tags: Design System, React, Tailwind CSS, TanStack, Web App
publishedAt: 2026-11-19
lang: id
translationOf: dark-finance-dashboard-template
cover: https://haryarrahman.tech/posts/dark-finance-dashboard-template/overview-dark-v2.jpg
share: https://haryarrahman.tech/og/template-dashboard-keuangan-gelap.png
---

*Seri Template, bagian 6 dari 6. Kodenya ada di repo.*

Jawaban singkat: bukan dengan latar hitam pekat. Latarnya hampir hitam, teksnya putih, dan tiap warna cuma punya satu tugas. Warna brand untuk tombol, hijau dan merah untuk naik dan turun.

## Yang saya buat

Ledgerfinch, dashboard keuangan contoh. Isinya chart portfolio, daftar saham, dan halaman untuk tiap saham. Semua nama dan harganya rekaan.

Coba di sini: [ledgerfinch.blog.haryarrahman.tech](https://ledgerfinch.blog.haryarrahman.tech)

![Overview Ledgerfinch dalam dark mode: chart portfolio amber, ringkasan harian, dan agenda mendatang, dengan dock di bawah](https://haryarrahman.tech/posts/dark-finance-dashboard-template/overview-dark-v2.jpg)

*Halaman utamanya. Hampir semua hitam, putih, dan abu-abu.*

## Dark mode bukan berarti hitam pekat

Kartu harus kelihatan beda dari latarnya. Di halaman terang itu gampang, tinggal kasih shadow. Di halaman gelap, shadow tidak kelihatan.

Jadi caranya dibalik: kartunya dibuat sedikit lebih terang dari latar. Kalau latarnya sudah hitam pekat, lompatan ke kartu terasa kasar. Makanya saya mulai dari hampir hitam, lalu naik sedikit demi sedikit.

![Kiri: latar hitam pekat dengan kartu abu gelap. Kanan: latar hampir hitam dengan kartu yang naik bertahap](https://haryarrahman.tech/posts/dark-finance-dashboard-template/layers-id.png)

*Tiga tingkat: latar, kartu, dan lapisan di atas kartu.*

## Hijau tidak bisa jadi warna brand

Di aplikasi keuangan, hijau artinya naik dan merah artinya turun.

Kalau tombolnya juga hijau, tombol "Buy" jadi terlihat seperti kabar baik. Jadi warna brand-nya saya pilih amber. Sekarang artinya jelas: amber bisa diklik, hijau naik, merah turun.

![Kiri: tombol Buy hijau di bawah angka naik yang juga hijau. Kanan: tombol Buy amber](https://haryarrahman.tech/posts/dark-finance-dashboard-template/brand-id.png)

*Tombol yang sama, dua warna. Yang kiri bikin ragu.*

## Warna saja tidak cukup

Sebagian orang sulit membedakan merah dan hijau. Jadi tiap angka perubahan selalu punya panah dan tanda plus atau minus.

Coba hilangkan warnanya. Angkanya masih terbaca.

![Kiri: dua angka yang cuma dibedakan warna jadi sama saat warnanya dihilangkan. Kanan: dengan panah dan tanda, masih terbaca](https://haryarrahman.tech/posts/dark-finance-dashboard-template/signs-id.png)

*Baris bawah adalah angka yang sama tanpa warna.*

## Sisanya dibuat tenang

- **Teks cuma dua warna.** Putih untuk angka, abu-abu untuk label.
- **Cuma satu chart yang amber**, yaitu chart portfolio. Chart saham hijau atau merah, sesuai arah harganya.
- **Menunya di bawah**, bukan di samping. Jadi chart dan tabel dapat seluruh lebar layar.

![Halaman saham dalam dark mode: harga, chart sebulan berwarna hijau, dan posisi dengan tombol Buy amber](https://haryarrahman.tech/posts/dark-finance-dashboard-template/instrument-detail-dark-v2.jpg)

*Halaman satu saham. Chart-nya hijau karena harganya naik.*

Idenya dari dua produk nyata. Menu di bawah dari Fey. Latar hampir hitam dengan satu warna terang dari Spotify. Yang saya ambil cuma idenya, bukan nama, logo, atau warna mereka.

## Kesimpulan

Dashboard gelap yang enak dibaca bukan soal hitam. Kuncinya tiga:

- Kartu sedikit lebih terang dari latar.
- Satu warna brand yang tidak bentrok dengan naik dan turun.
- Tanda yang tetap terbaca tanpa warna.

## Angka-angkanya

| | Dark | Light |
|---|---|---|
| Latar | `#0E0E10` | `#FFFFFF` |
| Kartu | `#1C1C1F` | `#F5F5F5` |
| Teks | `#FFFFFF` | `#0E0E10` |
| Label | `#A0A0A6` | `#6B6B70` |
| Brand | `#FFB020` | `#FFB020` |
| Naik | `#22C55E` | `#15803D` |
| Turun | `#F23645` | `#D92D3A` |

Font-nya font bawaan sistem. Teks biasa 15px, tabel dan tombol 14px, judul 20 sampai 24px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/app-finance](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-finance).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-finance
   (live preview: https://ledgerfinch.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

Ini bagian terakhir dari enam. [Bagian 1](https://haryarrahman.tech/blog/portofolio-berbentuk-desktop-laptop) mulai lagi dari desktop laptop.
