---
title: Seribu request sekaligus: mana yang jebol duluan, Python, Go, atau Rust?
excerpt: Saya setel AI service yang sama di ketiganya lalu saya load test. Tidak ada yang jebol. Yang berbeda harganya.
tags: Python, Artificial Intelligence, Golang, Rust, Software Engineering
publishedAt: 2026-11-19
lang: id
translationOf: a-thousand-requests-at-once
cover: https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/thumb.png
share: https://haryarrahman.tech/og/seribu-request-sekaligus.png
video: https://haryarrahman.tech/video/seribu-request-sekaligus.mp4
---

*Dasarnya · Seri AI Service, bagian 2. Semua saya ukur di mesin saya sendiri. Kodenya ada di repo.*

Jawaban singkat: tidak ada, asal masing-masing disetel dengan cara yang paling cocok untuknya. Dengan seribu request sekaligus, dengan request yang lebih banyak dari yang sanggup ditangani mesin, dan dengan seribu client yang terus mencoba lagi, Python, Go, dan Rust sama-sama tidak kehilangan satu request pun. Yang berbeda adalah harganya. Python butuh lima process dan memory 852 MB sebelum berhenti gagal. Go cukup satu process dan 99 MB. Rust tergantung cara memakai library ONNX Runtime-nya: 367 MB kalau mengikuti aturan library itu, 84 MB, paling ringan dari semuanya, kalau aturan itu sengaja dilanggar.

## Yang saya uji

