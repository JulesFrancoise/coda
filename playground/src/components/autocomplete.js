import CodeMirror from 'codemirror';

const sandbox = {};

const codaCompletions = {
  // @coda/core
  accum: 'accum()',
  adaptive: 'adaptive({ duration: 15, refresh: 1 })',
  add: 'add(stream)',
  autoscale: 'autoscale()',
  biquad: 'biquad({ f0: 1, type: \'lowpass\', q: 1 })',
  clip: 'clip({ min: 0, max: 1 })',
  cycle: 'cycle([])',
  delta: 'delta({ size: 3 })',
  distance: 'distance(stream)',
  div: 'div(stream)',
  elementwise: 'elementwise(f, stream)',
  force: 'force({ logdiff: -2, logjump: -30 })',
  kicks: 'kicks({  fmin: 10, threshold: 40, thresholdRelease: 30 })',
  max: 'max()',
  mean: 'mean()',
  meanstd: 'meanstd()',
  min: 'min()',
  minmax: 'minmax()',
  mul: 'mul(stream)',
  mvavrg: 'mvavrg({ size: 1 })',
  norm: 'norm()',
  pack: 'pack([])',
  pak: 'pak([])',
  prod: 'prod()',
  rand: 'rand({ size: 1 })',
  reduce: 'reduce(f, initial)',
  scale: 'scale({ inmin: 0, inmax: 1, outmin: 0, outmax: 1 })',
  schmitt: 'schmitt({ up: 0.9, down: 0.1, continuous: false })',
  select: 'select(indices)',
  slide: 'slide({ size: 1, hop: 1 })',
  std: 'std()',
  sub: 'sub(stream)',
  sum: 'sum()',
  unpack: 'unpack()',
  wavelet: 'wavelet({ frequencyMin: 1, frequencyMax: 50, bandsPerOctave: 4, carrier: 5 })',
  withAttr: 'withAtttr({ format: \'vector\', size: 1 })',
  // Sensors
  devicemotion: 'devicemotion()',
  leapmotion: 'leapmotion({ period: 10 })',
  myo: 'myo()',
  smartphone: 'smartphone(\'id\')',
  // max
  fromMax: 'fromMax({ channel: \'coda\', hostname: \'localhost\'})',
  toMax: 'fromMax({ channel: \'coda\', hostname: \'localhost\'})',
  // ml
  gmmTrain: 'gmmTrain({ gaussians: 3, regularizationAbs: 0.01, regularizationRel: 0.1 })',
  gmmPredict: 'gmmPredict({ model, likelihoodWindow: 1, output: \'smoothedLogLikelihoods\' })',
  hmmTrain: 'hmmTrain({ states: 5, regularizationAbs: 0.01, regularizationRel: 0.1 })',
  hmmPredict: 'hmmPredict({ model, likelihoodWindow: 1, output: \'smoothedLogLikelihoods\' })',
  hhmmTrain: 'hhmmTrain({ states: 5, regularizationAbs: 0.01, regularizationRel: 0.1 })',
  hhmmPredict: 'hhmmPredict({ model, likelihoodWindow: 1, output: \'smoothedLogLikelihoods\' })',
  pcaTrain: 'pcaTrain()',
  pcaPredict: 'pcaPredict(model)',
  scaleTrain: 'scaleTrain()',
  scalePredict: 'scalePredict(model)',
  // midi
  atodb: 'atodb()',
  dbtoa: 'dbtoa()',
  ftom: 'ftom()',
  mtof: 'mtof()',
  quantize: 'quantize({scale: \'chromatic\', octavemin: 0, octavemax: 10, mode: \'round\' })',
  // ui
  heatmap: 'heatmap({ legend: \'\', duration: 5 })',
  looper: 'looper()',
  nodes: 'nodes({ name: \'nodes\', stacked: false, fill: \'none\' })',
  plot: 'plot({ legend: \'\', stacked: false, fill: \'none\', duration: 5 })',
  recorder: 'recorder({ name: \'\', stacked: false, fill: \'none\' })',
  // audio
  bitcrusher: 'bitcrusher({ bits: 16, normfreq: 0.1, bufferSize: 4096 })',
  catart: `catart({
    voices: 1,
    file: '',
    descriptors: ['loudness'],
    k: 1,
    periodRel: 1,
    periodVar: 0,
    durationRel: 1,
    resampling: 0,
    resamplingVar: 0,
    gain: 1,
    repeat: true,
  })`,
  chorus: 'chorus({ rate: 1.5,  feedback: 0.2,  delay: 0.0045 })',
  compressor: `compressor({
    threshold: -1,
    makeupGain: 1,
    attack: 1,
    release: 0,
    ratio: 4,
    knee: 5,
    automakeup: true,
  })`,
  concatenative: `concatenative({
    voices: 1,
    file: '',
    periodRel: 1,
    periodVar: 0,
    durationRel: 1,
    index: 0,
    positionVar: 0,
    attackAbs: 0.001,
    attackRel: 0,
    releaseAbs: 0.001,
    releaseRel: 0,
    resampling: 0,
    resamplingVar: 0,
    gain: 0,
    repeat: true,
  })`,
  convolver: 'convolver({ file: \'\' })',
  filt: 'filt({ frequency: 4, Q: 1, gain: 0, filterType: \'lowpass\' })',
  granular: `granular({
    voices: 1,
    file: '',
    period: 0.01,
    duration: 0.1,
    position: 0,
    positionVar: 0,
    resampling: 0,
    resamplingVar: 0,
    gain: 0,
  })`,
  moogFilter: 'moogFilter({ cutoff: 0.065, resonance: 3.5 })',
  overdrive: 'overdrive({ outputGain: 0.5, drive: 0.7, amount: 1, algorithmIndex: 0 })',
  panner: 'panner({ pan: 0 })',
  phaser: 'phaser({ rate: 1.2, depth: 0.3, feedback: 0.2, stereoPhase: 30, baseModulationFrequency: 700 })',
  pingpong: 'pingpong({ level: 0.5, feedback: 0.3, timeLeft: 150, timeRight: 200 })',
  sampler: 'sampler({ file: \'\', fadeTime: 600, gain: 1 })',
  tremolo: 'tremolo({ intensity: 0.3, rate: 4, stereoPhase: 0 })',
  // most
  empty: 'empty()',
  never: 'never()',
  now: 'now(x)',
  at: 'at(t, x)',
  periodic: 'periodic(10)',
  throwError: 'throwError(err)',
  startWith: 'startWith(x)',
  continueWith: 'continueWith(f)',
  map: 'map(f)',
  constant: 'constant(x)',
  tap: 'tap(f)',
  ap: 'ap(fs)',
  scan: 'scan(f, initial)',
  loop: 'loop(stepper, seed)',
  withItems: 'withItems([])',
  switchLatest: 'switchLatest()',
  join: 'join()',
  chain: 'chain(f)',
  concatMap: 'concatMap(f)',
  mergeConcurrently: 'mergeConcurrently(concurrency)',
  mergeMapConcurrently: 'mergeMapConcurrently(f, concurrency)',
  merge: 'merge(stream)',
  combine: 'combine(f, stream)',
  zip: 'zip(f, stream)',
  resample: 'sampler(samplerStream)',
  sample: 'sampler(valuesStream)',
  snapshot: 'snapshot(f, stream)',
  filter: 'filter(p)',
  skipRepeats: 'skipRepeats()',
  skipRepeatsWith: 'skipRepeatsWith(equals)',
  slice: 'slice(start, end)',
  take: 'take(num)',
  skip: 'skip(num)',
  takeWhile: 'takeWhile(p)',
  skipWhile: 'skipWhile(p)',
  skipAfter: 'skipAfter(p)',
  until: 'until(endSignal)',
  since: 'since(startSignal)',
  during: 'during(during)',
  delay: 'delay(time)',
  withLocalTime: 'withLocalTime(origin)',
  throttle: 'throttle(period)',
  debounce: 'debounce(period)',
  fromPromise: 'fromPromise(promise)',
  awaitPromises: 'awaitPromises(stream)',
  recoverWith: 'recoverWith(f)',
  multicast: 'multicast()',
  click: 'click(htmlNode)',
  dblclick: 'dblclick(htmlNode)',
  mousedown: 'mousedown(htmlNode)',
  mouseup: 'mouseup(htmlNode)',
  mousemove: 'mousemove(htmlNode)',
  mouseover: 'mouseover(htmlNode)',
  mouseenter: 'mouseenter(htmlNode)',
  mouseout: 'mouseout(htmlNode)',
  mouseleave: 'mouseleave(htmlNode)',
  touchcancel: 'touchcancel(htmlNode)',
  touchend: 'touchend(htmlNode)',
  touchmove: 'touchmove(htmlNode)',
  touchstart: 'touchstart (htmlNode)',
};

export default function autocomplete(cm) {
  return new Promise((accept) => {
    setTimeout(() => {
      const cursor = cm.getCursor();
      let token = cm.getTokenAt(cursor);

      if (/\b(?:string|comment)\b/.test(token.type)) return {};
      token.state = CodeMirror.innerMode(cm.getMode(), token.state).state;

      if (!/^[\w$_]*$/.test(token.string)) {
        token = {
          start: cursor.ch,
          end: cursor.ch,
          string: '',
          state: token.state,
          type: token.string === '.' ? 'property' : null,
        };
      } else if (token.end > cursor.ch) {
        token.end = cursor.ch;
        token.string = token.string.slice(0, cursor.ch - token.start);
      }
      const word = token.string;
      const sandBoxItems = Object.keys(sandbox)
        .reduce((a, c) => Object.assign(a, { [c]: c }), {});
      const completions = Object.assign(sandBoxItems, codaCompletions);
      const comp = Object.keys(completions)
        .filter(s => s.indexOf(word) === 0)
        .map(s => completions[s]);
      return accept({
        list: comp,
        from: CodeMirror.Pos(cursor.line, token.start),
        to: CodeMirror.Pos(cursor.line, token.end),
      });
    }, 100);
  });
}
