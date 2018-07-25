# Benchmark / Operators

Updated: 2018-5-16 13:56:42

| operator                     | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------|
| Baseline # 10000 x 20        |  24767.92 op/s ±  3.10% | (16 samples) |   0.0404 ms / frame |
| Biquad # 10000 x 20          |  23328.15 op/s ±  3.71% | (16 samples) |   0.0429 ms / frame |
| Force # 10000 x 20           |   2011.91 op/s ±  0.72% |  (6 samples) |   0.4970 ms / frame |
| Kicks # 10000 x 20           |    553.58 op/s ±  6.61% |  (5 samples) |   1.8064 ms / frame |
| Mvavrg # 10000 x 20          |  22900.75 op/s ±  3.94% | (16 samples) |   0.0437 ms / frame |
| Scale # 10000 x 20           |  22089.70 op/s ±  5.74% | (15 samples) |   0.0453 ms / frame |
| Slide # 10000 x 20           |  22312.75 op/s ±  3.55% | (16 samples) |   0.0448 ms / frame |
