<template>
  <div id="numbers-grid-container">
    <div id="numbers-row">
      <numbers-button-component
        v-for="letter in ['A','B','C','D','E','F','G','H','I','J','K','L','M']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="numbers-row">
      <numbers-button-component
        v-for="letter in ['Z','Y','X','W','V','U','T','S','R','Q','P','O','N']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
  </div>
</template>

<style>
#numbers-grid-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#numbers-row {
  display: flex;
  flex-direction: row;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import NumbersButtonComponent from "./NumbersButton.vue";

@Component({
  components: {
    NumbersButtonComponent,
  },
})
export default class NumbersPicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
