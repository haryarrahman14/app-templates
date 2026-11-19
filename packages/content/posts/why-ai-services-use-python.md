---
title: Why is almost every AI service written in Python? Why not Go, which is simpler, or Rust, which is faster?
excerpt: I ran the same request in Python, Go and Rust. The model step cost the same in all three.
tags: Python, Artificial Intelligence, Golang, Rust, Software Engineering
publishedAt: 2026-11-18
lang: en
cover: https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/thumb.png
share: /og/why-ai-services-use-python.png
video: /video/why-ai-services-use-python.mp4
---

*Bassically · AI Service series, part 1. I measured this on my own machine. The code is in the repo.*

Short answer: Python is slow, but in an AI service it does almost none of the work. The heavy steps run in C and C++ libraries, and those libraries are so good that Python was the fastest of the three on large JPEG photos. Python is also where models are made.

## What I tested

A small AI service: a photo goes in, a model guesses what is in it.

- **The model** is a file produced by training. Here it is MobileNetV2, which recognises 1,000 kinds of objects.
- **The photo** is a picture of a cat. The expected answer is "Egyptian cat".
- **One request** has four steps: read the photo (decode), resize it, turn it into numbers (normalize), and run the model.

![A cat photo goes through decode, resize, normalize and the model, and comes out as the answer Egyptian cat](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/1-request.png)

*One request: photo in, answer out.*

## Python is slow

An AI model is, underneath, millions of multiplications. So I measured one such job: multiplying two 200x200 tables of numbers, which takes 8 million multiplications. I did it twice: once with a plain Python loop, once with NumPy.

```
pure Python  : 340.530 ms
NumPy (@)    :   0.058 ms
```

NumPy is about 5,900 times faster, because it hands the work to a library written in C.

## But the heavy work is not done by Python

My Python program, `python/main.py`, is 107 lines. It only calls libraries:

- **Pillow** (C) reads and resizes the photo.
- **NumPy** (C) turns it into numbers.
- **ONNX Runtime** (C++) runs the model.

More than 99% of the request time is spent inside those three libraries.

![main.py calls three libraries, Pillow, NumPy and ONNX Runtime, which do the work](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/2-who-does-the-work.png)

*The Python code gives the orders. The C and C++ libraries do the work.*

## The same request in Go and Rust

I wrote the same request in Go and in Rust: same model file, same photo, same ONNX Runtime 1.32.0, CPU only.

"CPU only" means this: a model can run on the ordinary processor (the CPU) or on an accelerator such as a GPU. I turned accelerators off in all three, so the same engine is compared. Without that, the Rust binding on macOS picks Apple's accelerator by itself, and the results cannot be compared.

Pillow and NumPy are Python libraries, so Go and Rust do not use them. Each language uses its own image library:

```
step         Python               Go                          Rust
decode       Pillow (C)           image/png, image/jpeg       image crate
resize       Pillow (C)           golang.org/x/image/draw     image crate
normalize    NumPy (C)            a loop I wrote              a loop I wrote
model        ONNX Runtime (C++)   ONNX Runtime (C++)          ONNX Runtime (C++)
```

Only ONNX Runtime is truly the same in all three. Go and Rust have no NumPy, so I wrote normalize myself as a short loop. That loop turned out faster than NumPy for this step: 0.12 ms in Rust, 0.23 ms in Go, 0.89 ms in Python.

One photo and one model would be thin evidence, so I ran four cases:

- **small PNG**: the cat photo, 451x300, as a PNG file.
- **small JPEG**: the same photo saved as JPEG.
- **large JPEG**: the same photo enlarged to 1920x1277 and saved as JPEG. It is an enlargement, not a native large photo.
- **large model**: the small PNG again, but with ResNet50, a model about seven times heavier than MobileNetV2.

Total time for one request, median in milliseconds:

```
                 Python       Go     Rust
small PNG        10.663   15.130    9.029
small JPEG        7.917   11.238    7.825
large JPEG       18.986   52.561   23.077
large model      42.111   46.603   40.286
```

All three languages answer "Egyptian cat" in all four cases.

![Four cases, three languages: the fastest language changes with the case](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/6-four-cases.png)

*The winner depends on the case. Go is last in all four.*

## The model step costs almost the same in every language

Time spent running the model, in milliseconds:

