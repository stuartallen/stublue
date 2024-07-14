<template>
  <div className="w-screen h-screen">
    <h1 className="w-full text-2xl p-4 bg-blue-300 text-white italic">
      StuBlue
    </h1>
    <SLSelector
      :saturation="saturation"
      :luminance="luminance"
      :changeSaturation="changeSaturation"
      :changeLuminance="changeLuminance"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SLSelector from "@/components/SLSelector.vue";

const sanitizePercentage = (value: number) => {
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return value;
};

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      saturation: 50,
      luminance: 50,
    };
  },
  methods: {
    changeSaturation(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.saturation = parseFloat(event.target.value);
      }
    },
    changeLuminance(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.luminance = parseFloat(event.target.value);
      }
    },
  },
  components: {
    SLSelector,
  },
});
</script>
