<template>
  <div className="w-screen h-screen flex flex-col overflow-hidden">
    <h1 className="w-full text-2xl p-4 bg-blue-300 text-white italic">
      StuBlue
    </h1>
    <SLSelector
      :saturation="saturation"
      :luminance="luminance"
      :isLoading="isLoading"
      :hasError="hasError"
      :changeSaturation="changeSaturation"
      :changeLuminance="changeLuminance"
      :getColors="getColors"
    />
    <ExistingColorsGallery
      :saturation="displayedSaturation"
      :luminance="displayedLuminance"
      :isLoading="isLoading"
      :colors="displayedColors"
    />
    <LoadingColorsGallery
      :saturation="saturation"
      :luminance="luminance"
      :isLoading="isLoading"
      :colors="loadingColors"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SLSelector from "@/components/SLSelector.vue";
import LoadingColorsGallery from "@/components/LoadingColorsGallery.vue";
import ExistingColorsGallery from "@/components/ExistingColorsGallery.vue";
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
    loadingColors: ColorCacheEntry[];
    displayedColors: ColorCacheEntry[];
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
      //  Live colors as the new color pallete is populating
      loadingColors: [],
      //  The complete set of colors from the last request
      displayedColors: [],
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
    pushToLoadingColors(newColor: ColorCacheEntry) {
      this.loadingColors.push(newColor);
    },
    getColors() {
      this.isLoading = true;
      this.hasError = false;
      getColorsBySL(this.saturation, this.luminance, this.pushToLoadingColors)
        .then((colors) => {
          this.isLoading = false;
          this.loadingColors = [];
          this.displayedSaturation = this.saturation;
          this.displayedLuminance = this.luminance;
          this.displayedColors = colors;
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },
  },
  components: {
    SLSelector,
    LoadingColorsGallery,
    ExistingColorsGallery,
  },
});
</script>
