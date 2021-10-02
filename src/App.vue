<template lang="pug">
.app-wrapper.full-size
  nav.navigation
    router-link(:to='{ name: "Home" }') Home
    router-link(:to='{ name: "About" }') About
    a.show-build-menu(href='#' @click='showBuildMenu()') Build (Q)
    a.show-help-menu(href='#' @click='showHelpMenu()') Help
  router-view.main-content
  HelpMenu(v-show='shouldShowHelpMenu' @close='closeHelpMenu()')
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import HelpMenu from '@/components/HelpMenu.vue';

export default defineComponent({
  name: 'App',
  components: { HelpMenu },
  setup() {
    const shouldShowHelpMenu = ref(false);

    const closeHelpMenu = () => {
      shouldShowHelpMenu.value = false;
    };

    const showBuildMenu = () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    };

    const showHelpMenu = () => {
      shouldShowHelpMenu.value = true;
    };

    return {
      closeHelpMenu,
      showBuildMenu,
      showHelpMenu,
      shouldShowHelpMenu,
    };
  },
});
</script>

<style lang="scss">
@import '@/sass/main.scss';

.app-wrapper {
  display: grid;
  grid-template-columns: [site-start] auto [site-end];
  grid-template-rows: [row-start navigation-start] 1.5rem [navigation-end content-start] auto [content-end row-end];

  & > .main-content {
    grid-column: site-start / site-end;
    grid-row: content-start / content-end;
  }

  & > .navigation {
    grid-column: site-start / site-end;
    grid-row: navigation-start / navigation-end;
  }
}

.navigation {
  background-color: $dark-3;
  border-bottom: solid 1px $dark-6;

  a {
    display: inline-block;
    height: calc(1.5rem - 1px);
    padding: 0 1rem;
    text-decoration: none;
    transition: all 0.1s ease-in;

    &:hover {
      background-color: $dark-2;
      color: $gold;
    }
  }
}
</style>
