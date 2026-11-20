---
title: Gimana caranya home screen tablet jadi portfolio?
excerpt: Layar pertamanya sudah menunjukkan semuanya sebagai widget, dan tiap widget membuka aplikasi berisi cerita lengkapnya.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
publishedAt: 2026-11-19
lang: id
translationOf: portfolio-as-a-tablet-home-screen
cover: https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/home-light-v2.jpg
share: https://haryarrahman.tech/og/portofolio-berbentuk-layar-tablet.png
---

*Seri Template, bagian 3 dari 6. Kodenya ada di repo.*

Jawaban singkat: jadikan layar pertamanya ringkasan dari semuanya. Tiap hal tentang kamu jadi satu widget kecil. Ketuk widget-nya, dan aplikasi berisi cerita lengkapnya terbuka.

## Yang saya buat

Portfolio yang bentuknya home screen tablet. Di atas ada widget, di bawah ada dock berisi aplikasi. Isinya portfolio saya sendiri.

Coba di sini: [tablet.blog.haryarrahman.tech](https://tablet.blog.haryarrahman.tech)

![Home tablet dalam light mode: widget profil, proyek unggulan, ketersediaan, jam, notes, skill, pengalaman, angka, dan galeri di atas dock](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/home-light-v2.jpg)

*Home-nya. Proyek unggulan adalah widget berwarna deep teal.*

## Portfolio tidak harus panjang ke bawah

Portfolio biasanya satu halaman panjang. Pengunjung cuma melihat bagian atasnya, lalu harus scroll untuk tahu sisanya.

Di sini layar pertamanya sudah berisi semuanya: siapa saya, proyek unggulan, pengalaman, angka, notes, dan galeri. Jadi sekali lihat, pengunjung tahu apa saja yang ada.

![Kiri: halaman panjang yang cuma terlihat bagian atasnya. Kanan: satu layar berisi semua widget](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/scroll-id.png)

*Isinya sama. Yang kanan terlihat semua tanpa scroll.*

## Widget cukup jadi ringkasan

Tapi widget itu kecil. Satu halaman penuh tidak muat di dalamnya.

Makanya tiap widget cuma memuat satu hal singkat, dan seluruh widget-nya bisa diketuk. Ketuk proyek unggulan, aplikasi Projects terbuka di proyek itu. Ketuk notes, catatan terbaru yang terbuka. Home untuk melihat sekilas, aplikasi untuk membaca.

![Kiri: widget proyek unggulan. Kanan: aplikasi Projects yang dibukanya, dengan daftar proyek dan detailnya](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/widget-id.png)

*Widget-nya singkat. Ceritanya ada di aplikasi.*

## Yang penting dibuat lebih besar

Kalau semua widget sama besar, tidak ada yang menonjol. Pengunjung tidak tahu harus mulai dari mana.

Jadi widget punya empat ukuran: kecil, sedang, lebar, dan besar. Semuanya duduk di satu grid. Profil dan proyek unggulan dapat ukuran paling besar, jadi itu yang dilihat duluan.

![Kiri: grid widget yang semuanya sama besar. Kanan: grid yang sama dengan widget besar, kecil, sedang, dan lebar](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/sizes-id.png)

*Widget-nya sama. Ukurannya yang menunjukkan urutan baca.*

## Sisanya mengikuti pengunjung

- **Urutannya bisa diubah.** Pengunjung bisa menggeser widget ke urutan mereka sendiri, dan urutan itu diingat saat mereka kembali.
- **Dua aplikasi bisa berdampingan.** Misalnya proyek di kiri dan catatan di kanan, dengan split view.
- **Di ponsel, satu per satu.** Grid-nya menyempit, dan cuma satu aplikasi yang terbuka.

![Projects dan Notes terbuka berdampingan dalam split view, dengan dock di bawah](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/split-view-light-v2.jpg)

*Split view: Projects di kiri, Notes di kanan.*

Home yang terang dan tenang ini idenya dari portfolio bergaya desktop milik Alex Ojanen, yang saya temukan di Awwwards. Yang saya ambil cuma idenya, bukan nama, tampilan, atau ikonnya.

## Kesimpulan

Home screen tablet bisa jadi portfolio kalau layar pertamanya bekerja sebagai ringkasan:

- Semua hal penting terlihat tanpa scroll.
- Tiap widget singkat, dan membuka aplikasi berisi ceritanya.
- Ukuran widget menunjukkan mana yang dilihat duluan.

## Angka-angkanya

| | Light | Dark |
|---|---|---|
| Latar | `#FFFFFF` | `#121212` |
| Widget | `#FFFFFF` | `#1E1E1E` |
| Wallpaper | `#EEEEEE` | `#121212` |
| Garis | `#E0E0E0` | `#3A3A3A` |
| Teks | `#111111` | `#FFFFFF` |
| Label | `#555555` | `#B3B3B3` |
| Accent | `#7FE3D4` | `#7FE3D4` |
| Teks di atas accent | `#0B3B3C` | `#0B3B3C` |

Font-nya font bawaan sistem. Teks biasa 15px, tombol dan menu 14px, judul 24px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/portfolio-tablet](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-tablet).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-tablet
   (live preview: https://tablet.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Bagian 4](https://haryarrahman.tech/blog/template-workspace-dokumen) meninggalkan portfolio: workspace dokumen bernama Paperwren.
