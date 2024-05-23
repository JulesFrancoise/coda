<template>
  <div id="header">
    <div class="menu">
      <h1 style="font-family: monospace; font-size: 12px;">coda.playground }-{o</h1>
      <span></span>
      <select v-model="selected">
        <optgroup
          v-for="proj in projects"
          :key="`optgroup-${proj}`"
          :label="proj"
        >
          <option
            v-for="example in projectExamples[proj]"
            :key="`projectEx-${proj}-${example}`"
          >{{example}}</option>
        </optgroup>
      </select>
    </div>
    <div id="streams"></div>
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  data() {
    const defaultExample = 'basic';
    const projects = process.env.VUE_APP_PROJECTS.split(':');
    const projectExamples = projects
      .map(proj => ({
        [proj]: process.env[`VUE_APP_EXAMPLES_${proj.toUpperCase()}`].split(':'),
      }))
      .reduce((a, b) => ({ ...a, ...b }), {});
    return {
      selected: defaultExample,
      projects,
      projectExamples,
    };
  },
  watch: {
    selected(filename) {
      this.$emit('load', filename);
    },
  },
  methods: {
    runScript() {
      this.$emit('run');
    },
  },
};
</script>

<style>
#header {
  width: 100%;
  height: 32px;
  margin: 0;
  background: #000620;
  color: #3c4972;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: stretch;
  border-bottom: 1px solid #3c4972;
}

#header .menu {
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#header .menu h1 {
  margin: 0;
  padding: 10px;
  font-size: 14px;
  font-weight: 400;
}

#header .menu span {
  margin-left: 10px;
  margin-right: 6px;
}

#streams {
  margin-left: 10px;
  margin-right: 10px;
  flex-grow: 1;
  text-align: right;
  display: flex;
  flex-direction: row;
  padding: 8px;
  justify-content: flex-end;
  font-family: monospace;
}

#streams .stream {
  padding-bottom: 5px;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: 6px;
  height: 10px;
  border: 1px solid #3c4972;
  color: #3c4972;
  border-radius: 10px;
}

select {
  display: block;
  padding: 2px;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  border-radius: .5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: #0C1021;
  border-color: #3c4972;
  color: #3c4972;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233c4972%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
  appearance: none;
}
select::-ms-expand {
  display: none;
}
select:hover {
  border-color: #6272a4;
}
select:focus {
  border-color: #6272a4;
  color: #6272a4;
  outline: none;
}
select option {
  font-weight:normal;
}
</style>
