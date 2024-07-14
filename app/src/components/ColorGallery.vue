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
      className="flex flex-wrap justify-center overflow-x-hidden overflow-y-auto pb-8"
    >
      <div
        v-for="color in colors"
        :key="color.closestNamedHex"
        className="w-fit h-fit flex flex-col justify-center items-center ml-4 mt-4 border-2 px-4 pb-4 py-2 border-black rounded-lg shadow-lg hover:mt-2"
      >
        <div
          :style="{
            backgroundColor: color.closestNamedHex,
          }"
          className="w-20 h-20 rounded-full border-2 border-gray-200"
        />
        <h3 className="font-bold">{{ color.value }}</h3>
        <span>{{ color.closestNamedHex }}</span>
        <span>({{ color.r }} {{ color.g }} {{ color.b }})</span>
        <button
          @click="copyColorProperties(color)"
          className="px-2 py-1 mt-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          title="Copy to Clipboard"
          :aria-label="`Copy ${color.value} to Clipboard`"
        >
          Copy
        </button>
      </div>
    </div>
  </div>
  <hr className="mb-16" />
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
  methods: {
    async copyColorProperties(color: ColorCacheEntry) {
      const colorProperties = `${color.value}, ${color.closestNamedHex}, (${color.r}, ${color.g}, ${color.b})`;
      try {
        await navigator.clipboard.writeText(colorProperties);
        console.log("Color properties copied to clipboard");
      } catch (err) {
        console.error("Failed to copy color properties", err);
      }
    },
  },
});
</script>
