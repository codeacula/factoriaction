<template lang="pug">
.build-menu(@click.self='$emit("close")')
  .build-menu-wrapper
    header.build-menu-header
      .build-menu-icon
      .header-text Builder
      .close-button(@click='$emit("close")') X
    main.builder-box
      nav.builder-nav
        ul.builder-tab-list
          li.builder-tab(
            v-for='tab in Tabs',
            :class='{ active: currentTab == tab }'
            @click='makeActive(tab)',
            :data-tabtype='tab'
          ) {{ tab.toString() }}
      .builder-content
        .search-box
        .item-list-wrapper
          .item-group(v-for='group in groups')
            h3.item-group-header {{ group }}
            ul.item-list
              BuildableItemButton.item(
                v-for='item in getItemsByGroup(group)',
                :data-itemname='item.name',
                :item='item'
                @click='selectBuildable(item)'
              )
</template>

<script lang="ts">
import { Buildable } from '@/logic';
import { computed, defineComponent } from '@vue/runtime-core';
import { PropType, ref } from 'vue';

import BuildableItemButton from '@/components/BuildableItemButton.vue';
import { Tabs } from './Tabs';

export default defineComponent({
  name: 'BuildMenu',
  components: { BuildableItemButton },
  emits: {
    'buildable-selected': (buildable: Buildable) => buildable,
    close: () => true,
  },
  props: {
    buildables: {
      type: Object as PropType<Buildable[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const currentTab = ref(Tabs.special);

    const getItemsByGroup = (groupName: string): Buildable[] => {
      return props.buildables
        .filter((x) => x.tab == currentTab.value.toString() && x.groupName == groupName)
        .sort((a, b) => {
          if (a.displayOrder == b.displayOrder) {
            throw new Error('Two buildables have the same displayOrder');
          }

          return (a.displayOrder as number) < (b.displayOrder as number) ? -1 : 1;
        });
    };

    const groups = computed(() => {
      return Array.from(
        new Set(
          props.buildables
            .filter((x) => x.tab == currentTab.value && x.displayOrder != null && x.groupName != null)
            .map((x) => x.groupName as string)
            .sort()
        )
      );
    });

    const makeActive = (category: Tabs): void => {
      currentTab.value = category;
    };

    const selectBuildable = (buildable: Buildable): void => {
      emit('buildable-selected', buildable);
    };

    return { currentTab, groups, getItemsByGroup, makeActive, selectBuildable, Tabs };
  },
});
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

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

.build-menu-wrapper {
  background-color: $dark-2;
  display: flex;
  flex-direction: column;
  height: 90%;
  overflow: hidden;
  position: absolute;
  right: 5%;
  width: 25%;
}

.build-menu-header {
  align-items: center;
  border-bottom: 1px solid $dark-7;
  display: flex;
  flex-direction: row;
  height: 2rem;
}

.header-text {
  flex-grow: 1;
  padding-left: 2rem;
}

.close-button {
  background: $dark-6;
  color: $dark-1;
  cursor: pointer;
  padding: 0.25rem 2rem;
}

.builder-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: auto;
}

.builder-tab-list {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 10rem;
}

.builder-content {
  flex-grow: 1;
  height: 100%;
  overflow-y: scroll;
}

.builder-nav {
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
  width: 10rem;
}

.builder-tab {
  align-items: center;
  background-color: $dark-3;
  cursor: pointer;
  display: flex;
  height: 100%;
  margin: 1px;
  list-style: none;
  justify-content: center;
  vertical-align: middle;
  width: 100%;

  &:hover {
    background: $dark-4;
  }
}

.item-list-wrapper {
  display: block;
  overflow-y: auto;
}

.item-group-header {
  background-color: $dark-1;
  color: $dark-7;
  font-weight: normal;
  padding-left: 1rem;
}

.item-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style-type: none;
  margin: 0;
  padding: 1rem;
}
.item {
  width: 25%;
}
</style>
