<template>
  <div className="h-fit px-4 pt-4 pb-2 flex flex-col w-full max-w-56">
    <form @submit.prevent="onSubmit">
      <label for="saturation" className="flex justify-between flex-wrap">
        <span>Saturation:</span>
        <div>
          <!-- On key down prop prevents all non-integer input, I added Enter, up/down arrows and Tab so the form can be submitted, manipulated and tabigated accessibly
         courtesy of:  https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in -->
          <input
            id="saturation"
            name="saturation"
            className="mb-2 border border-gray-300 rounded-lg text-right"
            type="number"
            v-model.number="inputSaturation"
            @input="updateSaturation()"
            min="0"
            max="100"
            step="1"
            onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight','Enter','Tab','ArrowUp','ArrowDown'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'"
          />
          %
        </div>
      </label>
      <label for="luminance" className="flex justify-between flex-wrap">
        <span>Luminance:</span>
        <div>
          <input
            id="luminance"
            name="luminance"
            className="border border-gray-300 rounded-lg text-right"
            type="number"
            v-model.number="inputLuminance"
            @input="updateLuminance()"
            min="0"
            max="100"
            step="1"
            onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight','Enter','Tab','ArrowUp','ArrowDown'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'"
          />
          %
        </div>
      </label>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        v-bind:disabled="
          isLoading || inputSaturation === '' || inputLuminance === ''
        "
      >
        Generate
      </button>
    </form>
  </div>
  <span v-if="hasError" className="pl-4 pb-4 text-red-600"
    >*Failed to Load New Pallete</span
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";

const validateInPercentRange = (value: string | number): number => {
  const parsedValue = Number(value);
  if (value === "" || isNaN(parsedValue)) {
    return 0;
  }
  if (parsedValue < 0) {
    return 0;
  }
  if (parsedValue > 100) {
    return 100;
  }
  return parsedValue;
};

export default defineComponent({
  name: "SLSelector",
  props: {
    saturation: { type: Number, required: true },
    luminance: { type: Number, required: true },
    isLoading: { type: Boolean, required: true },
    hasError: { type: Boolean, required: true },
    changeSaturation: { type: Function, required: true },
    changeLuminance: { type: Function, required: true },
    getColors: { type: Function, required: true },
  },
  data(): {
    //  Very briefly, the result from the input field can be a string when it's blank
    inputSaturation: string | number;
    inputLuminance: string | number;
  } {
    return {
      //	Set as the initial value from props
      inputSaturation: this.$props.saturation,
      inputLuminance: this.$props.luminance,
    };
  },
  watch: {
    inputSaturation(newVal: string | number) {
      this.inputSaturation = validateInPercentRange(newVal);
    },
    inputLuminance(newVal: string | number) {
      this.inputLuminance = validateInPercentRange(newVal);
    },
  },
  methods: {
    updateSaturation() {
      this.$props.changeSaturation(this.inputSaturation);
    },
    updateLuminance() {
      this.$props.changeLuminance(this.inputLuminance);
    },
    onSubmit() {
      this.$props.getColors();
    },
  },
});
</script>
