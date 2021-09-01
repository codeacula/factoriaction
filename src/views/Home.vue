<template lang="pug">
.home.full-size
  PlannerCanvas
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import PlannerCanvas from "@/components/PlannerCanvas.vue";

export default defineComponent({
  name: "Home",
  components: {
    PlannerCanvas,
  },
  setup() {
    const shouldShowBuildMenu = ref(false);
    const showBuildMenu = () => {
      shouldShowBuildMenu.value = true;
    };

    onMounted(() => {
      window.addEventListener("keydown", showBuildMenu);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", showBuildMenu);
    });

    return {
      shouldShowBuildMenu,
    };
  },
});
</script>

<style lang="scss"></style>
