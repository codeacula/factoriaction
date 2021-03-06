<template lang="pug">
.planner-canvas-wrapper.full-size
  BuildMenu(
    v-show='shouldShowBuildMenu',
    :class='{ "anim-fade-in": shouldShowBuildMenu }'
    @close='closeBuildMenu()'
    @buildable-selected='selectBuildable',
    :buildables='availableBuildables'
  )
  canvas.planner-canvas.full-size(ref='planner')
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

import BuildMenu from '@/components/BuildMenu.vue';

import buildables from '@/data/buildables.json';
import { PlanningBoardController } from '@/logic/PlanningBoardController';
import { Buildable } from '@/logic';

export default defineComponent({
  name: 'PlannerCanvas',
  components: { BuildMenu },
  setup() {
    const availableBuildables = buildables as Buildable[];
    const planner = ref<HTMLCanvasElement | null>(null);
    const planningBoard = ref<PlanningBoardController | null>(null);
    const shouldShowBuildMenu = ref(false);

    const closeBuildMenu = () => {
      shouldShowBuildMenu.value = false;
    };

    const getController = (): PlanningBoardController => {
      return planningBoard.value as PlanningBoardController;
    };

    const selectBuildable = (buildable: Buildable) => {
      shouldShowBuildMenu.value = false;
      getController().selectBuildable(buildable);
    };

    const showBuildMenu = (ev: KeyboardEvent) => {
      if (ev.key == 'q') {
        getController().cancelSelection();
        shouldShowBuildMenu.value = true;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', showBuildMenu);
      planningBoard.value = new PlanningBoardController(planner.value as HTMLCanvasElement);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', showBuildMenu);
    });

    return {
      availableBuildables,
      closeBuildMenu,
      selectBuildable,
      shouldShowBuildMenu,
      planner,
    };
  },
});
</script>

<style lang="scss" scoped>
.planner-canvas-wrapper {
  position: relative;
}
</style>
