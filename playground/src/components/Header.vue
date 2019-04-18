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
      <!-- <button type="button" name="run" @click="runScript">run</button> -->
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
  background-color: #0C1021;
  border-color: #3c4972;
  color: #3c4972;
}
</style>
