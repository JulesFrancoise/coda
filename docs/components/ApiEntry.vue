<template>
  <div class="api_entry">
    <h2 class="name">
      # {{entry.name}} <span style="color: #9f9f9f;">{{signature(entry, false)}}</span>
    </h2>
    <div class="api_entry_container">
      <api-paragraph
        v-for="(d, k) in entry.description.children"
        :key="`api-entry-desc-${k}`"
        :data="d"
      ></api-paragraph>
      <el-alert
        class="alert"
        v-for="(w, k) in entry.tags.filter(x => x.title === 'warning')"
        :key="`api-entry-warn-${k}`"
        title="Warning"
        type="warning"
        :description="w.description"
        show-icon>
      </el-alert>
      <el-alert
        class="alert"
        v-for="(w, k) in entry.tags.filter(x => x.title === 'see')"
        :key="`api-entry-see-${k}`"
        title="See also"
        type="success"
        :description="w.description"
        v-linkified
        show-icon>
      </el-alert>
      <el-alert
        class="alert"
        v-for="(w, k) in entry.tags.filter(x => x.title === 'todo')"
        :key="`api-entry-todo-${k}`"
        title="TODO"
        type="info"
        :description="w.description"
        show-icon>
      </el-alert>
      <!-- <div class="signature">{{signature(entry)}}</div> -->
      <h4>Parameters</h4>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(param, k) in params"
            :key="`api-entry-param-${k}`"
          >
            <td>{{param.name}}</td>
            <td>{{formatType(param.type)}}</td>
            <td>{{param.default}}</td>
            <td v-if="!!param.description">
              <api-paragraph
                v-for="(par, l) in param.description.children"
                :key="`api-entry-param-par-${k}-${l}`"
                :data="par"
              ></api-paragraph>
            </td>
          </tr>
        </tbody>
      </table>
      <h4 v-if="entry.returns.length">Returns</h4>
      <div
        class="returns"
        v-if="entry.returns.length"
      >
        <code style='margin-left: 10px;'>
          {{entry.returns[0].type && entry.returns[0].type.name}}
        </code>
        <span v-if="!!entry.returns[0].description">
          <api-paragraph
            v-for="(par, l) in entry.returns[0].description.children"
            :key="`api-entry-ret-par-${l}`"
            :data="par"
          ></api-paragraph>
        </span>
      </div>
      <h4 v-if="hasOwnProperties || hasParentProperties">Properties</h4>
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
      </div>
      <h4>Examples</h4>
      <div
        class="example"
        v-for="(example, k) in entry.examples"
        :key="`api-entry-example-${k}`"
      >
        <div v-if="!!example.caption">
          <api-paragraph
            v-for="(par, l) in example.caption.children"
            :key="`api-entry-param-par-${k}-${l}`"
            :data="par"
          ></api-paragraph>
        </div>
        <code-example
          :code="example.description"
          :name="`${entry.name}-ex-${k}`"
        ></code-example>
      </div>
      <!-- TODO: Context in File -->
      <!-- {{entry.context}}<br> -->
    </div>
  </div>
</template>

<script>
import ApiParagraph from './ApiParagraph';
import CodeExample from './CodeExample';

export default {
  name: 'api-entry',
  components: { ApiParagraph, CodeExample },
  props: {
    entry: Object,
    allEntries: Array,
  },
  computed: {
    params() {
      const p = [];
      this.entry.params.forEach((param) => {
        p.push(param);
        if (param.properties) {
          param.properties.forEach((prop) => {
            p.push(prop);
          });
        }
      });
      return p;
    },
    parents() {
      return this.entry.augments.map(x => this.findEntry(x.name));
    },
    hasOwnMembers() {
      return (this.entry.members.instance.length > 0);
    },
    hasParentMembers() {
      return this.parents.reduce((b, parent) => b || (parent.members.instance.length > 0), false);
    },
    hasOwnProperties() {
      return (this.entry.properties.length > 0);
    },
    hasParentProperties() {
      return this.parents.reduce((b, parent) => b || (parent.properties.length > 0), false);
    },
  },
  methods: {
    signature(entry, includeName = true) {
      const params = entry.params
        .map(x => `${x.name}: ${x.type && this.formatType(x.type)}`)
        .join(', ');
      const ret = entry.returns && entry.returns.length
        && entry.returns[0].type
        && `: ${entry.returns[0].type.name}`;
      return `${includeName ? entry.name : ''}(${params})${ret}`;
    },
    formatType(t) {
      if (t) {
        if (t.type === 'NameExpression') {
          return t.name;
        }
        if (t.type === 'OptionalType') {
          return t.expression.name;
        }
        if (t.type === 'TypeApplication') {
          return `${this.formatType(t.expression)}<${t.applications.map(this.formatType)}>`;
        }
        if (t.type === 'AllLiteral') {
          return '*';
        }
        if (t.type === 'UnionType') {
          return t.elements.map(this.formatType)
            .reduce((x, y) => `${x}|${y}`, '')
            .slice(1);
        }
        return t;
      }
      return '';
    },
    findEntry(name) {
      return this.allEntries.find(x => x.name === name);
    },
  },
};
</script>

<style scoped>
.api_entry {
  margin-bottom: 8px;
  background: #fff;
  padding-left: 15px;
  padding-top: 2px;
}
.api_entry_container {
  margin-left: 16px;
}
h2.name {
  color: #0f5595;
  margin-bottom: 16px;
  /* font-size: 18px; */
}
h4 {
  font-size: 1.1em;
  color: #878787;
  margin-top: 16px;
}
.signature {
  font-family: Source Code Pro, monospace;
  background: #f5f5f5;
  margin-top: 8px;
  margin-bottom: 4px;
  padding: 10px;
  color: #5c5c5c;
}
ul.classMethod, ul.classProperties {
  margin-left: 0;
  list-style: none;
}

.alert {
  width: calc(100% - 40px);
  margin: 10px auto;
}
</style>
