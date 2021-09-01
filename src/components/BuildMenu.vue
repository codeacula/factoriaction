<template lang="pug">
.build-menu
  .build-menu-wrapper
    header
      .build-menu-icon
      div Builder
      .close-button
    main
      nav.builder-nav
        ul
          li Special
          li Production
          li Power
          li Logistics
          li Organization
          li Foundations
          li Walls
          li Transportation
      .builder-content
        .search-box
          input(placeholder="Search for building...")
        .item-list
</template>

<script lang="ts">
import { Buildable } from "@/logic";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "BuildMenu",
  emits: {
    "buildable-selected": (buildable: Buildable) => buildable,
  },
});
</script>

<style lang="scss">
.build-menu {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
}
</style>
