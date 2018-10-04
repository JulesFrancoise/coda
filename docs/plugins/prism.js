import Vue from 'vue';
import Prism from 'prismjs';

Vue.prototype.$highlight = code => Prism.highlight(code, Prism.languages.javascript, 'javascript');
