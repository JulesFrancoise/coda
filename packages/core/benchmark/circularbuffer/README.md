# Benchmark / Circular Buffer

Updated: 2018-5-16 13:56:23

| optimisation                 | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------
| CircularBuffer # 10000 x 1   |    287.19 op/s ±  1.46% | (79 samples) |   0.0003 ms / frame |
| CircularBuffer / values # 10000 x 1 |     82.24 op/s ±  0.60% | (66 samples) |   0.0012 ms / frame |
| PushShift # 10000 x 1        |    115.95 op/s ±  0.33% | (78 samples) |   0.0009 ms / frame |
