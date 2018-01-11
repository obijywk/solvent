<template>
  <div id="numbers-grid-container">
    <div id="numbers-row">
      <numbers-button-component
        v-for="letter in ['A','B','C','D','E','F','G','H','I']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="numbers-row">
      <numbers-button-component
        v-for="letter in ['J','K','L','M','N','O','P','Q','R']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="numbers-row">
      <numbers-button-component
        v-for="letter in ['S','T','U','V','W','X','Y','Z',' ']"
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

declare const gtag: any;

@Component({
  components: {
    NumbersButtonComponent,
  },
})
export default class NumbersPicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
    gtag("event", "code_entry_numbers");
  }
}
</script>
