<template lang="pug">
.buildable-item-button(@click='$emit("click")')
  //@TODO temporary. remove when we have icons for buildables
  img(src='/img/icons/surprise_pikachu.png')
  span.button-text {{ item.name }}
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { PropType } from 'vue';

import { Buildable } from '@/logic';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<Buildable>,
      required: true,
    },
  },
  setup() {
    console.log('buildableitembutton setup');
  },
});
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.buildable-item-button {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-width: 8rem;
  padding: 1rem;
  cursor: pointer;
  &:hover {
    background-color: $dark-4;
  }
}

.button-text {
  margin-top: 0.1rem;
  width: 10rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
