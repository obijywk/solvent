<template>
  <div class="pigpen-picker-column">
    <div class="pigpen-picker-row">
      <pigpen-nine-grid-component
        letters="ABCDEFGHI"
        @addLetter="addLetter($event)" />
      <pigpen-nine-grid-component
        letters="JKLMNOPQR" :is-dotted="true"
        @addLetter="addLetter($event)" />
    </div>
    <div class="pigpen-picker-row">
      <pigpen-four-grid-component
        letters="STUV"
        @addLetter="addLetter($event)" />
      <pigpen-four-grid-component
        letters="WXYZ" :is-dotted="true"
        @addLetter="addLetter($event)" />
    </div>
  </div>
</template>

<style>
.pigpen-picker-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pigpen-picker-row {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PigpenFourGridComponent from "./PigpenFourGrid.vue";
import PigpenNineGridComponent from "./PigpenNineGrid.vue";

declare const gtag: any;

@Component({
  components: {
    PigpenFourGridComponent,
    PigpenNineGridComponent,
  },
})
export default class PigpenPicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
    gtag("event", "code_entry_pigpen");
  }
}
</script>
