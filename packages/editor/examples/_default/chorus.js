g = granular({
  file: 'hendrix',
  period: 0.2,
  duration: 0.1,
});

ch = chorus({ feedback: 0.9 });

g.connect(ch);
ch.connect();

g.position = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .plot();

ch.feedback = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .scale({ outmin: 0.7, outmax: 0.99 }).plot();
