<template lang="pug">
.planner-canvas-wrapper.full-size
  canvas.planner-canvas.full-size(ref="planner")
</template>

<script lang="ts">
import { PlanningBoard } from "@/logic/PlanningBoard";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "PlannerCanvas",
  components: {},
  setup() {
    const planner = ref<HTMLCanvasElement | null>(null);
    const planningBoard = ref<PlanningBoard | null>(null);

    onMounted(() => {
      if (planner.value) {
        planningBoard.value = new PlanningBoard(
          planner.value as HTMLCanvasElement
        );
      }
    });

    return {
      planner,
    };
  },
});
</script>

<style lang="scss" scoped></style>
