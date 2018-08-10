# Benchmark / Circular Buffer

Updated: 2018-8-10 14:00:29

| optimisation                 | op/s                    | Samples      | ms / frame          |
|------------------------------|-------------------------|--------------|---------------------
| CircularBuffer # 10000 x 1   |    274.52 op/s ±  0.73% | (80 samples) |   0.0004 ms / frame |
| CircularBuffer / values # 10000 x 1 |     78.33 op/s ±  0.98% | (63 samples) |   0.0013 ms / frame |
| PushShift # 10000 x 1        |    104.48 op/s ±  0.92% | (71 samples) |   0.0010 ms / frame |
