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

@keyframes backgroundFadeIn {
  from {
    background-color: rgba($dark-4, 0);
  }
  to {
    background-color: rgba($dark-4, 100);
  }
}

.buildable-item-button {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-width: 8rem;
  padding: 1rem;
  border-radius: 5px;

  &:hover {
    animation: backgroundFadeIn 0.2s linear forwards;
  }
}

.button-text {
  overflow: hidden;
  margin-top: 0.1rem;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  width: 100%;
}
</style>
