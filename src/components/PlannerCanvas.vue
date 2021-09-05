<template lang="pug">
.planner-canvas-wrapper.full-size
  BuildMenu(v-show='shouldShowBuildMenu' @close='closeBuildMenu()' @buildable-selected='selectBuildable')
  canvas.planner-canvas.full-size(ref='planner')
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

import BuildMenu from '@/components/BuildMenu.vue';
import { PlanningBoardController } from '@/logic/PlanningBoardController';
import { Buildable } from '@/logic';

export default defineComponent({
  name: 'PlannerCanvas',
  components: { BuildMenu },
  setup() {
    const planner = ref<HTMLCanvasElement | null>(null);
    const planningBoard = ref<PlanningBoardController | null>(null);
    const shouldShowBuildMenu = ref(false);

    const closeBuildMenu = () => {
      shouldShowBuildMenu.value = false;
    };

    const selectBuildable = (buildable: Buildable) => {
      shouldShowBuildMenu.value = false;
      planningBoard.value?.selectBuildable(buildable);
    };

    const showBuildMenu = (ev: KeyboardEvent) => {
      if (ev.key == 'q') {
        planningBoard.value?.cancelSelection();
        shouldShowBuildMenu.value = true;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', showBuildMenu);
      if (planner.value) {
        planningBoard.value = new PlanningBoardController(planner.value as HTMLCanvasElement);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', showBuildMenu);
    });

    return {
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
