<template lang="pug">
.app-wrapper.full-size
  nav.navigation
    router-link(:to="{ name: 'Home' }") Home
    router-link(:to="{ name: 'About' }") About
  router-view.main-content
</template>

<style lang="scss">
@import "./sass/main.scss";

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
