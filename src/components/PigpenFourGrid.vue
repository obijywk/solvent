<template>
  <div class="pigpen-four-grid">
    <svg class="pigpen-four-grid-x">
      <line x1="10%" y1="10%" x2="90%" y2="90%" style="stroke: black; stroke-width: 1" />
      <line x1="90%" y1="10%" x2="10%" y2="90%" style="stroke: black; stroke-width: 1" />
    </svg>
    <div class="pigpen-four-grid-row">
      <pigpen-button-component
        :letter="letters[0]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
    <div class="pigpen-four-grid-row">
      <pigpen-button-component
        :letter="letters[1]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        :letter="letters[2]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
    <div class="pigpen-four-grid-row">
      <pigpen-button-component
        :letter="letters[3]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
  </div>
</template>

<style>
.pigpen-four-grid {
  height: 100%;
  width: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pigpen-four-grid-row {
  display: flex;
  justify-content: space-evenly;
}
.pigpen-four-grid-x {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PigpenButtonComponent from "./PigpenButton.vue";

@Component({
  components: {
    PigpenButtonComponent,
  },
})
export default class PigpenFourGrid extends Vue {
  @Prop()
  private letters: string;

  @Prop()
  private isDotted: boolean;

  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
