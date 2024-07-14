<template>
  <div className="p-4 flex flex-col w-full max-w-56">
    <form>
      <label className="flex justify-between flex-wrap">
        <span>Saturation:</span>
        <div>
          <!-- On key down prop prevents all non-integer input
         courtesy of:  https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in -->
          <input
            className="mb-2 border border-gray-300 rounded-lg"
            type="number"
            v-model.number="inputSaturation"
            @input="updateSaturation(inputSaturation)"
            min="0"
            max="100"
            step="1"
            onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'"
          />
          %
        </div>
      </label>
      <label className="flex justify-between flex-wrap">
        <span>Luminance:</span>
        <div>
          <input
            className="border border-gray-300 rounded-lg"
            type="number"
            v-model.number="inputLuminance"
            @input="updateLuminance(inputLuminance)"
            min="0"
            max="100"
            step="1"
            onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'"
          />
          %
        </div>
      </label>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        v-bind:disabled="inputSaturation === '' || inputLuminance === ''"
      >
        Generate
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const validateInPercentRange = (value: number) => {
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return value;
};

export default defineComponent({
  name: "SLSelector",
  props: {
    saturation: { type: Number, required: true },
    luminance: { type: Number, required: true },
    changeSaturation: { type: Function, required: true },
    changeLuminance: { type: Function, required: true },
  },
  data() {
    return {
      //	Set as the initial value from props
      inputSaturation: this.saturation,
      inputLuminance: this.luminance,
    };
  },
  watch: {
    inputSaturation(newVal: number) {
      this.inputSaturation = validateInPercentRange(newVal);
    },
    inputLuminance(newVal) {
      this.inputLuminance = validateInPercentRange(newVal);
    },
  },
  methods: {
    updateSaturation() {
      this.changeSaturation(this.inputSaturation);
    },
    updateLuminance() {
      this.changeLuminance(this.inputLuminance);
    },
  },
});
</script>
