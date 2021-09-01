<template lang="pug">
.planner-canvas-wrapper.full-size
  BuildMenu(v-show="shouldShowBuildMenu")
  canvas.planner-canvas.full-size(ref="planner")
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

import BuildMenu from "@/components/BuildMenu.vue";
import { PlanningBoard } from "@/logic/PlanningBoard";

export default defineComponent({
  name: "PlannerCanvas",
  components: { BuildMenu },
  setup() {
    const planner = ref<HTMLCanvasElement | null>(null);
    const planningBoard = ref<PlanningBoard | null>(null);

    onMounted(() => {
      window.addEventListener("keydown", showBuildMenu);
      if (planner.value) {
        planningBoard.value = new PlanningBoard(
          planner.value as HTMLCanvasElement
        );
      }
    });

    const shouldShowBuildMenu = ref(false);
    const showBuildMenu = (ev: KeyboardEvent) => {
      if (ev.key == "q") {
        console.log("Show build menu");
        shouldShowBuildMenu.value = true;
      }
    };

    onUnmounted(() => {
      window.removeEventListener("keydown", showBuildMenu);
    });

    return {
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
