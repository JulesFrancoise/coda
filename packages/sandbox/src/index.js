import { parseScript } from 'esprima';
import { generate } from 'escodegen';
import vm from 'vm';
import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMidi from '@coda/midi';
import * as codaMl from '@coda/ml';
import * as codaSensors from '@coda/sensors';
import StreamManager from './stream_manager';
import SynthManager from './synth_manager';

class Sandbox {
  constructor(uiContainer, logCallback) {
    codaCore.Stream
      .use(codaMax)
      .use(codaMidi)
      .use(codaMl)
      .use(codaUi, uiContainer);
    const s = Object.assign(
      codaCore,
      codaAudio,
      codaUi,
      codaMax,
      codaMidi,
      codaMl,
      codaSensors,
      { streams: {}, synths: {} },
    );
    this.sandbox = vm.createContext(s);
    this.streamManager = new StreamManager(this.sandbox);
    this.synthManager = new SynthManager(this.sandbox);
    this.sandbox.stop = (...args) => {
      this.streamManager.stop(...args);
      this.synthManager.stop(...args);
    };
    this.sandbox.start = (args) => {
      this.streamManager.start(args);
      this.synthManager.start(args);
    };
    this.sandbox.clear = () => {
      this.streamManager.clear();
      this.synthManager.clear();
    };
    this.sandbox.doc = document;
    this.sandbox.log = (...args) => {
      logCallback(args.join(' '), false);
      console.log(...args); // eslint-disable-line no-console
    };
    this.sandbox.err = (...args) => {
      logCallback(args.join(' '), true);
      console.log(...args); // eslint-disable-line no-console
    };
    // this.sandbox.keys = Object.keys(this.sandbox);
    this.sandbox.clear();
  }

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
  async run(code) {
    // 1. Parse the JS code to track assignments
    try {
      this.runStatements(parseScript(code).body);
    } catch (e) {
      this.sandbox.err(e); // eslint-disable-line no-console
    }
  }

  async runStatements(statements) {
    if (!statements.length) return;
    const [{
      type,
      expression,
      declarations,
    }, ...rest] = statements;
    let assignment = null;
    let statement = null;
    if (type === 'FunctionDeclaration') {
      throw new Error('Function declarations are not available at the moment, use arrow functions');
    } else if (type === 'VariableDeclaration') {
      if (declarations.length > 1) {
        throw new Error('THERE ARE MORE THAN 2 ASSIGNMENTS !#!???!?');
      }
      assignment = declarations[0].id.name;
      statement = generate(declarations[0]);
    } else if (type === 'ExpressionStatement') {
      statement = generate(expression);
      if (expression.type === 'CallExpression') {
        if (expression.callee.type === 'Identifier'
          && expression.callee.name === 'stop') {
          const arg = expression.arguments[0].type === 'Literal'
            ? expression.arguments[0].value
            : expression.arguments[0].name;
          statement = `stop('${arg}');`;
        }
      }
      if (expression.type === 'AssignmentExpression') {
        assignment = generate(expression.left);
      }
    }
    // 1. Parse the JS code to track assignments
    try {
      await this.runStatement(statement, assignment);
    } catch (e) {
      this.sandbox.err(e); // eslint-disable-line no-console
    }
    this.runStatements(rest);
  }

  async runStatement(statement, assignment) {
    if (assignment) {
      await this.streamManager.stopOne(assignment);
    }
    vm.runInContext(statement, this.sandbox);
    if (assignment) {
      await this.streamManager.start(assignment);
      await this.synthManager.start(assignment);
    }
  }
}

export { Master } from '@coda/audio';

export default function createSandbox(uiContainer, logCallback) {
  const sandbox = new Sandbox(uiContainer, logCallback);
  return sandbox.run.bind(sandbox);
}
