---
title: Apa saja yang dibutuhkan template workspace dokumen?
excerpt: Dokumen yang gampang ditemukan, halaman yang menyimpan sendiri dengan alatnya di samping, dan satu warna yang dipakai seperti stabilo.
tags: Design System, React, Tailwind CSS, TanStack, Web App
publishedAt: 2026-11-19
lang: id
translationOf: documents-workspace-template
cover: https://haryarrahman.tech/posts/documents-workspace-template/docs-grid-v2.jpg
share: https://haryarrahman.tech/og/template-workspace-dokumen.png
---

*Seri Template, bagian 4 dari 6. Kodenya ada di repo.*

Jawaban singkat: tiga hal. Dokumen harus gampang ditemukan. Menulisnya harus terasa seperti di halaman, dengan alatnya di samping. Dan warnanya tidak boleh mengganggu bacaan, jadi tombolnya hitam dan satu-satunya warna adalah kuning stabilo.

## Yang saya buat

Paperwren, workspace dokumen contoh. Isinya folder, dokumen, editor, tugas, dan kalender. Semua nama, orang, dan isinya rekaan.

Coba di sini: [paperwren.blog.haryarrahman.tech](https://paperwren.blog.haryarrahman.tech)

![Halaman utama Paperwren: sidebar dengan folder dan tag, dokumen yang baru diedit, dan grid dokumen](https://haryarrahman.tech/posts/documents-workspace-template/docs-grid-v2.jpg)

*Halaman utamanya. Item yang sedang dibuka ditandai kuning.*

## Orang mencari dokumen dengan cara yang berbeda

Ada yang ingat foldernya. Ada yang lebih suka melihat-lihat. Ada yang cuma ingat satu kata dari judulnya.

Jadi jalannya ada tiga. Folder dan tag ada di sidebar. Semua dokumen tampil sebagai grid atau tabel. Kalau ingat namanya, ketik di pencarian atau tekan ⌘K.

![Tiga panel: folder dan tag di sidebar, dokumen dalam grid, dan kotak pencarian dengan ⌘K](https://haryarrahman.tech/posts/documents-workspace-template/find-id.png)

*Tiga jalan ke dokumen yang sama.*

## Menulis harus terasa seperti halaman, bukan formulir

Formulir punya kolom tetap dan tombol Save. Kalau lupa klik, tulisannya hilang.

Di sini, dokumen adalah halaman yang tersusun dari block: teks, heading, to-do, kutipan, dan callout. Ketik "/" untuk memilih block. Tombol Save tidak ada: halamannya menyimpan sendiri begitu kamu berhenti mengetik, juga saat kamu pindah halaman.

![Kiri: formulir dengan kolom judul, kolom isi, dan tombol Save. Kanan: halaman dari block dengan menu "/" dan tulisan Saved](https://haryarrahman.tech/posts/documents-workspace-template/save-id.png)

*Yang kiri menunggu diklik. Yang kanan sudah tersimpan.*

## Alat untuk menulis ada di samping halaman

Kalau pengaturan ada di layar lain, kamu harus meninggalkan tulisanmu untuk mengubah satu hal kecil.

Jadi semuanya ditaruh di samping. Di kiri ada outline, dibuat dari heading di dokumen. Klik salah satunya untuk lompat ke sana. Di kanan ada tiga tab: style untuk font dan lebar teks, info untuk folder dan tag, dan komentar.

![Kiri: dokumen dan pengaturan di dua layar terpisah. Kanan: outline, dokumen, dan panel style dalam satu layar](https://haryarrahman.tech/posts/documents-workspace-template/side-id.png)

*Halamannya tetap di tengah. Alatnya di pinggir.*

## Warnanya cuma satu, dan dipakai seperti stabilo

Aplikasi dokumen isinya kebanyakan tulisan. Kalau tombol dan menu ikut berwarna, mata ditarik ke mana-mana.

Makanya tombolnya hitam. Kuning cuma dipakai di tempat orang biasa memakai stabilo: teks yang dipilih, item yang sedang dibuka, dan to-do yang sudah dicentang. Tapi kuning tidak pernah jadi warna tulisan, karena susah dibaca di atas putih.

![Layar yang sama dua kali. Kiri: menu ungu, tombol biru, dan kata berwarna. Kanan: tombol hitam dan kuning hanya di item aktif, teks yang dipilih, dan to-do yang dicentang](https://haryarrahman.tech/posts/documents-workspace-template/colour-id.png)

*Layar yang sama. Di kanan, tulisannya yang pertama kelihatan.*

## Sisanya ada di sekitar dokumen

- **Tugas dan kalender.** Tugas bisa ditautkan ke dokumen, dan muncul sebagai titik di kalender.
- **Berbagi.** Undang orang untuk melihat, berkomentar, atau mengedit. Atau ekspor dokumennya sebagai Markdown.
- **Trash.** Dokumen yang dihapus masih bisa dipulihkan.

![Dokumen terbuka dengan outline di kiri dan tab Style di kanan](https://haryarrahman.tech/posts/documents-workspace-template/document-inspector-v2.jpg)

*Satu dokumen, dengan alatnya di kedua sisi.*

Layout-nya, yaitu sidebar, grid dokumen, dan halaman dengan panel di samping, datang dari Craft, lewat layar-layarnya di Mobbin. Yang saya ambil cuma idenya, bukan nama, logo, ikon, atau warnanya.

## Kesimpulan

Workspace dokumen yang enak dipakai adalah yang tidak menghalangi tulisan. Kuncinya tiga:

- Tiga jalan untuk menemukan dokumen.
- Halaman dari block yang menyimpan sendiri, dengan alatnya di samping.
- Tombol hitam dan satu warna, dipakai seperti stabilo.

## Angka-angkanya

| | Light | Dark |
|---|---|---|
| Latar | `#FAFAFA` | `#111111` |
| Kartu | `#FFFFFF` | `#1A1A1A` |
| Garis | `#EAEAEA` | `#2E2E2E` |
| Teks | `#1A1A1A` | `#FAFAFA` |
| Label | `#6B6B6B` | `#A0A0A0` |
| Tombol | `#1A1A1A` | `#FAFAFA` |
| Stabilo | `#FFC61A` | `#FFC61A` |
| Tanda di atas stabilo | `#1A1A1A` | `#1A1A1A` |

Font-nya font bawaan sistem. Menu dan tabel 14 sampai 15px, isi dokumen 16px, judul halaman 24 sampai 30px.

## Pakai sendiri

Kodenya ada di [app-templates/apps/app-workspace](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-workspace).

### Kasih ke AI kamu

Mau langsung jadi punyamu? Tempel ini ke Claude Code, Cursor, atau agent lain di folder kosong:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-workspace
   (live preview: https://paperwren.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Bagian 5](https://haryarrahman.tech/blog/template-admin-crm) adalah Tidewell, admin bisnis yang dibangun di sekitar data table.
