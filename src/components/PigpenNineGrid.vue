<template>
  <div class="pigpen-nine-grid">
    <div class="pigpen-nine-grid-row">
      <pigpen-button-component
        style="border-right: 1px solid black; border-bottom: 1px solid black"
        :letter="letters[0]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black"
        :letter="letters[1]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border-bottom: 1px solid black; border-left: 1px solid black"
        :letter="letters[2]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
    <div class="pigpen-nine-grid-row">
      <pigpen-button-component
        style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black"
        :letter="letters[3]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border: 1px solid black"
        :letter="letters[4]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black"
        :letter="letters[5]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
    <div class="pigpen-nine-grid-row">
      <pigpen-button-component
        style="border-top: 1px solid black; border-right: 1px solid black"
        :letter="letters[6]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border-top: 1px solid black; border-right: 1px solid black; border-left: 1px solid black"
        :letter="letters[7]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
      <pigpen-button-component
        style="border-top: 1px solid black; border-left: 1px solid black"
        :letter="letters[8]"
        :is-dotted="isDotted"
        @addLetter="addLetter($event)" />
    </div>
  </div>
</template>

<style>
.pigpen-nine-grid {
  margin: 4px;
}
.pigpen-nine-grid-row {
  margin-top: 2px;
  margin-bottom: 2px;
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
export default class PigpenNineGrid extends Vue {
  @Prop()
  private letters: string;

  @Prop()
  private isDotted: boolean;

  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
