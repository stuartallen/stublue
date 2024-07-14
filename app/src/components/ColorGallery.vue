<template>
  <div className="w-full flex flex-grow flex-col overflow-hidden">
    <div v-if="hasError">
      <span className="pl-4 text-red-600">*Failed to Load New Pallete</span>
    </div>
    <div v-if="isLoading">
      <span className="pl-4 text-gray-400">Loading...</span>
      <h2 className="line-through text-3xl text-gray-400 pl-4 mb-2">
        [S: {{ saturation }}, L: {{ luminance }}]
      </h2>
    </div>
    <div v-else className="text-3xl text-gray-400 pl-4 mb-2">
      <h2 className="flex flex-wrap">
        <!-- Makes the label wrap nicely instead of on semicolons -->
        <div>[S: {{ saturation }},</div>
        <div>L: {{ luminance }}]</div>
      </h2>
    </div>
    <hr />
    <div
      className="flex flex-wrap justify-center overflow-x-hidden overflow-y-auto"
    >
      <div
        v-for="color in colors"
        :key="color.closestNamedHex"
        className="w-fit h-fit flex flex-col justify-center items-center ml-4 mt-4 border-2 p-4 border-black rounded-lg shadow-lg hover:mt-2"
      >
        <div
          :style="{ backgroundColor: color.closestNamedHex }"
          className="w-16 h-16 rounded-full"
        />
        <h3 className="font-bold">{{ color.value }}</h3>
        <span>{{ color.closestNamedHex }}</span>
        <span>({{ color.r }} {{ color.g }} {{ color.b }})</span>
      </div>
    </div>
    <hr className="my-16" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ColorCacheEntry } from "@/utils/colors";

export default defineComponent({
  name: "ColorGallery",
  props: {
    saturation: { type: Number, required: true },
    luminance: { type: Number, required: true },
    isLoading: { type: Boolean, required: true },
    hasError: { type: Boolean, required: true },
    colors: { type: Array as () => ColorCacheEntry[], required: false },
  },
});
</script>
