<template>
  <div className="w-screen h-screen flex flex-col overflow-hidden">
    <h1 className="w-full text-2xl p-4 bg-blue-300 text-white italic">
      StuBlue
    </h1>
    <SLSelector
      :saturation="saturation"
      :luminance="luminance"
      :isLoading="isLoading"
      :changeSaturation="changeSaturation"
      :changeLuminance="changeLuminance"
      :getColors="getColors"
    />
    <ColorGallery
      :saturation="displayedSaturation"
      :luminance="displayedLuminance"
      :isLoading="isLoading"
      :hasError="hasError"
      :colors="colors"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SLSelector from "@/components/SLSelector.vue";
import ColorGallery from "@/components/ColorGallery.vue";
import getColorsBySL from "@/utils/colors";
import type { ColorCacheEntry } from "@/utils/colors";

export default defineComponent({
  name: "HomeView",
  mounted() {
    document.title = "StuBlue";
    this.getColors();
  },
  data(): {
    saturation: number;
    luminance: number;
    displayedSaturation: number;
    displayedLuminance: number;
    colors: ColorCacheEntry[];
    isLoading: boolean;
    hasError: boolean;
  } {
    return {
      //  The saturation and luminence for new requests
      saturation: 50,
      luminance: 50,
      //  The saturation and luminence currently displayed in the gallery
      displayedSaturation: 50,
      displayedLuminance: 50,
      colors: [],
      isLoading: false,
      hasError: false,
    };
  },
  methods: {
    changeSaturation(newVal: number) {
      this.saturation = newVal;
    },
    changeLuminance(newVal: number) {
      this.luminance = newVal;
    },
    getColors() {
      this.isLoading = true;
      this.hasError = false;
      getColorsBySL(this.saturation, this.luminance)
        .then((result) => {
          this.isLoading = false;
          this.displayedSaturation = this.saturation;
          this.displayedLuminance = this.luminance;
          //  TODO: getColorsBySL should return an array of colors
          this.colors = [
            result,
            result,
            result,
            result,
            result,
            result,
            result,
            result,
            result,
            result,
            result,
            result,
          ];
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },
  },
  components: {
    SLSelector,
    ColorGallery,
  },
});
</script>
