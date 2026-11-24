---
title: Gimana caranya mengubah portfolio jadi ponsel yang bisa dipakai?
excerpt: Lock screen yang terbuka dengan satu tap, home screen yang jadi menu, dan jalan pulang di tiap aplikasi.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
publishedAt: 2026-11-19
lang: id
translationOf: portfolio-as-a-phone
cover: https://haryarrahman.tech/posts/portfolio-as-a-phone/desktop-home-v2.jpg
share: https://haryarrahman.tech/og/portofolio-berbentuk-ponsel.png
---

*Seri Template, bagian 1 dari 6. Kodenya ada di repo.*

Jawaban singkat: buat portfolio-nya bergerak seperti ponsel, tapi jangan pernah bikin pengunjung menunggu. Lock screen-nya terbuka dengan satu tap, home screen-nya jadi menu, dan tiap aplikasi selalu punya jalan pulang.

## Yang saya buat

Portfolio satu halaman yang bentuknya ponsel. Isinya proyek, catatan, pengalaman, dan kontak.

Coba di sini: [phone.blog.haryarrahman.tech](https://phone.blog.haryarrahman.tech)

![Home screen ponsel di laptop, dengan intro singkat di kanannya](https://haryarrahman.tech/posts/portfolio-as-a-phone/desktop-home-v2.jpg)

*Di laptop: ponsel di kiri, intro singkat di kanan.*

## Lock screen tidak boleh menghalangi

Lock screen bikin detik pertama terasa seperti ponsel. Tapi kunci sungguhan minta PIN, dan pengunjung tidak punya PIN.

Jadi kuncinya terbuka dengan satu tap atau swipe ke atas. Sekali terbuka, dia tetap terbuka selama kunjungan itu. Link ke sebuah proyek langsung melewatinya, jadi orang langsung melihat proyek itu.

![Kiri: ponsel terkunci yang minta PIN. Kanan: lock screen template ini, cukup swipe ke atas atau tap](https://haryarrahman.tech/posts/portfolio-as-a-phone/lock-id.png)

*Yang kiri bikin orang berhenti. Yang kanan cuma butuh satu gerakan.*

## Home screen adalah menunya

Ponsel tidak punya menu di atas seperti website. Semuanya ada di home screen.

Tapi kalau isinya cuma ikon, orang belum tahu siapa pemiliknya. Makanya bagian atasnya widget: nama, peran, dan status kerja. Ikon di bawahnya membuka sisanya, dan empat yang terpenting ada di dock.

![Kiri: home screen yang isinya cuma ikon. Kanan: widget nama, status, dan angka di atas, lalu ikon dan dock](https://haryarrahman.tech/posts/portfolio-as-a-phone/home-id.png)

*Ikon yang sama. Yang kanan sudah memperkenalkan orangnya.*

## Tiap aplikasi selalu punya jalan pulang

Ponsel di dalam browser gampang bikin orang tersesat.

Jadi tiap aplikasi terbuka dari ikonnya, dan saat ditutup kembali ke ikon itu. Tombol back di kiri atas dan Esc mundur satu langkah. Home bar di bawah, di-tap atau di-swipe ke atas, langsung kembali ke home.

![Tiga layar: home, daftar proyek, detail proyek. Back atau Esc mundur satu langkah, home bar langsung ke home](https://haryarrahman.tech/posts/portfolio-as-a-phone/way-home-id.png)

*Dua jalan keluar: mundur satu langkah, atau langsung pulang.*

## Di ponsel sungguhan, bingkainya hilang

Di laptop, layar sempit tanpa bodi cuma terlihat seperti halaman kecil. Tapi di ponsel, menggambar ponsel di dalam ponsel itu aneh.

Makanya bingkainya cuma ada di layar lebar. Di laptop, ponselnya berdiri di samping intro singkat dan tombol CV. Di ponsel sungguhan bingkainya hilang, dan layarnya jadi ponsel itu sendiri.

![Kiri: di laptop, ponsel dalam bingkai di samping intro. Kanan: di ponsel sungguhan, home screen memenuhi layar](https://haryarrahman.tech/posts/portfolio-as-a-phone/frame-id.png)

*Halaman yang sama di dua layar.*

## Sisanya dibuat sederhana

- **Tiap layar punya link sendiri.** Aplikasi yang sedang terbuka tercatat di alamat, jadi bisa dibagikan.
- **Warnanya cuma satu, hijau.** Teks di atasnya selalu gelap, supaya terbaca.
- **Pengaturan ikut diingat.** Tema, wallpaper, dan accent tetap sama saat kamu kembali.

![Aplikasi Projects terbuka, menampilkan detail satu proyek di dalam ponsel](https://haryarrahman.tech/posts/portfolio-as-a-phone/open-app-project-detail-v2.jpg)

*Satu proyek yang dibuka dari daftar Projects.*

Ide lock screen-nya dari portfolio bergaya desktop milik Parinaz Kassemi yang saya temukan di Awwwards. Yang saya ambil cuma idenya, bukan nama, tampilan, atau ikonnya.

## Kesimpulan

Portfolio berbentuk ponsel enak dipakai kalau dia bergerak seperti ponsel, tapi tidak pernah menghalangi. Kuncinya tiga:

- Lock screen yang terbuka dengan satu gerakan, dan dilewati oleh link.
- Home screen yang memperkenalkan orangnya dulu, baru jadi menu.
- Jalan pulang di tiap aplikasi, dan bingkai yang cuma ada di layar lebar.

## Angka-angkanya

| | Light | Dark |
|---|---|---|
| Latar | `#FFFFFF` | `#121212` |
| Kartu | `#FFFFFF` | `#1E1E1E` |
| Abu-abu | `#F5F5F5` | `#2E2E2E` |
| Garis | `#E5E5E5` | `#3A3A3A` |
| Teks | `#121212` | `#FFFFFF` |
| Label | `#6B6B6B` | `#B3B3B3` |
| Accent | `#1FB85A` | `#1FB85A` |
| Teks di atas accent | `#0E0E10` | `#0E0E10` |

Font-nya font bawaan sistem. Teks biasa 15px, teks antarmuka 14px, judul halaman 24px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/portfolio-phone](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-phone).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-phone
   (live preview: https://phone.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Bagian 2](https://haryarrahman.tech/blog/portofolio-berbentuk-desktop-laptop) adalah portfolio yang sama dalam bentuk desktop laptop.
