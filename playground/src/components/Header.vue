<template>
  <div id="header">
    <div class="menu">
      <h1>CO/DA</h1>
      <span>demos:</span>
      <select v-model=selected>
        <optgroup label="user examples">
          <option
            v-for="example in userExamples"
            :key="`userEx-${example}`"
          >{{example}}</option>
        </optgroup>
        <optgroup label="default examples">
          <option
            v-for="example in defaultExamples"
            :key="`defEx-${example}`"
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
    this.$emit('load', defaultExample);
    return {
      selected: defaultExample,
      userExamples: process.env.VUE_APP_USER_EXAMPLES.split(':'),
      defaultExamples: process.env.VUE_APP_DEFAULT_EXAMPLES.split(':'),
    };
  },
  watch: {
    selected(filename) {
      this.$emit('load', filename);
    },
  },
};
</script>

<style>
#header {
  width: 100%;
  height: 32px;
  margin: 0;
  background: #1a1b16;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: stretch;
  border-bottom: 1px solid #8f8f8f;
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
}

#streams .stream {
  padding-top: 2px;
  padding-bottom: 5px;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: 6px;
  height: 10px;
  border: 1px solid #258ccf;
  color: #258ccf;
  border-radius: 10px;
}
</style>
