<template>
  <span v-if="isLoading" className="pl-4 font-bold">*Pallete Building...</span>
  <!-- The loading colors gallery will display only while colors are loading -->
  <!-- This section can be assumed to be loading so we don't need a strikethrough -->
  <ColorGallery
    :display="isLoading"
    :saturation="saturation"
    :luminance="luminance"
    :isUsingLoadingStyle="false"
    :colors="colors"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorGallery from "./ColorGallery.vue";
import type { ColorCacheEntry } from "@/utils/colors";

export default defineComponent({
  name: "LoadingColorsGallery",
  props: {
    saturation: { type: Number, required: true },
    luminance: { type: Number, required: true },
    isLoading: { type: Boolean, required: true },
    colors: { type: Array as () => ColorCacheEntry[], required: true },
  },
  components: {
    ColorGallery,
  },
});
</script>
