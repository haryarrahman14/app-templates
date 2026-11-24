---
title: Gimana caranya bikin portfolio yang tampil seperti desktop laptop?
excerpt: Tiap bagian portfolio dibuka sebagai jendela, link-nya tetap jalan, dan cuma satu warna yang menandai tombol utama.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
publishedAt: 2026-11-19
lang: id
translationOf: portfolio-as-a-laptop-desktop
cover: https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/desktop-light-v2.jpg
share: https://haryarrahman.tech/og/portofolio-berbentuk-desktop-laptop.png
---

*Seri Template, bagian 2 dari 6. Kodenya ada di repo.*

Jawaban singkat: buat tiap bagian portfolio jadi jendela, bukan satu halaman panjang. Jendela yang paling depan ditulis di alamat, jadi link-nya tetap bisa dibagikan. Warnanya putih dan abu-abu, dan cuma satu warna, tomat, untuk tombol utama.

## Yang saya buat

Portfolio contoh yang bentuknya seperti desktop laptop. Ada menu bar di atas, dock di bawah, dan widget di samping. About, Projects, Notes, Experience, dan Contact masing-masing punya jendelanya sendiri.

Coba di sini: [desktop.blog.haryarrahman.tech](https://desktop.blog.haryarrahman.tech)

![Desktop dalam light mode dengan jendela Welcome dan Projects terbuka, widget di kanan, dan dock di bawah](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/desktop-light-v2.jpg)

*Dua jendela terbuka. Yang paling depan punya bayangan lebih tebal.*

## Jendela, bukan halaman panjang

Portfolio biasa itu satu halaman panjang. Kalau kamu cuma mau lihat Projects, kamu harus scroll dulu.

Di sini tiap bagian dibuka sebagai jendela. Klik ikonnya di dock, jendelanya langsung muncul di depan. Jendela bisa digeser, diubah ukurannya, dan ditumpuk. Menu bar dan terminal di dalamnya juga membuka jendela yang sama.

![Kiri: satu halaman panjang, Projects ada jauh di bawah. Kanan: jendela Projects di depan jendela Welcome, dengan dock di bawah](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/windows-id.png)

*Bagian yang kamu cari langsung ada di depan.*

## Tapi link tetap harus jalan

Portfolio biasanya dibagikan lewat link. Tapi jendela tidak punya alamat sendiri.

Makanya jendela yang paling depan ditulis di alamat. Kirim link yang berakhiran `?app=projects`, dan Projects langsung terbuka di depan.

![Kiri: alamat yang berakhiran ?app=projects. Kanan: desktop yang terbuka dengan Projects di depan](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/link-id.png)

*Link yang sama selalu membuka jendela yang sama.*

## Satu warna untuk tombol utama

Desktop berisi banyak hal sekaligus: jendela, ikon, widget, dan dock. Kalau semuanya berwarna, tidak ada yang menonjol.

Jadi permukaannya cuma putih dan abu-abu. Tomat dipakai untuk tombol utama, link, dan pilihan yang sedang aktif. Mata langsung tahu harus ke mana.

![Kiri: form kontak dengan banyak warna. Kanan: form yang sama dalam putih dan abu-abu, dengan satu tombol tomat](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/accent-id.png)

*Form yang sama. Yang kanan langsung kelihatan tombolnya.*

## Sisanya dibuat sederhana

- **Di ponsel, jendela jadi lembar penuh.** Tidak ada tempat untuk menggeser jendela. Jadi tiap jendela selebar layar, dan dock jadi bar di bawah.
- **Ikonnya berwarna solid.** Tiap aplikasi punya warnanya sendiri, supaya bisa dibedakan sekilas. Tomat cuma dipakai Welcome, tempat kamu mulai.
- **Tetap satu halaman static.** Halamannya sudah jadi file sejak build. Jadi dibuka seperti file biasa, tanpa kode yang jalan di server.

![Notes terbuka sebagai lembar selebar layar di ponsel, dengan dock sebagai bar di bawah](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/phone-notes-light-v2.jpg)

*Di ponsel, jendela Notes jadi selebar layar.*

Idenya dari portfolio bergaya desktop di Awwwards, "RI/OS" milik Roberto Izquierdo. Yang saya ambil cuma idenya, bukan nama, tampilan, atau ikonnya.

## Kesimpulan

Portfolio berbentuk desktop bukan soal mirip laptop. Kuncinya tiga:

- Tiap bagian adalah jendela, bukan potongan halaman panjang.
- Jendela paling depan ada di alamat, jadi link tetap jalan.
- Satu warna untuk tombol utama, sisanya putih dan abu-abu.

## Angka-angkanya

| | Light | Dark |
|---|---|---|
| Latar | `#FFFFFF` | `#121212` |
| Kartu | `#FFFFFF` | `#1E1E1E` |
| Abu-abu | `#F7F7F7` | `#2A2A2A` |
| Garis | `#DDDDDD` | `#3A3A3A` |
| Teks | `#222222` | `#FFFFFF` |
| Label | `#6A6A6A` | `#B0B0B0` |
| Tomat | `#E5432D` | `#E5432D` |

Font-nya font bawaan sistem. Teks biasa 15px, menu dan tombol 14px, judul 20 sampai 24px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/portfolio-desktop](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-desktop).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-desktop
   (live preview: https://desktop.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Bagian 3](https://haryarrahman.tech/blog/portofolio-berbentuk-layar-tablet) adalah portfolio yang sama dalam bentuk home screen tablet.