[Bagian 1](https://haryarrahman.tech/blog/kenapa-ai-service-pakai-python) mengukur satu request dalam satu waktu: foto kucing masuk, model menjawab "Egyptian cat". Bagian ini menaruh kode yang sama di belakang HTTP, supaya banyak client bisa mengirim foto bersamaan.

- **Python**: FastAPI di atas uvicorn.
- **Go**: `net/http`, dari standard library.
- **Rust**: axum di atas tokio.

Ketiga server punya endpoint yang sama. `POST /classify` menerima satu foto dan menjawab seperti ini:

```
{"label":"Egyptian cat","prob":0.23}
```

Fotonya JPEG kucing 35 KB dari bagian 1, modelnya file MobileNetV2 yang sama, dan ketiganya memakai ONNX Runtime 1.32.0 di CPU.

![Satu foto kucing masuk ke tiga server, Python dengan FastAPI, Go dengan net/http, dan Rust dengan axum, dan ketiganya menjawab Egyptian cat](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/1-three-servers.png)

*Satu endpoint, tiga server, jawaban yang sama.*

Request dikirim oleh sebuah load tool, [oha](https://github.com/hatoo/oha). Satu request dihitung **gagal** kalau dalam 10 detik server belum menerima koneksinya, atau belum menjawab. Setiap angka di bawah adalah median dari lima kali run.

## Tiap bahasa di setelan terbaiknya

Tes yang adil bukan tes di mana ketiganya diberi angka yang sama. Tes yang adil adalah tes di mana masing-masing jalan dengan cara yang paling cocok untuknya. Jadi setiap server mengikuti tiga aturan yang sama, dan tiap bahasa memilih angkanya sendiri:

- **Kerjakan hanya sekian request sekaligus.** Sisanya menunggu.
- **Biarkan hanya sekian yang menunggu**, yang datang duluan dilayani duluan. Yang ini saya tetapkan 100 untuk ketiganya, karena ini janji ke user (berapa lama sebuah request boleh menunggu), bukan soal kecepatan.
- **Semua yang di luar itu langsung dijawab "sibuk"** (HTTP 503), daripada dibiarkan menunggu tanpa hasil.

Untuk menemukan angka tiap bahasa, saya mencoba 33 kombinasi: berapa request sekaligus, berapa thread yang boleh dipakai model per request, berapa process untuk Python, dan untuk Rust dua cara memegang model yang dijelaskan di bawah. Aturan memilihnya sama untuk semuanya: pertama, tidak ada request yang gagal di tes mana pun; lalu, yang paling banyak dijawab per detik saat kebanjiran.

| | Process | Sekaligus | Menunggu | Salinan model |
|---|---:|---:|---:|---:|
| Python | 5 | 8 per process | 20 per process | 5 |
| Go | 1 | 32 | 100 | 1 |
| Rust, sesuai aturan | 1 | 20 | 100 | 20 |
| Rust, satu salinan bersama | 1 | 10 | 100 | 1 |

![Setelan akhir tiap bahasa: Python 5 process dengan 8 request sekaligus per process, Go 1 process dengan 32 sekaligus, Rust sesuai aturan dengan 20 sekaligus dan 20 salinan model, Rust satu salinan bersama dengan 10 sekaligus](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/2-best-settings.png)

*Aturan yang sama, dengan angka masing-masing bahasa.*

Yang terlihat dari pencarian itu:

- **Python butuh beberapa process.** Dengan satu process ia gagal di tes mencoba-lagi di bawah, sampai sekitar 400 koneksi dalam 10 detik. Dengan dua, masih gagal di sebagian run. Dengan lima, tidak pernah. Dengan sepuluh juga tidak pernah, tapi request yang dijawab lebih sedikit dan memory-nya 1,6 GB.
- **Go cukup satu process, tanpa tambahan apa pun.** Mengubah setelan garbage collector-nya tidak membantu. Di 48 request sekaligus ia mulai gagal (14 request di dua run pendek), jadi batasnya berhenti di 32.
- **Rust punya dua jawaban**, dan itu butuh bagiannya sendiri.

## Rust, dua cara

Di Python dan Go, model dimuat sekali dan semua request memakai satu salinan itu di saat yang sama. Library ONNX Runtime untuk Rust, `ort`, tidak mengizinkan itu. Menjalankan model butuh akses eksklusif ke salinan yang dimuat (dalam istilah Rust, `run` meminta `&mut self`), jadi compiler menolak kode di mana dua request memakai satu salinan bersamaan.

Pembuat library-nya terang soal alasannya: sebagian isi ONNX Runtime tidak aman dipakai beberapa thread sekaligus, versi `ort` sebelumnya yang mengizinkannya mengalami crash dan memory yang rusak, GPU provider khususnya tidak aman, dan aturan ini bertahan sampai ONNX Runtime menjamin sebaliknya. Cara yang dianjurkan adalah satu salinan model per thread.

Jadi server Rust punya dua pilihan yang sama-sama jujur:

- **Sesuai aturan.** Satu salinan model untuk tiap request yang dikerjakan sekaligus: di sini 20 salinan. Tiap salinan menambah sekitar 15 MB, seukuran file modelnya, jadi server memakai 367 MB saat idle.
- **Satu salinan bersama.** Satu baris bertanda `unsafe` memberi tahu compiler "bagian ini tanggung jawab saya", dan semua request memakai salinan yang sama, persis seperti Python dan Go. Server lalu memakai 84 MB saat idle, lebih kecil dari Go.

Dua-duanya saya jalankan di semua tes. Tidak ada yang kehilangan request, dan versi bersama selalu memberi jawaban yang benar, termasuk 200 request paralel yang semuanya kembali sebagai "Egyptian cat" dengan probabilitas yang sama. Itu yang bisa dikatakan tes ini. Tes ini tidak bisa mengatakan versi bersama itu aman: saya hanya menjalankannya di CPU, beberapa menit setiap kalinya, dan peringatannya terutama soal GPU.

Satu efek samping dari setelan ini: dengan satu thread per request, satu request sendirian jadi lebih lama daripada di bagian 1, karena model tidak lagi memakai semua core untuknya. Di satu koneksi: 14,6 ms (Python), 16,8 ms (Go), 14,3 ms (Rust, dua-duanya).

## Lebih banyak dari yang sanggup ditangani

Pertama, batasnya. Dengan 64 koneksi, masing-masing mengirim foto berikutnya begitu foto sebelumnya dijawab, server menjawab sekitar 380 sampai 450 request per detik.

Lalu saya mengirim request dengan laju satu setengah kali batas tiap server selama 20 detik, tidak peduli server sanggup atau tidak.

| | Python | Go | Rust, sesuai aturan | Rust, satu salinan |
|---|---:|---:|---:|---:|
| gagal | 0 | 0 | 0 | 0 |
| dijawab "sibuk" | 4.831 | 3.416 | 4.655 | 4.443 |
| dijawab per detik | 473 | 389 | 453 | 397 |
| median menunggu | 266 ms | 338 ms | 249 ms | 262 ms |

![Di laju satu setengah kali batas: tidak ada request yang gagal di Python, Go, maupun Rust; kelebihannya dijawab sibuk dan sisanya dijawab dalam sekitar seperempat detik](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/3-overload.png)

*Kebanjiran, dan tidak ada yang gagal.*

Tidak ada yang gagal, di lima run mana pun. Tiap server terus menjawab di batasnya, menjawab "sibuk" ke kelebihannya dalam hitungan milidetik, dan menjawab yang masuk dalam sekitar seperempat sampai sepertiga detik.

Baris "dijawab per detik" tidak saya urutkan. Di antara lima run, tiap server bergeser 100 request per detik atau lebih (Python dari 320 sampai 491, Rust satu salinan dari 353 sampai 523), dan rentangnya saling tumpang tindih. Yang bisa dikatakan: semuanya ada di sekitar 390 sampai 470.

Di setengah dari batas, antrean tidak ada sama sekali: median-nya 14,9 ms (Python), 17,5 ms (Go), dan 15,0 ms (Rust), sama dengan satu request sendirian.

## Seribu sekaligus

Pertanyaan di judul dalam bentuk paling polos: seribu client masing-masing mengirim satu foto, di saat yang sama.

| | Python | Go | Rust, sesuai aturan | Rust, satu salinan |
|---|---:|---:|---:|---:|
| dijawab | 255 | 592 | 228 | 174 |
| dijawab "sibuk" | 745 | 408 | 772 | 826 |
| gagal | 0 | 0 | 0 | 0 |
| semua beres dalam | 0,6 detik | 2,2 detik | 0,6 detik | 0,5 detik |

![Seribu request di saat yang sama: semuanya dijawab atau diberi tahu sibuk, tidak ada yang gagal](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/4-thousand-at-once.png)

*Seribu sekaligus: dijawab atau diberi tahu "sibuk", tidak ada yang hilang.*

Tiap server mengambil yang muat, ditambah yang masih sempat masuk saat jawaban pertama keluar, lalu menjawab "sibuk" ke sisanya. Tidak ada request yang hilang. Go paling lama, antara 0,8 dan 4,1 detik di lima run, dan menjawab paling banyak, karena batas 32-nya membiarkan lebih banyak masuk. Kenapa seribu request-nya lebih lama lewat, tidak saya ukur.

Dijawab "sibuk" bukan kegagalan. Client tahu dalam hitungan milidetik dan bisa mencoba lagi, atau mencoba server lain. Kegagalan adalah request yang menunggu 10 detik dan tidak mendapat apa-apa.

## Seribu client yang tidak berhenti mencoba lagi

Tes yang paling berat: seribu koneksi selama 20 detik, di mana client yang dijawab "sibuk" langsung mengirim request berikutnya. Tiap server sekarang dihujani puluhan ribu request per detik, dan harus menolak hampir semuanya.

| | Python | Go | Rust, sesuai aturan | Rust, satu salinan |
|---|---:|---:|---:|---:|
| gagal | 0 | 0 | 0 | 0 |
| ditolak per detik | 21.900 | 17.500 | 41.400 | 52.500 |
| dijawab per detik | 221 | 238 | 271 | 186 |

![Seribu client yang terus mencoba lagi: tidak ada request yang gagal; puluhan ribu request ditolak tiap detik sementara request sungguhan tetap dijawab](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/5-retry.png)

*Menolak banjirnya sambil tetap menjawab.*

Tetap tidak ada yang gagal. Semuanya terus menjawab request sungguhan sambil menolak banjirnya, walau jauh di bawah batasnya: menolak request juga pekerjaan.

Inilah tes yang tidak bisa dilewati Python dengan satu process. Di Python, menerima koneksi dan menjawab "sibuk" sama-sama jalan di satu thread, dan dengan seribu client yang terus menggedor, thread itu tertinggal sampai koneksi kehabisan waktu. Itulah GIL, lock di Python yang hanya mengizinkan satu thread menjalankan kode Python dalam satu waktu. Lima process berarti lima thread seperti itu, dan itu cukup.

Hal yang sama terlihat di `/ping`, endpoint yang menjawab `{"ok":true}` tanpa menyentuh foto atau model, jadi yang bekerja hanya bahasa dan framework-nya. Di 64 koneksi: Python 59.778 request per detik dengan lima process-nya, Go 93.389, Rust 97.142 sampai 99.190. (Load tool-nya jalan di mesin yang sama, jadi baca angka ini sebagai perbandingan, bukan batas tiap server.)

## Harganya

Tidak ada yang jebol. Yang berbeda adalah harga untuk tidak jebol, dan memory adalah bagian yang stabil dari run ke run:

| | Python | Go | Rust, sesuai aturan | Rust, satu salinan |
|---|---:|---:|---:|---:|
| process | 5 | 1 | 1 | 1 |
| salinan model | 5 | 1 | 20 | 1 |
| memory saat idle | 852 MB | 99 MB | 367 MB | 84 MB |
| memory tertinggi saat sibuk | 933 MB | 479 MB | 675 MB | 316 MB |

![Harganya: memory saat idle 852 MB untuk Python dengan lima process, 99 MB untuk Go, 367 MB untuk Rust sesuai aturan, dan 84 MB untuk Rust dengan satu salinan model bersama](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/id/6-cost.png)

*Tidak ada yang jebol. Harganya yang berbeda.*

- **Python** membayar dengan memory. Tiap process memuat salinan model dan salinan Python-nya sendiri: 852 MB sebelum request pertama datang. Antreannya juga terbelah: tiap process hanya tahu 8 dan 20 miliknya sendiri, jadi satu process bisa menjawab "sibuk" padahal process lain sedang kosong.
- **Go** paling murah dijalankan tanpa melanggar aturan apa pun: satu process, satu salinan model, 99 MB.
- **Rust** paling berat di antara server satu-process kalau mengikuti library-nya, dan paling ringan dari semuanya kalau memakai satu salinan bersama. Memory itu memang bukan milik Rust. Itu milik 20 salinan modelnya.

## Kalau ini dipakai di production

Yang akan saya bawa dari run-run ini ke service sungguhan:

- **Pasang batas, antrean, dan jawaban "sibuk", di bahasa apa pun.** Tidak ada satu pun dari tiga framework ini yang memasangnya untuk kita. Bagian 3 menunjukkan apa yang terjadi tanpa itu.
- **Buat client menunggu dulu sebelum mencoba lagi.** Tes mencoba-lagi adalah client yang melakukan hal terburuk. Itu memakan sepertiga sampai setengah throughput tiap server, dan itulah yang menjatuhkan Python dengan satu process.
- **Python: jalankan beberapa process dan siapkan memory untuk masing-masing.** Di sini sekitar 170 MB per process dengan model 14 MB; model yang lebih besar berarti kelipatannya. Batas dan antreannya per process, jadi taruh satu antrean bersama atau load balancer di depannya kalau beberapa jawaban "sibuk" di setengah beban itu penting buat kita.
- **Go: server bawaannya cukup, tapi batasnya harus kita tulis sendiri.** Isinya satu channel dan empat baris.
- **Rust: mulai dengan satu salinan model untuk tiap request yang dikerjakan, seperti kata `ort`, dan bayar memory-nya.** Pakai satu salinan bersama hanya di CPU, hanya dengan sadar, dan hanya setelah load test panjang kita sendiri: baris itu bertanda `unsafe` karena tidak ada lagi yang memeriksanya untuk kita, dan pembuat library-nya bilang GPU provider sudah bertahun-tahun tidak aman dipakai dengan cara ini.
- **Ukur di mesin sendiri.** Angka terbaik di sini (32 untuk Go, 8 per process untuk Python, 10 atau 20 untuk Rust) milik satu laptop 10 core dan satu model kecil.

## Jadi mana yang jebol duluan?

Tidak ada, kalau masing-masing disetel dengan baik. Sebuah batas, antrean yang pendek, dan jawaban "sibuk" yang jujur sudah cukup bagi ketiganya untuk menghadapi seribu request sekaligus, request yang lebih banyak dari yang sanggup dilayani mesin, dan seribu client yang terus mencoba lagi, tanpa kehilangan satu request pun.

Yang paling dekat ke jebol adalah Python. Hanya Python yang gagal selama pencarian setelan, dan hanya Python yang butuh lebih dari satu process untuk berhenti gagal. Itu GIL yang muncul di tempat yang sudah ditunjuk bagian 1: bukan di model, yang jalan di C++, tapi di pekerjaan biasa menerima dan menolak koneksi, yang memang dikerjakan Python sendiri.

## Yang tidak ditunjukkan tes ini

- Load tool dan server berbagi satu laptop. Di mesin terpisah angkanya akan berbeda, terutama di tes mencoba-lagi, karena di sana tool itu sendiri mengirim puluhan ribu request per detik.
- Throughput tidak cukup stabil untuk diurutkan. Ada pekerjaan lain yang jalan di laptop selama sebagian run final, dan "dijawab per detik" bergeser sampai sepertiga di antara run. Kegagalan dan memory tidak bergeser.
- Satu foto kecil, satu model kecil, satu mesin, hanya CPU.
- Pencariannya menjalankan tiap kombinasi dua kali, 10 detik per tes. Beberapa kombinasi Rust dan Go terlalu berdekatan untuk dibedakan, jadi di hari lain angkanya bisa berbeda.
- Rust sesuai aturan dicari sampai 20 request sekaligus, yang lain sampai 48.
- Yang saya setel adalah server-nya, bukan kode gambarnya. Tiap bahasa masih melakukan decode dan resize foto dengan cara yang sama seperti di bagian 1.
- Antrean 100 adalah pilihan saya. Antrean yang lebih panjang berarti lebih sedikit jawaban "sibuk" dan menunggu lebih lama.

## Selanjutnya

Di sini setiap server diberi tahu berapa banyak yang boleh diambilnya. Bagian 3 mencabut semua itu: tiga server yang sama, persis seperti yang diberikan framework-nya, tanpa batas, tanpa antrean, tanpa setelan, menghadapi seribu request yang sama. Salah satunya kehilangan ratusan request dan memory-nya naik sampai 2 GB.

## Mesin dan versi

- MacBook Pro, Apple M1 Pro (10 core), RAM 32 GB, macOS 26.6.2, dicolok ke listrik
- ONNX Runtime 1.32.0, CPU, satu thread per request
- Python 3.14.6, fastapi 0.163.2, uvicorn 0.54.0
- Go 1.27.4, `net/http`
- Rust 1.100.0, axum 0.8.9, tokio 1.54.1, `ort` 2.0.0-rc.15
- oha 1.17.0, di mesin yang sama

Kode, hasil mentah, dan catatan kesetaraan: [github.com/haryarrahman14/ai-service-series](https://github.com/haryarrahman14/ai-service-series), folder `02-thousand-requests`.

## Sumber

- [FastAPI: di mana kode blocking dijalankan](https://fastapi.tiangolo.com/async/)
- [Go net/http: goroutine baru untuk tiap koneksi](https://pkg.go.dev/net/http#Server.Serve)
- [tokio: semaphore](https://docs.rs/tokio/latest/tokio/sync/struct.Semaphore.html)
- [ort](https://crates.io/crates/ort)
- [ort: kenapa `run` butuh akses eksklusif ke session](https://github.com/pykeio/ort/issues/402#issuecomment-2949993914)
- [ort: "Is there a thread-safe alternative to session.run()"](https://github.com/pykeio/ort/issues/511)
- [ONNX Runtime: thread management](https://onnxruntime.ai/docs/performance/tune-performance/threading.html)
- [oha](https://github.com/hatoo/oha)

## Ikuti

- Instagram (Bahasa Indonesia): [@dasarnya.id](https://www.instagram.com/dasarnya.id/)
- Instagram (English): [@bassically.en](https://www.instagram.com/bassically.en/)
- Threads (Bahasa Indonesia): [@dasarnya.id](https://www.threads.com/@dasarnya.id)
- Threads (English): [@bassically.en](https://www.threads.com/@bassically.en)
- Medium: [@haryarrahman14](https://medium.com/@haryarrahman14)
