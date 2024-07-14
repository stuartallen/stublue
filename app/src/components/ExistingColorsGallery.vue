<template>
  <!-- Only display the existing after colors are set, so only 1 section appears on 1st load -->
  <!-- We do want to use loading styles when loading here to notify users the current pallete will be replaced-->
  <ColorGallery
    :display="colors.length > 0"
    :saturation="saturation"
    :luminance="luminance"
    :isUsingLoadingStyle="isLoading"
    :colors="colors"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorGallery from "./ColorGallery.vue";
import type { ColorCacheEntry } from "@/utils/colors";

export default defineComponent({
  name: "ExistingColorsGallery",
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
