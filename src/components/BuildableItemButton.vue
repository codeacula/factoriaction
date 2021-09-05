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
  background-color: rgba($dark-4, 0);
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: 8rem;
  overflow-y: auto;
  padding: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba($dark-4, 100);
  }
}

.button-text {
  margin-top: 0.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  width: 100%;
}
</style>
