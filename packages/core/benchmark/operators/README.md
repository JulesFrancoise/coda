# Benchmark / Operators

Updated: 2018-12-23 11:43:45

| operator                     | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------|
| Baseline # 10000 x 20        |  23417.35 op/s ±  1.45% | (16 samples) |   0.0427 ms / frame |
| Biquad # 10000 x 20          |  22971.18 op/s ±  1.50% | (16 samples) |   0.0435 ms / frame |
| Force # 10000 x 20           |   1176.17 op/s ±  4.02% |  (5 samples) |   0.8502 ms / frame |
| Kicks # 10000 x 20           |   1270.74 op/s ±  1.54% |  (5 samples) |   0.7869 ms / frame |
| Mvavrg # 10000 x 20          |  22161.66 op/s ±  2.03% | (15 samples) |   0.0451 ms / frame |
| Scale # 10000 x 20           |  22841.26 op/s ±  2.37% | (16 samples) |   0.0438 ms / frame |
| Slide # 10000 x 20           |  21784.68 op/s ±  4.20% | (15 samples) |   0.0459 ms / frame |