```
                 Python       Go     Rust
small PNG         5.575    6.047    5.399
small JPEG        5.468    6.332    5.184
large JPEG        5.005    4.896    4.877
large model      36.853   37.531   36.620
```

Within each case the three numbers are close, because all three languages call the same C++ engine.

Python and Rust are level. Go is not stable in the two small cases: in some runs it is level with the other two, in others about 1 ms slower, so its median sits about 0.5 ms higher. I have not pinned down the cause.

![The model step takes the same time in Python, Go and Rust](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/3-same-model.png)

*Running the model costs almost the same in every language.*

## The difference is in preparing the image

Time spent on decode, resize and normalize, in milliseconds:

```
                 Python       Go     Rust
small PNG         5.087    9.024    3.633
small JPEG        2.442    4.912    2.622
large JPEG       13.907   47.619   18.148
large model       5.183    9.061    3.676
```

Three things stand out:

- **On the large JPEG, Python is the fastest.** Pillow decodes JPEG with libjpeg-turbo, a C library tuned for this processor. On a large photo that beats Rust's image library. On the small JPEG, Python and Rust tie.
- **Go is the slowest in every case.** Its image libraries are written in plain Go. On the large JPEG that costs 47.6 ms, against 13.9 ms in Python.
- **With a large model the gap matters less.** The 5 ms that Go loses on the image is a third of a small request, but only a tenth of a ResNet50 request.

![Image preparation time for the small PNG: Rust 3.63 ms, Python 5.09 ms, Go 9.02 ms](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/4-image-prep.png)

*The gap between the languages comes from the image libraries.*

## So why Python?

Because models are made there, and a model goes through two stages.

**Stage 1: training.** You write the model, feed it data, and the computer works out millions of numbers. This is done with PyTorch, which is a Python library.

- The model I used was built and trained with PyTorch, in Python. PyTorch's C++ API is still labelled beta.
- Nearly half of new AI repositories on GitHub use Python (Octoverse 2025).
- There is no compile step, so trying a change is quick.

The result of training is one file. Here it is 14.23 MB.

**Stage 2: the service.** A service opens that file, feeds it a photo and returns the answer. The file does not care which language opens it, so the service can be written in Python, Go or Rust.

![Stage 1, training in Python, produces one file; stage 2, a service in Python, Go or Rust, opens it](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/01-why-python/img/en/5-one-file.png)

*Training happens in Python. The service can be in any of the three.*

The ONNX Runtime bindings are not equally mature:

- Python: official.
- Go: official since August 2026, with no version tag yet.
- Rust: the community crate `ort`, whose 2.0 is still a release candidate.

## How I measured it

The code is in three folders, `python/`, `go/` and `rust/`. Each program has the same twelve functions in the same order: `decode`, `resize`, `normalize`, `preprocess`, `infer`, `softmax`, `argmax`, `median`, `p95`, `classify`, `benchmark`, `main`.

Each program times itself the same way: 10 warm-up requests, then 200 measured requests, then the median and 95th percentile of each step. I ran the whole thing ten times; the tables show the middle value of those ten runs. Between runs, the image numbers move by less than 2% and the model step by up to about 10%. The raw output of all ten is in `results/`.

This is the measured loop in Python:

```python
for _ in range(200):
    t0 = time.perf_counter()
    img = decode(image_path)
    t1 = time.perf_counter()
    img = resize(img)
    t2 = time.perf_counter()
    x = normalize(img)
    t3 = time.perf_counter()
    logits = infer(session, x)
    t4 = time.perf_counter()
    argmax(softmax(logits))
    t5 = time.perf_counter()
```

The same loop in Go:

```go
for range 200 {
	t0 := time.Now()
	img := decode(imagePath)
	t1 := time.Now()
	cropped := resize(img)
	t2 := time.Now()
	x := normalize(cropped)
	t3 := time.Now()
	logits := infer(session, x)
	t4 := time.Now()
	_ = argmax(softmax(logits))
	t5 := time.Now()
}
```

And in Rust. `black_box` only keeps the compiler from dropping a result that is not used afterwards:

```rust
for _ in 0..200 {
    let t0 = Instant::now();
    let img = decode(image_path);
    let t1 = Instant::now();
    let img = resize(&img);
    let t2 = Instant::now();
    let x = normalize(&img);
    let t3 = Instant::now();
    let logits = infer(session, x);
    let t4 = Instant::now();
    let best = argmax(&softmax(&logits));
    let t5 = Instant::now();
    std::hint::black_box(best);
}
```

