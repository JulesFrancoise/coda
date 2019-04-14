<template>
  <codemirror
    :value="value"
    @input="x => $emit('value', x)"
    :options="cmOptions"
    @keyHandled="onKeyHandled"
  ></codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import CodeMirror from 'codemirror';
import 'codemirror/keymap/sublime';
import jsHint from 'jshint';
import autocomplete from './autocomplete';

window.JSHINT = jsHint.JSHINT;

function getSelectionCodeColumn(cm, findBlock) {
  let pos = cm.getCursor();
  let text = null;

  if (!findBlock) {
    text = cm.getDoc().getSelection();

    if (text === '') {
      text = cm.getLine(pos.line);
    } else {
      pos = {
        start: cm.getCursor('start'),
        end: cm.getCursor('end'),
      };
    }
  } else {
    let startline = pos.line;
    let endline = pos.line;

    while (startline > 0 && cm.getLine(startline) !== '') {
      startline -= 1;
    }
    while (endline < cm.lineCount() && cm.getLine(endline) !== '') {
      endline += 1;
    }

    const pos1 = { line: startline, ch: 0 };
    const pos2 = { line: endline, ch: 0 };

    text = cm.getRange(pos1, pos2);
    pos = { start: pos1, end: pos2 };
  }

  if (pos.start === undefined) {
    pos = {
      start: { line: pos.line, ch: 0 },
      end: { line: pos.line, ch: text.length },
    };
  }

  return { selection: pos, code: text };
}

function flash(cm, pos) {
  let sel;
  const cb = () => { sel.clear(); };

  if (pos !== null) {
    if (pos.start) { // if called from a findBlock keymap
      sel = cm.markText(
        pos.start,
        pos.end,
        { className: 'CodeMirror-highlight' },
      );
    } else { // called with single line
      sel = cm.markText(
        { line: pos.line, ch: 0 },
        { line: pos.line, ch: null },
        { className: 'CodeMirror-highlight' },
      );
    }
  } else { // called with selected block
    sel = cm.markText(
      cm.getCursor(true),
      cm.getCursor(false),
      { className: 'CodeMirror-highlight' },
    );
  }

  window.setTimeout(cb, 250);
}

CodeMirror.keyMap.playground = {
  fallthrough: 'sublime',
  'Ctrl-Enter': () => {},
  'Alt-Enter': () => {},
};

export default {
  name: 'App',
  components: {
    codemirror,
  },
  props: {
    value: {
      type: String,
      default: '// Welcome to the playground...',
    },
  },
  data() {
    return {
      cmOptions: {
        mode: 'javascript',
        keyMap: 'playground', // playground
        theme: 'dracula',
        autofocus: true,
        matchBrackets: true,
        tabSize: 2,
        lineNumbers: true,
        allowDropFileTypes: ['text/javascript'],
        autoCloseBrackets: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: { esversion: 6 },
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        hintOptions: { hint: autocomplete },
      },
    };
  },
  methods: {
    onKeyHandled(cm, key) {
      if (key === 'Ctrl-Enter') {
        try {
          const selectedCode = getSelectionCodeColumn(cm, false);
          flash(cm, selectedCode.selection);
          this.$emit('run', selectedCode.code);
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
        }
      } else if (key === 'Alt-Enter') {
        try {
          const selectedCode = getSelectionCodeColumn(cm, true);
          flash(cm, selectedCode.selection);
          this.$emit('run', selectedCode.code);
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
        }
      }
    },
  },
};
</script>

<style>
.vue-codemirror {
  width: 100%;
  height: calc(100% - 20px);
}
.CodeMirror {
  width: 100%;
  height: 100%;
}

.CodeMirror-highlight {
  background-color: rgb(232, 158, 48);
}

.CodeMirror-gutters {
  background: #32332d;
}
/* LINTING */
/* The lint marker gutter */
.CodeMirror-lint-markers {
  width: 16px;
}

.CodeMirror-lint-tooltip {
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-family: monospace;
  font-size: 10pt;
  overflow: hidden;
  padding: 2px 5px;
  position: fixed;
  white-space: pre;
  white-space: pre-wrap;
  z-index: 100;
  /*max-width: 600px;*/
  opacity: 0;
  transition: opacity .4s;
  -moz-transition: opacity .4s;
  -webkit-transition: opacity .4s;
  -o-transition: opacity .4s;
  -ms-transition: opacity .4s;
}

.CodeMirror-lint-marker-error,
.CodeMirror-lint-marker-warning {
  cursor: pointer;
  display: inline-block;
  position: relative;
  border-radius: 6px;
  width: 6px;
  height: 6px;
  margin-top: 5px;
  margin-left: 20px;
}

.CodeMirror-lint-marker-error {
  background: red;
}

.CodeMirror-lint-marker-warning {
  background: orange;
}

.CodeMirror-lint-marker-multiple {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  border: 1px solid orange;
  top: -2px;
  left: -2px;
  padding: 0;
}

.CodeMirror-lint-message-error::before,
.CodeMirror-lint-message-warning::before {
  background-color: #000;
  float: left;
  font-size: 0.9em;
}

.CodeMirror-lint-message-error::before {
  content: '[error] ';
  color: red;
}

.CodeMirror-lint-message-warning::before {
  content: '[warning] ';
  color: orange;
}


.CodeMirror-hints {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;

  margin: 0;
  padding: 2px;

  background: rgba(0, 0, 0, 0.8);
  font-size: 90%;
  font-family: monospace;

  max-height: 20em;
  overflow-y: auto;
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 4px;
  white-space: pre;
  color: white;
  cursor: pointer;
}

li.CodeMirror-hint-active {
  background: #08f;
  color: white;
}

.cm-s-dracula.CodeMirror, .cm-s-dracula .CodeMirror-gutters {
  background-color: #0C1021 !important;
}
</style>
