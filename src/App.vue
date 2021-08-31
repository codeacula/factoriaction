<template lang="pug">
.app-wrapper
  nav.navigation
    router-link(:to="{ name: 'Home' }") Home
    router-link(:to="{ name: 'About' }") About
  router-view.main-content
</template>

<style lang="scss">
@import "./sass/main.scss";

.app-wrapper {
  display: grid;
  grid-template-rows: [row-start navigation-start] 1.5rem [navigation-end content-start] auto [content-end row-end];
  height: 100%;
  width: 100%;

  & > .main-content {
    display: flex;
    height: 100%;
    grid-row: content-start / content-end;
    width: 100%;
  }

  & > .navigation {
    grid-row: navigation-start / navigation-end;
    height: 100%;
    width: 100%;
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
