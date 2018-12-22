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
import * as codaLeapmotion from '@coda/leapmotion';

codaCore.Stream
  .use(codaMax.default)
  .use(codaMidi.default)
  .use(codaMl.default);

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
const runInSandbox = sandbox => async function run(code) {
  // const s = sandbox;
  // 1. Parse the JS code to track assignments
  try {
    const { body } = parseScript(code);
    const statements = [];
    const assignedVariables = [];
    // Parse statements and variable assignments
    body.forEach(({ expression, declarations }) => {
      const statement = generate(declarations ? declarations[0] : expression);
      let assignment = null;
      if (declarations) {
        if (declarations.length > 1) {
          throw new Error('THERE ARE MORE THAN 2 ASSIGNMENTS !#!???!?');
        }
        assignment = declarations[0].id.name;
      } else if (expression.type === 'AssignmentExpression') {
        assignment = generate(expression.left);
      }
      // Avoid running multiple assignments in the same code block
      const alreadyAssigned = statements.map(x => x[1]).indexOf(assignment);
      if (alreadyAssigned >= 0) {
        statements[alreadyAssigned][1] = null;
      }
      assignedVariables.push(assignment);
      statements.push([statement, assignment]);
    });
    // Cancel all streams that are assigned to existing variables
    const canceledStreams = assignedVariables
      .filter(varName => sandbox[varName]
        && !!sandbox[varName].isStream
        && sandbox.streamExists(varName))
      .map((streamId) => {
        sandbox.cancelStream(streamId);
        return sandbox.streams[streamId].effects;
      });
    await Promise.all(canceledStreams);
    // Execute statements and run streams
    statements.forEach(([statement, assignment]) => {
      vm.runInContext(statement, sandbox);
      try {
        const isStream = !!sandbox[assignment].isStream;
        const isSynth = !!sandbox[assignment].isSynth;
        if (isStream) {
          // Run stream
          start(sandbox)(assignment);
        } else if (isSynth) {
          registerSynth(sandbox)(assignment);
        }
      } catch (e) {} // eslint-disable-line
    });
  } catch (e) {
    sandbox.err(e); // eslint-disable-line no-console
  }
};

export default function createSandbox(uiContainer, logCallback) {
  codaCore.Stream.use(codaUi.default, uiContainer);
  const s = Object.assign(
    codaCore,
    codaAudio,
    codaUi,
    codaMax,
    codaMidi,
    codaMl,
    codaMyo,
    codaLeapmotion,
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
