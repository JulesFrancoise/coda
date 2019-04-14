<template>
  <div>
    <api-entry
      :id="entry.name"
      :entry="entry"
      :allEntries="api"
    ></api-entry>
  </div>
</template>

<script>
import ApiEntry from '../../components/ApiEntry';
import api from '../api.json';

const filteredApi = api.filter(entry => entry.kind !== 'note');

export default {
  components: { ApiEntry },
  validate({ params }) {
    const entryName = params.entry || filteredApi[0].name;
    return filteredApi.map(x => x.name).includes(entryName);
  },
  async asyncData({ params }) {
    const entryName = params.entry || filteredApi[0].name;
    const entries = filteredApi.filter(x => x.name === entryName);
    return {
      api: filteredApi,
      entry: entries[0],
    };
  },
};
</script>

<style scoped>
</style>
