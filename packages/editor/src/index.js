import { initializeSandbox } from './js/sandbox';
import createEditor from './js/editor';

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const setupSplit = () => {
  const splitDiv = document.querySelector('#splitbar');
  const le = document.querySelector('#left');
  const ui = document.querySelector('#ui');

  const mousemove = (evt) => {
    const splitPos = evt.clientX;

    le.style.width = `${splitPos}px`;
    ui.style.left = `${splitPos}px`;
    ui.style.width = `${window.innerWidth - splitPos}px`;
  };

  const mouseup = () => {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  };

  splitDiv.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  });
};

ready(() => {
  // window.onbeforeunload = () => 'Get out of the solar system?';
  const sandbox = initializeSandbox(document, console);
  console.log('ready');
  const solar = {
    sandbox,
    editor: createEditor(),
  };
  solar.editor.loadCodeExample('basic');
  setupSplit();
});
