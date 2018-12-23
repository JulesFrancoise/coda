# Benchmark / Circular Buffer

Updated: 2018-12-23 11:43:25

| optimisation                 | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------
| CircularBuffer # 10000 x 1   |    431.62 op/s ±  0.21% | (87 samples) |   0.0002 ms / frame |
| CircularBuffer / values # 10000 x 1 |    198.16 op/s ±  4.23% | (77 samples) |   0.0005 ms / frame |
| PushShift # 10000 x 1        |    344.72 op/s ±  6.71% | (80 samples) |   0.0003 ms / frame |