In each loop, the lines that follow store the five differences between `t0` and `t5` as the time of each step.

Go's image numbers looked too slow, so I checked them with Go's own benchmark tool:

```sh
go test -bench Decode -benchmem -run '^$'
```

It reports 6.1 ms for PNG decode, which matches the program.

## Is the comparison fair?

I checked that the three programs do the same work:

- They feed the model the same input. For the PNG, no pixel differs by more than 1 level out of 255 after resizing. For JPEG the decoders differ a little more, up to 8 levels, because Go's JPEG decoder handles colour in a simpler way. Each program prints the mean and spread of its input so you can compare them.
- The model, the photo, the ONNX Runtime version and the thread count are the same, and all three run on the CPU.
- Go uses the resize method that matches the other two. A faster Go method exists, but it is a different algorithm and changes the picture by up to 16 levels, so I did not use it.
- Go's slow image handling is real: unpacking the PNG data alone takes 3.39 ms in Go against 0.86 ms in C.
- Python takes no shortcut on the large JPEG. Pillow can decode a JPEG at reduced size; I checked that it does not do so here.

The full audit is in [FAIRNESS.md](https://github.com/haryarrahman14/ai-service-series/blob/main/01-why-python/FAIRNESS.md).

Screenshots of one more run, taken outside those ten:

![Pure Python vs NumPy run](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/01-why-python/proof/matmul.png)

![Python run](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/01-why-python/proof/python.png)

![Go run](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/01-why-python/proof/go.png)

![Rust run](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/01-why-python/proof/rust.png)

![Go decode benchmark](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/01-why-python/proof/go-bench.png)

To run it yourself:

```sh
uv run shared/export_model.py
sh shared/get_onnxruntime.sh
sh 01-why-python/run_all.sh
```

Limits of this test:

- It measures one request at a time, not a service receiving many requests at once. That is part 2.
- All four cases use one photo of a cat. The large JPEG is an enlargement of it.
- On macOS the Rust binding uses Apple's CoreML by default. I forced CPU so all three use the same engine.

## Conclusion

Training a model is done in Python, because the tools for it are there.

The service that runs the model can be written in any of the three. In these four cases the model step cost almost the same everywhere, and most of the difference came from the image libraries: Rust was fastest on PNG, Python was fastest on the large JPEG, and Go was slowest every time.

So choosing Go or Rust does not make the model faster. What these tests do not show is how each one behaves with many requests at once.

## Next

Part 2 turns all three versions (Python, Go and Rust) into HTTP services and tests them with many requests at once.

## Setup

- MacBook Pro, Apple M1 Pro, 32 GB RAM, macOS 26.6.2
- ONNX Runtime 1.32.0, CPU, default threads
- Python 3.14.6, numpy 2.5.5, pillow 13.0.0. Python 3.14 is the newest version ONNX Runtime 1.32.0 supports.
- Go 1.27.4, `github.com/microsoft/onnxruntime/go` at the v1.32.0 commit, `golang.org/x/image` 0.48.0
- Rust 1.100.0, `ort` 2.0.0-rc.15, `image` 0.25.10

Code: [github.com/haryarrahman14/ai-service-series](https://github.com/haryarrahman14/ai-service-series)

## Sources

- [ONNX Runtime: supported languages](https://onnxruntime.ai/docs/get-started/)
- [ONNX Runtime: Go bindings](https://github.com/microsoft/onnxruntime/pull/29615)
- [ort](https://crates.io/crates/ort)
- [PyTorch C++ API](https://docs.pytorch.org/cppdocs/)
- [NumPy: BLAS, LAPACK](https://numpy.org/doc/stable/building/blas_lapack.html)
- [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)

## Follow

- Instagram (Bahasa Indonesia): [@dasarnya.id](https://www.instagram.com/dasarnya.id/)
- Instagram (English): [@bassically.en](https://www.instagram.com/bassically.en/)
- LinkedIn: [Hary Arrahman](https://www.linkedin.com/in/hary-arrahman)
- GitHub: [haryarrahman14/ai-service-series](https://github.com/haryarrahman14/ai-service-series)
