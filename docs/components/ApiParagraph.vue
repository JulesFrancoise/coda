<template>
  <span class="paragraph">
    <span v-if="data.type === 'paragraph'">
      <span
        v-for="(paragraph, i) in data.children"
        :key="`par-${i}`"
      >
        <span v-if="paragraph.type === 'text'">
          {{paragraph.value}}
        </span>
        <span v-else-if="paragraph.type === 'code'">
          <pre>{{paragraph.value}}</pre>
        </span>
        <span v-else-if="paragraph.type === 'link'">
          <a
            :href="paragraph.jsdoc ? `/api/${paragraph.url}` : paragraph.url"
            :target="paragraph.jsdoc ? '' : '_blank'"
          >
            {{paragraph.children[0].value}}
          </a>
        </span>
        <span v-else-if="paragraph.type === 'inlineCode'">
          <code>{{paragraph.value}}</code>
        </span>
        <span v-else-if="paragraph.type === 'html'" v-html="paragraph.value">
        </span>
        <span v-else>
          WHAAAAAATTTTTT???
          {{paragraph}}
        </span>
      </span>
    </span>
    <span
      v-if="data.type === 'code'"
    >
      <pre>{{data.value}}</pre>
    </span>
    <ul v-if="data.type === 'list'">
      <li
        v-for="(item, i) in data.children"
        :key="`list-${i}`"
      >
        <api-paragraph
          v-for="(child, j) in item.children"
          :key="`list-item-${i}-${j}`"
          :data="child"
        ></api-paragraph>
      </li>
    </ul>
    <br>
  </span>
</template>

<script>
export default {
  name: 'api-paragraph',
  props: {
    data: Object,
  },
};
</script>
