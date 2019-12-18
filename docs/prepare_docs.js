const fs = require('fs');
const api = require('./api.json');

function cleanup(str) {
  return str
    .split('<Boolean>').join('&lt;Boolean&gt;')
    .split('<boolean>').join('&lt;boolean&gt;')
    .split('<Number>').join('&lt;Number&gt;')
    .split('<number>').join('&lt;number&gt;')
    .split('<Stream>').join('&lt;Stream&gt;')
    .split('<<Vector(3)>>').join('&lt;<Vector(3)>&gt;')
    .split('<Function>').join('&lt;Function&gt;')
    .split('<string>').join('&lt;string&gt;')
    .split('<String>').join('&lt;String&gt;');
}

function formatType(t) {
  if (t) {
    if (t.type === 'NameExpression') {
      return t.name;
    }
    if (t.type === 'OptionalType') {
      return t.expression.name;
    }
    if (t.type === 'TypeApplication') {
      return `${formatType(t.expression)}<${t.applications.map(formatType)}>`;
    }
    if (t.type === 'AllLiteral') {
      return '*';
    }
    if (t.type === 'UnionType') {
      return t.elements.map(formatType)
        .reduce((x, y) => `${x}|${y}`, '')
        .slice(1);
    }
    return t;
  }
  return '';
}

function signature(entry, includeName = true) {
  const params = entry.params
    .map(x => `${x.name}: ${x.type && formatType(x.type)}`)
    .join(', ');
  const ret = entry.returns && entry.returns.length
    && entry.returns[0].type
    && `: ${entry.returns[0].type.name}`;
  return `${includeName ? entry.name : ''}(${params})${ret}`;
}

function toText(x, inline = false) {
  // console.log('x', x);
  if (Array.isArray(x)) return x.reduce((acc, y) => `${acc}${toText(y, inline)}`, '');
  if (x.type === 'text') return cleanup(x.value.split('\n').join('<br>'));
  if (x.type === 'code') {
    return inline
      ? `\`${x.value}\``
      : `\`\`\`\n${x.value}\n\`\`\``;
  }
  if (x.type === 'inlineCode') return `\`${x.value}\``;
  if (x.type === 'html') return cleanup(`${x.value}`);
  if (x.type === 'link') {
    return `<a
      href="${x.jsdoc ? `/ api / ${x.url}` : x.url}"
      target="${x.jsdoc ? '' : '_blank'}"
    >
      ${x.children[0].value}
    </a>`;
  }
  if (x.type === 'paragraph') {
    return x.children.reduce((acc, y) => `${acc}${toText(y, inline)}`, '');
  }
  if (x.type === 'list') {
    return inline
      ? x.children.reduce((acc, y) => `${acc}- ${toText(y, inline)}<br>`, '<br>')
      : x.children.reduce((acc, y) => `${acc}- ${toText(y, inline)}\n`, '\n');
  }
  if (x.type === 'listItem') return cleanup(toText(x.children, inline));
  return `WHAT ?????? ${JSON.stringify(x)}`;
}

