import { parseScript } from 'esprima';
import { generate } from 'escodegen';
import { currentTime } from '@most/scheduler';
import vm from 'vm';
import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMidi from '@coda/midi';
import * as codaMl from '@coda/ml';
import * as codaMyo from '@coda/myo';

codaMax.setup(codaCore.Stream);
codaMidi.setup(codaCore.Stream);
codaMl.setup(codaCore.Stream);

const defaultScheduler = codaCore.newDefaultScheduler();

const findStream = sandbox => (stream) => {
  const streamId = Object.values(sandbox.streams)
    .filter(x => x.stream === stream)
    .map(x => x.id);
  return (streamId && streamId[0]) || null;
};

const streamExists = sandbox => streamId =>
  Object.keys(sandbox.streams).includes(streamId);

const cancelStream = sandbox => (streamId) => {
  const s = sandbox;
  if (Object.keys(sandbox.streams).includes(streamId)) {
    s.streams[streamId].cancel();
  }
};

const synthExists = sandbox => synthId =>
  Object.keys(sandbox.synths).includes(synthId);

const stopSynth = sandbox => (synthId) => {
  const s = sandbox;
  if (Object.keys(sandbox.synths).includes(synthId)) {
    s.synths[synthId].synth.dispose();
    delete s.synths[synthId];
    delete s[synthId];
  }
};

/**
 * Start a stream: run effects on a most-type stream
 * @private
 * @param  {object} sandbox the Node VM context
 * @return {function}       [description]
 */
const start = sandbox => async (streamId) => {
  const s = sandbox;
  const stream = s[streamId];
  // If a stream with the same name already exists, cancel it.
  if (s.streamExists(streamId)) {
    s.cancelStream(streamId);
    await s.streams[streamId].effects;
  }
  // Store stream information in the sanndbox
  s.streams[streamId] = { id: streamId };
  // Create a "canceller" stream to interrupt the processing when necessary
  const cancellerStream = {
    run(sink, scheduler) {
      s.streams[streamId].cancel = () => {
        try {
          sink.event(currentTime(scheduler), null);
        } catch (e) {
          sink.error(currentTime(scheduler), e);
        }
      };
      return {
        dispose() {},
      };
    },
  };
  // Multicast the stream (for multiple sinks) and merge with the canceller stream
  s[streamId] = codaCore.multicast(codaCore.until(cancellerStream, stream));
  // Run the stream
  const effects = codaCore.runEffects(s[streamId], defaultScheduler)
    .then(() => {
      const elt = sandbox.doc.getElementById(`stream-display-${streamId}`);
      if (elt) {
        elt.remove();
      }
      delete s.streams[streamId];
      delete s[streamId];
    });
  s.streams[streamId].stream = s[streamId];
  s.streams[streamId].effects = effects;
  const newDiv = document.createElement('div');
  newDiv.appendChild(document.createTextNode(streamId));
  newDiv.setAttribute('class', 'stream');
  newDiv.setAttribute('id', `stream-display-${streamId}`);
  const elt = sandbox.doc.getElementById('streams');
  if (elt) {
    elt.appendChild(newDiv);
  }
};

const registerSynth = sandbox => (synthId) => {
  const s = sandbox;
  const synth = s[synthId];
  if (s.synthExists(synthId)) {
    s.stopSynth(synthId);
  }
  s[synthId] = synth;
  s.synths[synthId] = {
    id: synthId,
    synth,
  };
};

const stop = sandbox => async (stream) => {
  const streamId = (typeof stream === 'string')
    ? stream
    : sandbox.findStream(stream);
  if (streamId && sandbox.streamExists(streamId)) {
    sandbox.cancelStream(streamId);
  }
};

const clear = sandbox => async () => {
  const proms = Object.keys(sandbox.streams).map((streamId) => {
    sandbox.cancelStream(streamId);
    return sandbox.streams[streamId].effects;
  });
  await Promise.all(proms);
  const s = sandbox;
  const syns = Object.keys(sandbox.synths);
  syns.forEach((synthId) => {
    sandbox.synths[synthId].synth.dispose();
    delete s.synths[synthId];
    delete s[synthId];
  });
};

/**
 * Run a piece of javascript code in a sandboxed virtual machine.
 *
 * The sandbox is isolated from the global environment and includes the coda
 * and Tone.js libraries. Errors and messages to the console are caught and
 * displayed in the webpage ('#console').
 *
 * We automatically run stream effects on assignment. This means that every time
 * a stream is assigned to a variable, we call `runEffects()` with a default
 * scheduler. Streams are stored in the `streams` object with their
 * corresponding identifier and can be later canceled when `stop()` or `clear()`
 * are called.
 * @private
 * @param  {string} code The JavaScript code to compile and run.
 */
const runInSandbox = sandbox => function run(code) {
  // const s = sandbox;
  // 1. Parse the JS code to track assignments
  try {
    const { body } = parseScript(code);
    body.forEach(({ expression, declarations }) => {
      const statement = generate(declarations ? declarations[0] : expression);
      vm.runInContext(statement, sandbox);
      const assignedVariables = [];
      if (declarations) {
        declarations.forEach((x) => {
          assignedVariables.push(x.id.name);
        });
      } else if (expression.type === 'AssignmentExpression') {
        assignedVariables.push(generate(expression.left));
      }
      assignedVariables.forEach((varName) => {
        try {
          const isStream = !!sandbox[varName].isStream;
          const isSynth = !!sandbox[varName].isSynth;
          if (isStream) {
            // Run stream
            start(sandbox)(varName);
          } else if (isSynth) {
            registerSynth(sandbox)(varName);
          }
        } catch (e) {} // eslint-disable-line
      });
    });
  } catch (e) {
    sandbox.err(e); // eslint-disable-line no-console
  }
};

export default function createSandbox(uiContainer, logCallback) {
  codaUi.setup(codaCore.Stream, uiContainer);
  const s = Object.assign(
    codaCore,
    codaAudio,
    codaUi,
    codaMax,
    codaMidi,
    codaMl,
    codaMyo,
    { streams: {}, synths: {} },
  );
  const sandbox = vm.createContext(s);
  sandbox.findStream = findStream(sandbox);
  sandbox.streamExists = streamExists(sandbox);
  sandbox.cancelStream = cancelStream(sandbox);
  sandbox.synthExists = synthExists(sandbox);
  sandbox.stopSynth = stopSynth(sandbox);
  sandbox.stop = stop(sandbox);
  sandbox.start = start(sandbox);
  sandbox.clear = clear(sandbox);
  sandbox.doc = document;
  sandbox.log = (...args) => {
    logCallback(args.join(' '), false);
    console.log(...args); // eslint-disable-line no-console
  };
  sandbox.err = (...args) => {
    logCallback(args.join(' '), true);
    console.log(...args); // eslint-disable-line no-console
  };
  sandbox.keys = Object.keys(sandbox);
  sandbox.clear();
  return runInSandbox(sandbox);
}
