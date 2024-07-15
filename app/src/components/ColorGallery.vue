<template>
  <div
    v-if="display"
    :style="{ maxHeight: isUsingLoadingStyle ? '16rem' : undefined }"
    className="relative w-full flex flex-grow flex-col overflow-hidden"
  >
    <div
      v-if="isUsingLoadingStyle"
      className="absolute w-full h-full bg-slate-950 opacity-25 z-10 pointer-events-none"
    ></div>
    <div
      className="text-3xl text-gray-400 pl-4 mb-2"
      :style="{ textDecoration: isUsingLoadingStyle ? 'line-through' : '' }"
    >
      <h2 className="flex flex-wrap">
        <!-- Makes the label wrap nicely instead of on semicolons -->
        <div>[S: {{ saturation }},</div>
        <div>L: {{ luminance }}]</div>
      </h2>
    </div>
    <hr />
    <button
      v-if="colors.length > 0"
      @click="copyAllColorsProperties"
      className="w-fit h-fit px-4 py-2 mx-2 my-2 bg-blue-400 text-white rounded-lg"
      aria-label="Copy Properties from All Colors to Clipboard"
    >
      Copy All
    </button>
    <div
      className="flex flex-wrap justify-center overflow-x-hidden overflow-y-auto pb-8"
    >
      <div
        v-for="color in colors"
        :key="color.h"
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
  <hr v-if="display" className="mb-16" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ColorCacheEntry } from "@/utils/colors";

export default defineComponent({
  name: "ColorGallery",
  props: {
    display: { type: Boolean, required: true },
    saturation: { type: Number, required: true },
    luminance: { type: Number, required: true },
    isUsingLoadingStyle: { type: Boolean, required: true },
    colors: { type: Array as () => ColorCacheEntry[], required: true },
  },
  methods: {
    async copyColorProperties(color: ColorCacheEntry) {
      const colorProperties = `${color.value}, ${color.closestNamedHex}, (${color.r}, ${color.g}, ${color.b})`;
      try {
        await navigator.clipboard.writeText(colorProperties);
      } catch (err) {
        console.error("Failed to copy color properties", err);
      }
    },
    async copyAllColorsProperties() {
      const colorProperties = this.colors
        .map(
          (color) =>
            `${color.value}, ${color.closestNamedHex}, (${color.r}, ${color.g}, ${color.b})`
        )
        .join("\n");

      try {
        await navigator.clipboard.writeText(colorProperties);
      } catch (err) {
        console.error("Failed to copy all color properties", err);
      }
    },
  },
});
</script>
