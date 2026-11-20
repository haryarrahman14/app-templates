---
title: A thousand requests at once: which breaks first, Python, Go or Rust?
excerpt: I tuned the same AI service in all three and load-tested it. None of them broke. What differs is the price.
tags: Python, Artificial Intelligence, Golang, Rust, Software Engineering
publishedAt: 2026-11-19
pinned: true
lang: en
cover: https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/thumb.png
share: https://haryarrahman.tech/og/a-thousand-requests-at-once.png
video: https://haryarrahman.tech/video/a-thousand-requests-at-once.mp4
---

*Bassically · AI Service series, part 2. I measured this on my own machine. The code is in the repo.*

Short answer: none of them, once each one is set up the way that suits it best. With a thousand requests at once, with more requests than the machine can take, and with a thousand clients retrying non-stop, Python, Go and Rust all lost zero requests. What differs is the price. Python needed five processes and 852 MB of memory before it stopped failing. Go did it in one process and 99 MB. Rust depends on how you use its ONNX Runtime library: 367 MB if you follow the library's rule, 84 MB, the lightest of all, if you knowingly break it.

## What I tested

[Part 1](https://haryarrahman.tech/blog/why-ai-services-use-python) measured one request at a time: a cat photo goes in, the model answers "Egyptian cat". This part puts that same code behind HTTP, so many clients can send photos at once.

- **Python**: FastAPI on uvicorn.
- **Go**: `net/http`, from the standard library.
- **Rust**: axum on tokio.

Each server has the same endpoint. `POST /classify` takes a photo and answers like this:

```
{"label":"Egyptian cat","prob":0.23}
```

The photo is the 35 KB cat JPEG from part 1, the model is the same MobileNetV2 file, and all three use ONNX Runtime 1.32.0 on the CPU.

![One cat photo goes to three servers, Python with FastAPI, Go with net/http and Rust with axum, and each answers Egyptian cat](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/1-three-servers.png)

*One endpoint, three servers, the same answer.*

The requests are sent by a load tool, [oha](https://github.com/hatoo/oha). A request counts as **failed** if the server does not accept the connection, or does not answer, within 10 seconds. Every number below is the median of five runs.

## Each language at its best

A fair test is not one where all three get the same numbers. It is one where each runs the way that suits it. So every server follows the same three rules, and each language picks its own numbers for them:

- **Work on only so many requests at once.** The rest wait.
- **Let only so many wait**, first come, first served. I fixed this one at 100 for all three, because it is a promise to the user (how long a request may wait), not a matter of speed.
- **Tell everyone beyond that "busy"** (HTTP 503) immediately, instead of letting them wait for nothing.

To find each language's numbers I tried 33 combinations: how many requests at once, how many threads the model may use per request, how many processes for Python, and for Rust the two ways of holding the model described below. The rule for choosing was the same for all: first, no failed request in any test; then, the most requests answered per second when overloaded.

| | Processes | At once | Waiting | Copies of the model |
|---|---:|---:|---:|---:|
| Python | 5 | 8 each | 20 each | 5 |
| Go | 1 | 32 | 100 | 1 |
| Rust, by the book | 1 | 20 | 100 | 20 |
| Rust, one shared copy | 1 | 10 | 100 | 1 |

![The settings each language ended up with: Python 5 processes with 8 requests at once each, Go 1 process with 32 at once, Rust by the book with 20 at once and 20 copies of the model, Rust sharing one copy with 10 at once](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/2-best-settings.png)

*The same rules, with each language's own numbers.*

What the search showed:

- **Python needs several processes.** With one process it failed in the retry test below, up to about 400 connections in 10 seconds. With two it still failed in some runs. With five it never did. With ten it also never did, but it answered fewer requests and used 1.6 GB.
- **Go needs one process and nothing else.** Changing its garbage collector setting did not help. At 48 requests at once it started to fail (14 requests in two short runs), so its limit stops at 32.
- **Rust has two answers**, and they need their own section.

## Rust, two ways

In Python and Go, the model is loaded once and every request uses that one copy at the same time. Rust's ONNX Runtime library, `ort`, does not allow that. Running the model needs exclusive access to the loaded copy (in Rust terms, `run` takes `&mut self`), so the compiler rejects any code where two requests use one copy together.

The library's author is explicit about why: parts of ONNX Runtime are not safe to use from several threads at once, earlier versions of `ort` that allowed it saw crashes and memory corruption, GPU providers in particular have not been safe, and the rule stays until ONNX Runtime guarantees otherwise. The recommended way is one copy of the model per thread.

So a Rust server has two honest options:

- **By the book.** One copy of the model for every request it works on at once: 20 copies here. Each copy adds about 15 MB, the size of the model file, so the server idles at 367 MB.
- **One shared copy.** A single line marked `unsafe` tells the compiler "I take responsibility here", and every request uses the same copy, exactly as Python and Go do. The server then idles at 84 MB, less than Go.

I ran both through every test. Neither lost a request, and the shared version gave the right answer every time, including 200 requests in parallel that all came back as the same "Egyptian cat" with the same probability. That is what this test can say. It cannot say the shared version is safe: I ran it on the CPU only, for a few minutes at a time, and the warning is mostly about GPUs.

One side effect of the settings: with one thread per request, a single request takes longer than in part 1, because the model no longer uses all the cores for it. On one connection: 14.6 ms (Python), 16.8 ms (Go), 14.3 ms (Rust, both ways).

## More than it can handle

First the ceiling. With 64 connections, each sending its next photo as soon as the last one is answered, the servers answer about 380 to 450 requests per second.

Then I sent requests at one and a half times each server's ceiling for 20 seconds, whether or not it kept up.

| | Python | Go | Rust, by the book | Rust, one shared copy |
|---|---:|---:|---:|---:|
| failed | 0 | 0 | 0 | 0 |
| told "busy" | 4,831 | 3,416 | 4,655 | 4,443 |
| answered per second | 473 | 389 | 453 | 397 |
| median wait | 266 ms | 338 ms | 249 ms | 262 ms |

![At one and a half times the ceiling: no failed request in Python, Go or Rust; the surplus is told busy and the rest are answered in about a quarter of a second](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/3-overload.png)

*Overloaded, and nothing fails.*

Nothing fails, in any of the five runs. Each server keeps answering at its ceiling, tells the surplus "busy" within milliseconds, and answers the ones that get in in about a quarter to a third of a second.

I do not rank the "answered per second" row. Between the five runs each server swung by 100 requests per second or more (Python from 320 to 491, Rust with one shared copy from 353 to 523), and the ranges overlap. What can be said is that all of them sit around 390 to 470.

At half the ceiling there is no queue at all: the median is 14.9 ms (Python), 17.5 ms (Go) and 15.0 ms (Rust), the same as a single request.

## A thousand at once

The question from the title in its plainest form: a thousand clients send one photo each, at the same moment.

| | Python | Go | Rust, by the book | Rust, one shared copy |
|---|---:|---:|---:|---:|
| answered | 255 | 592 | 228 | 174 |
| told "busy" | 745 | 408 | 772 | 826 |
| failed | 0 | 0 | 0 | 0 |
| all dealt with in | 0.6 s | 2.2 s | 0.6 s | 0.5 s |

![A thousand requests at the same moment: every one is either answered or told busy, none fail](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/4-thousand-at-once.png)

*A thousand at once: answered or told "busy", never lost.*

Each server takes what it has room for, plus the ones that fit as the first answers go out, and tells the rest "busy". No request is lost. Go takes the longest, between 0.8 and 4.1 seconds across the runs, and answers the most, because its limit of 32 lets more in. Why its thousand take longer to get through was not measured.

Being told "busy" is not a failure. The client knows within milliseconds and can try again, or try another server. A failure is a request that waits 10 seconds and gets nothing.

## A thousand clients that will not stop retrying

The hardest test: a thousand connections for 20 seconds, where a client that is told "busy" sends its next request immediately. Each server is now hit with tens of thousands of requests per second, and has to turn nearly all of them away.

| | Python | Go | Rust, by the book | Rust, one shared copy |
|---|---:|---:|---:|---:|
| failed | 0 | 0 | 0 | 0 |
| turned away per second | 21,900 | 17,500 | 41,400 | 52,500 |
| answered per second | 221 | 238 | 271 | 186 |

![A thousand clients retrying non-stop: no failed request; tens of thousands of requests are turned away each second while real ones are still answered](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/5-retry.png)

*Turning the flood away while still answering.*

Still nothing fails. All of them keep answering real requests while turning the flood away, though well below their ceiling: turning a request away is work too.

This is the test Python could not pass with one process. In Python, accepting a connection and saying "busy" both run on a single thread, and with a thousand clients hammering it that thread fell behind until connections timed out. That is the GIL, Python's lock that lets only one thread run Python code at a time. Five processes means five such threads, and that was enough.

The same thing shows on `/ping`, an endpoint that answers `{"ok":true}` without touching a photo or the model, so only the language and its framework are working. On 64 connections: Python 59,778 requests per second with its five processes, Go 93,389, Rust 97,142 to 99,190. (The load tool runs on the same machine, so read these as a comparison, not as each server's limit.)

## What it costs

None of them broke. The cost of not breaking is where they differ, and memory is the part that is stable from run to run:

| | Python | Go | Rust, by the book | Rust, one shared copy |
|---|---:|---:|---:|---:|
| processes | 5 | 1 | 1 | 1 |
| copies of the model | 5 | 1 | 20 | 1 |
| memory when idle | 852 MB | 99 MB | 367 MB | 84 MB |
| peak memory under load | 933 MB | 479 MB | 675 MB | 316 MB |

![What it costs: memory when idle is 852 MB for Python with five processes, 99 MB for Go, 367 MB for Rust by the book and 84 MB for Rust sharing one copy of the model](https://raw.githubusercontent.com/haryarrahman14/ai-service-series/main/content/02-thousand-requests/img/en/6-cost.png)

*Nobody broke. The price is different.*

- **Python** pays in memory. Each process loads its own copy of the model and of Python itself: 852 MB before the first request. It also splits the queue: each process only knows its own 8 and 20, so one process can say "busy" while another is idle.
- **Go** is the cheapest to run without bending any rule: one process, one copy of the model, 99 MB.
- **Rust** is the heaviest of the single-process servers when it follows its library, and the lightest of all when it shares one copy. The memory was never Rust's. It is the 20 copies of the model.

## If this goes to production

What I would take from these runs into a real service:

- **Set a limit, a queue and a "busy" answer, in any language.** None of the three frameworks does it for you. Part 3 shows what happens without them.
- **Make clients wait before they retry.** The retry test is clients doing the worst thing possible. It cost every server a third to a half of its throughput, and it is what broke Python with one process.
- **Python: run several processes and budget memory for each.** Here that was about 170 MB per process with a 14 MB model; a larger model multiplies. The limit and queue are per process, so put one shared queue or a load balancer in front if a few "busy" answers at half load matter to you.
- **Go: the standard server is enough, but the limit is yours to write.** It is a channel and four lines.
- **Rust: start with one copy of the model per request in flight, as `ort` says, and pay the memory.** Share one copy only on the CPU, only knowingly, and only after your own long load test: the line is marked `unsafe` because nobody is checking it for you any more, and the library's author says GPU providers have not been safe this way for years.
- **Measure on your own machine.** The best numbers here (32 for Go, 8 per process for Python, 10 or 20 for Rust) belong to one 10-core laptop and one small model.

## So which breaks first?

None of them, when each is set up well. A limit, a short queue and an honest "busy" were enough for all three to take a thousand requests at once, more traffic than the machine can serve, and a thousand clients retrying non-stop, without losing a single request.

The one that came closest is Python. It is the only one that failed during the search for its settings, and the only one that needed more than one process to stop. That is the GIL showing up where part 1 said it would: not in the model, which runs in C++, but in the plain work of accepting and refusing connections, which is Python's own.

## What this test does not show

- The load tool and the server share one laptop. On separate machines the numbers would differ, most of all in the retry test, where the tool itself was sending tens of thousands of requests per second.
- Throughput was not steady enough to rank. Other work was running on the laptop during some of the final runs, and "answered per second" moved by up to a third between runs. Failures and memory did not move.
- One small photo, one small model, one machine, the CPU only.
- The searches ran each combination twice, for 10 seconds per test. Several of Rust's and Go's combinations were too close to separate, so another day could pick different numbers.
- Rust by the book was searched up to 20 requests at once, the others up to 48.
- I tuned the servers, not the image code. Each language still decodes and resizes the photo the way it did in part 1.
- The queue of 100 is my choice. A longer queue means fewer "busy" answers and longer waits.

## Next

Every server here was told how much to take on. Part 3 takes all of that away: the same three servers exactly as their frameworks hand them to you, no limit, no queue, no tuning, under the same thousand requests. One of them loses hundreds of requests and grows to 2 GB of memory.

## Setup

- MacBook Pro, Apple M1 Pro (10 cores), 32 GB RAM, macOS 26.6.2, on AC power
- ONNX Runtime 1.32.0, CPU, one thread per request
- Python 3.14.6, fastapi 0.163.2, uvicorn 0.54.0
- Go 1.27.4, `net/http`
- Rust 1.100.0, axum 0.8.9, tokio 1.54.1, `ort` 2.0.0-rc.15
- oha 1.17.0, on the same machine

Code, raw results and the fairness notes: [github.com/haryarrahman14/ai-service-series](https://github.com/haryarrahman14/ai-service-series), folder `02-thousand-requests`.

## Sources

- [FastAPI: where blocking code runs](https://fastapi.tiangolo.com/async/)
- [Go net/http: a new goroutine for each connection](https://pkg.go.dev/net/http#Server.Serve)
- [tokio: semaphore](https://docs.rs/tokio/latest/tokio/sync/struct.Semaphore.html)
- [ort](https://crates.io/crates/ort)
- [ort: why `run` needs exclusive access to a session](https://github.com/pykeio/ort/issues/402#issuecomment-2949993914)
- [ort: "Is there a thread-safe alternative to session.run()"](https://github.com/pykeio/ort/issues/511)
- [ONNX Runtime: thread management](https://onnxruntime.ai/docs/performance/tune-performance/threading.html)
- [oha](https://github.com/hatoo/oha)

## Follow

- Instagram (Bahasa Indonesia): [@dasarnya.id](https://www.instagram.com/dasarnya.id/)
- Instagram (English): [@bassically.en](https://www.instagram.com/bassically.en/)
- Threads (Bahasa Indonesia): [@dasarnya.id](https://www.threads.com/@dasarnya.id)
- Threads (English): [@bassically.en](https://www.threads.com/@bassically.en)
- Medium: [@haryarrahman14](https://medium.com/@haryarrahman14)
