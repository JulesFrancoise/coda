import { parseScript } from 'esprima';
import { generate } from 'escodegen';
import vm from 'vm';
import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMyo from '@coda/myo';

codaUi.setup(codaCore.Stream);
codaMax.setup(codaCore.Stream);

const defaultScheduler = codaCore.newDefaultScheduler();

const findStream = sandbox => (stream) => {
  const streamId = Object.keys(sandbox.streams)
    .map(id => sandbox.streams[id])
    .filter(x => x.stream === stream)
    .map(x => x.id);
  return (streamId && streamId[0]) || null;
};

const streamExists = sandbox => streamId =>
  Object.keys(sandbox.streams).includes(streamId);

const cancelStream = sandbox => (streamId) => {
  const s = sandbox;
  if (Object.keys(sandbox.streams).includes(streamId)) {
    s.streams[streamId].active = false;
  }
};

const synthExists = sandbox => synthId =>
  Object.keys(sandbox.synths).includes(synthId);

const stopSynth = sandbox => (synthId) => {
  const s = sandbox;
  if (Object.keys(sandbox.synths).includes(synthId)) {
    s.synths[synthId].synth.dispose();
  }
};

/**
 * Start a stream: run effects on a most-type stream
 * @param  {object} sandbox the Node VM context
 * @return {function}       [description]
 */
const start = sandbox => async (streamId) => {
  const s = sandbox;
  if (s.streamExists(streamId)) {
    s.cancelStream(streamId);
    await s.streams[streamId].effects;
  }
  const stream = s[streamId];
  s[streamId] = codaCore.multicast(codaCore.takeWhile(
    () => s.streams[streamId] && s.streams[streamId].active,
    stream,
  ));
  const effects = codaCore.runEffects(
    s[streamId],
    defaultScheduler,
  ).then(() => {
    sandbox.doc.getElementById(`stream-display-${streamId}`).remove();
    delete s.streams[streamId];
  });
  s.streams[streamId] = {
    id: streamId,
    stream: s[streamId],
    effects,
    active: true,
  };
  const newDiv = document.createElement('div');
  newDiv.appendChild(document.createTextNode(streamId));
  newDiv.setAttribute('class', 'stream');
  newDiv.setAttribute('id', `stream-display-${streamId}`);
  sandbox.doc.getElementById('streams').appendChild(newDiv);
};

const registerSynth = sandbox => (synthId) => {
  const s = sandbox;
  if (s.synthExists(synthId)) {
    s.stopSynth(synthId);
  }
  s.synths[synthId] = {
    id: synthId,
    synth: s[synthId],
  };
};

const stop = sandbox => (stream) => {
  const streamId = (typeof stream === 'string') ? stream :
    sandbox.findStream(stream);
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
  Object.keys(sandbox.synths).forEach((synthId) => {
    sandbox.synths[synthId].synth.stop();
    sandbox.synths[synthId].synth.dispose();
  });
};

/**
 * Create a Node VM sandbox that includes coda and Tone.js
 * @return {object} the vm context
 */
function createSandbox() {
  const s = Object.assign(
    codaCore,
    codaAudio,
    codaUi,
    codaMax,
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
  return sandbox;
}

const sandbox = createSandbox();

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
 *
 * @param  {string} code The JavaScript code to compile and run.
 */
export function run(code) {
  // 1. Parse the JS code to track assignments
  try {
    const { body } = parseScript(code);
    body.forEach(({ expression }) => {
      const statement = generate(expression);
      vm.runInContext(statement, sandbox);
      if (expression.type === 'AssignmentExpression') {
        const varName = generate(expression.left);
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
      }
    });
  } catch (e) {
    sandbox.doc.getElementById('console').setAttribute('class', 'error');
    sandbox.doc.getElementById('console').textContent = `Syntax Error: ${e}`;
    setTimeout(() => {
      sandbox.doc.getElementById('console').setAttribute('class', '');
    }, 100);
    console.log(e); // eslint-disable-line no-console
  }
}


export function initializeSandbox(document, console) {
  sandbox.doc = document;
  sandbox.log = (...args) => {
    sandbox.doc.getElementById('console').textContent = args.join(' ');
    console.log(...args);
  };
  sandbox.keys = Object.keys(sandbox);
  sandbox.clear();
  return sandbox;
}

export default sandbox;
