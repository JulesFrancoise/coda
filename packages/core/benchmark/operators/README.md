# Benchmark / Operators

Updated: 2018-8-10 14:00:49

| operator                     | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------|
| Baseline # 10000 x 20        |  23269.10 op/s ±  3.99% | (16 samples) |   0.0430 ms / frame |
| Biquad # 10000 x 20          |  22305.86 op/s ±  3.66% | (15 samples) |   0.0448 ms / frame |
| Force # 10000 x 20           |   1075.24 op/s ±  3.57% |  (5 samples) |   0.9300 ms / frame |
| Kicks # 10000 x 20           |   1089.69 op/s ± 14.05% |  (5 samples) |   0.9177 ms / frame |
| Mvavrg # 10000 x 20          |  22700.38 op/s ±  4.08% | (16 samples) |   0.0441 ms / frame |
| Scale # 10000 x 20           |  21853.39 op/s ±  5.83% | (15 samples) |   0.0458 ms / frame |
| Slide # 10000 x 20           |  21546.34 op/s ±  5.75% | (15 samples) |   0.0464 ms / frame |