let packageName = null;
let mdContent = '';
api.forEach((entry, i) => {
  if (entry.kind === 'note') {
    if (packageName) {
      const fileName = (packageName === '@coda/core')
        ? './api/README.md'
        : `./api/${packageName.toLowerCase().split('/').join('-').split('@').join('')}.md`;
      console.log('packageName', packageName, packageName === '@coda/core', fileName);
      fs.writeFileSync(fileName, mdContent);
      // fs.writeFileSync(fileName, cleanup(mdContent));
    }
    packageName = entry.name;
    mdContent = `# ${entry.name}\n\n`;
    return;
  }
  mdContent += `## ${entry.name}\n\n`;
  mdContent += `\`\`\`ts\n ${signature(entry)}\n\`\`\`\n\n`;
  mdContent += `${toText(entry.description.children)}\n\n`;
  entry.tags.filter(x => x.title === 'warning').forEach((x) => {
    mdContent += `::: warning\n${x.description}\n:::\n\n`;
  });
  entry.tags.filter(x => x.title === 'see').forEach((x) => {
    mdContent += `::: tip see\n${x.description}\n:::\n\n`;
  });
  entry.tags.filter(x => x.title === 'todo').forEach((x) => {
    mdContent += `::: tip TODO\n${x.description}\n:::\n\n`;
  });
  const params = [];
  entry.params.forEach((param) => {
    params.push(param);
    if (param.properties) {
      param.properties.forEach((prop) => {
        params.push(prop);
      });
    }
  });
  mdContent += '|Parameter|Type|Default|Description|\n';
  mdContent += '|---|---|---|---|\n';
  params.forEach((param) => {
    mdContent += `|${param.name}|${cleanup(formatType(param.type))}|${param.default !== undefined ? param.default : ''}|${toText(param.description ? param.description.children : '', true)}|\n`;
  });
  if (entry.returns.length > 0) {
    mdContent += '**Returns** ';
    mdContent += `\`${entry.returns[0].type && entry.returns[0].type.name}\` `;
    mdContent += `${toText(entry.returns[0].description.children)}\n\n`;
  }
  entry.examples.forEach((example) => {
    mdContent += '**Example**\n';
    // if (example.caption && example.caption.children) {
    //   mdContent += ` ${toText(example.caption ? example.caption.children : '')}`;
    // }
    mdContent += `\n\n<CodeExample name="${entry.name}">\n\n\`\`\`js\n${example.description}\n\`\`\`\n\n</CodeExample>\n\n`;
  });
  // TODO:  hasOwn Properties
  // mdContent += `${}\n\n`;
  mdContent += '\n';
});

const fileName = (packageName === '@coda/core')
  ? './api/README.md'
  : `./api/${packageName.toLowerCase().split('/').join('-').split('@').join('')}.md`;
console.log('packageName', packageName, packageName === '@coda/core', fileName);
fs.writeFileSync(fileName, mdContent);

/* <h4 v-if="hasOwnProperties || hasParentProperties">Properties</h4>
      <div
        class="properties"
        v-if="hasOwnProperties || hasParentProperties"
      >
        <ul class="classProperties">
          <li
            v-for="(m, cpidx) in entry.properties"
            :key="`class-prop-${cpidx}`"
          >
            <code>.{{m.name}}: {{formatType(m.type)}}</code> <api-paragraph
              v-for="(par, l) in m.description.children"
              :key="`api-entry-ret-par-${l}`"
              :data="par"
            ></api-paragraph>
          </li>
        </ul>
        <div
          v-if="hasParentProperties"
        >
          <div
            v-for="(parent, pidx) in parents.filter(x => x.properties.length)"
            :key="`class-parent-${pidx}`"
          >
            <i>Inherited from {{parent.name}}:</i>
            <ul class="classProperties">
              <li
                v-for="(m, cpidx) in parent.properties
                  .filter(m => !entry.properties.map(x => x.name).includes(m.name))"
                :key="`class-prop-${cpidx}`"
              >
              <code>.{{m.name}}: {{formatType(m.type)}}</code> <api-paragraph
                v-for="(par, l) in m.description.children"
                :key="`api-entry-ret-par-${l}`"
                :data="par"
              ></api-paragraph>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <h4 v-if="hasOwnMembers || hasParentMembers">Methods</h4>
      <div
        class="methods"
        v-if="hasOwnMembers || hasParentMembers"
      >
        <ul class="classMethod">
          <li
            v-for="(m, cmidx) in entry.members.instance"
            :key="`class-method-id-${cmidx}`"
          >
            .{{signature(m)}}
          </li>
        </ul>
        <div v-if="hasParentMembers">
          <div
            v-for="(parent, paridx) in parents.filter(x => x.members.instance.length)"
            :key="`parent-idx-${paridx}`"
          >
            <i>Inherited from {{parent.name}}:</i>
            <ul class="classMethod">
              <li
                v-for="(m, pardidx) in parent.members.instance
                  .filter(m => !entry.members.instance.map(x => x.name).includes(m.name))"
                :key="`parent-idx-${pardidx}`"
              >
                <code style="font-weight: normal;">.{{signature(m)}}</code> <api-paragraph
                v-for="(par, l) in m.description.children"
                :key="`api-entry-ret-par-${l}`"
                :data="par"
                ></api-paragraph>
              </li>
            </ul>
          </div>
        </div>
      </div> */
