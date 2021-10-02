<template lang="pug">
.home.full-size
  PlannerCanvas
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlannerCanvas from '@/components/PlannerCanvas.vue';

export default defineComponent({
  name: 'Home',
  components: {
    PlannerCanvas,
  },
});
</script>

<style lang="scss"></style>
