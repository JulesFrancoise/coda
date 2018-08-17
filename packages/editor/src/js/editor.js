import CodeMirror from 'codemirror';
import { run } from './sandbox';
import autocomplete from './autocomplete';

require('codemirror/mode/javascript/javascript');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/comment/comment');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/javascript-hint');
require('./sublime_keymap');

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
  'Ctrl-Enter': (cm) => {
    try {
      const selectedCode = getSelectionCodeColumn(cm, false);
      flash(cm, selectedCode.selection);
      const ret = run(selectedCode.code);
      if (ret) console.log(`> ${ret}`); // eslint-disable-line no-console
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  },
  'Alt-Enter': (cm) => {
    try {
      const selectedCode = getSelectionCodeColumn(cm, true);
      flash(cm, selectedCode.selection);
      run(selectedCode.code);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  },
};

function createEditor() {
  const editor = CodeMirror(document.querySelector('#editor'), {
    mode: 'javascript',
    value: '// Welcome to the Solar Playground!\n// Love on the beat...',
    keyMap: 'playground',
    theme: 'monokai',
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
  });

  editor.on('drop', (data, e) => {
    const { files } = e.dataTransfer;
    if (files.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = () => {
      editor.setValue(reader.result);
    };
  });

  editor.setSize(null, 'calc(100vh - 50px)');

  const select = document.querySelector('select');

  editor.loadCodeExample = async (example) => {
    select.value = example;
    let contents = null;
    try {
      const response = await fetch(`/examples/${example}.js`, { method: 'get' });
      contents = await response.text();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Error Fetching example =>', e);
    }
    if (contents) {
      editor.setValue(contents);
    }
    return contents;
  };

  select.onchange = (e) => {
    editor.loadCodeExample(e.target.value);
  };

  return editor;
}

export default createEditor;
