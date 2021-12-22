<template lang="pug">
.help-menu(@click='$emit("close")')
  .help-menu-content
    h1 Factoriaction Help
    p
      small Click anywhere to close
    table
      tr
        th Command
        th Action
      tr
        td Q
        td Open the build menu
      tr
        td H
        td Center planning board at home location
      tr
        td ESC
        td Cancel whatever you're doing
      tr
        td Left Click Item
        td Options Menu
      tr
        td Right Click + Drag
        td Move planning board
      tr
        td Scroll Wheel
        td Zoom In/Out
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  emits: ['close'],
});
</script>

<style lang="scss">
@import '@/sass/main.scss';

.help-menu {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;

  .help-menu-content {
    background-color: #1d2433;
    padding: 2rem;
    width: 40rem;

    h1 {
      text-align: center;
    }

    p {
      color: $yellow;
      text-align: center;
    }

    table {
      margin-top: 2rem;
      width: 100%;

      th {
        color: $purple;
        text-align: left;
      }

      td {
        border-bottom: 1px solid $dark-6;
      }
    }
  }
}
</style>
