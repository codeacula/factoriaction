<template lang="pug">
.planner-canvas-wrapper.full-size
  BuildMenu(
    v-show="shouldShowBuildMenu",
    @close="closeBuildMenu()",
    @buildable-selected="selectBuildable"
  )
  canvas.planner-canvas.full-size(ref="planner")
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import BuildMenu from "@/components/BuildMenu.vue";
import { PlanningBoard } from "@/logic/PlanningBoard";
import { Buildable } from "@/logic";

export default defineComponent({
  name: "PlannerCanvas",
  components: { BuildMenu },
  setup() {
    const planner = ref<HTMLCanvasElement | null>(null);
    const planningBoard = ref<PlanningBoard | null>(null);
    const shouldShowBuildMenu = ref(false);

    const closeBuildMenu = () => {
      shouldShowBuildMenu.value = false;
    };

    const selectBuildable = (buildable: Buildable) => {
      console.log(buildable);
      shouldShowBuildMenu.value = false;
    };

    const showBuildMenu = (ev: KeyboardEvent) => {
      if (ev.key == "q") {
        shouldShowBuildMenu.value = true;
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", showBuildMenu);
      if (planner.value) {
        planningBoard.value = new PlanningBoard(
          planner.value as HTMLCanvasElement
        );
      }
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", showBuildMenu);
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
