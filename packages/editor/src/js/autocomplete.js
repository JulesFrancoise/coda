import CodeMirror from 'codemirror';
import sandbox from './sandbox';

const solarCompletions = {
  // basic
  add: 'add(stream)',
  sub: 'sub(stream)',
  mul: 'mul(stream)',
  div: 'div(stream)',
  mean: 'mean()',
  std: 'std()',
  meanstd: 'meanstd()',
  pack: 'pack([])',
  pak: 'pak([])',
  unpack: 'unpack()',
  reduce: 'reduce(f, initial)',
  elementwise: 'elementwise(f, stream)',
  schmitt: 'schmitt({ up: 0.9, down: 0.1, continuous: false })',
  slide: 'slide({ size: 1 })',
  // filters
  biquad: 'biquad({ f0: 1, type: \'lowpass\', gain: 1, q: 1 })',
  force: 'force({ logdiff: -3, logjump: -10 })',
  mvavrg: 'mvavrg({ size: 1 })',
  // mapping
  accum: 'accum()',
  atodb: 'atodb()',
  clip: 'clip({ min: 0, max: 1 })',
  cycle: 'cycle(\'buffer\')',
  dbtoa: 'dbtoa()',
  delta: 'delta({ size: 3 })',
  ftom: 'ftom()',
  mtof: 'mtof()',
  quantize: 'quantize({scale: \'chromatic\', octavemin: 0, octavemax: 10, mode: \'round\' })',
  rand: 'rand({ size: 1 })',
  scale: 'scale({ inmin: 0, inmax: 1, outmin: 0, outmax: 1 })',
  // ml
  train: 'train({ type: \'GMM\' })',
  recognize: 'recognize({ model })',
  // spectral
  kicks: 'kicks({  fmin: 10, threshold: 40, thresholdRelease: 30 })',
  wavelet: 'wavelet({ frequencyMin: 1, frequencyMax: 50, bandsPerOctave: 4, carrier: 5, optimisation: \'standard2\' })',
  // sources
  myo: 'myo()',
  xebra: 'xebra(\'*\', \'localhost\')',
  transport: 'transport(\'4n\')',
  // ui
  plot: 'plot({ legend: \'\', stacked: false, fill: \'none\', duration: 5 })',
  heatmap: 'heatmap({ legend: \'\', duration: 5 })',
  looper: 'looper({ stacked: false, fill: \'none\' })',
  recorder: 'recorder({ name: \'\', stacked: false, fill: \'none\' })',
  // most
  periodic: 'periodic(10)',
  tap: 'tap(f)',
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
      const completions = Object.assign(sandBoxItems, solarCompletions);
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
