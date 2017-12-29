<template>
  <div id="binary-grid-container">
    <div id="binary-column">
      <binary-button-component
        v-for="letter in ['A','B','C','D','E','F','G']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="binary-column">
      <binary-button-component
        v-for="letter in ['H','I','J','K','L','M','N','O']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="binary-column">
      <binary-button-component
        v-for="letter in ['P','Q','R','S','T','U','V','W']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
    <div id="binary-column">
      <binary-button-component
        v-for="letter in ['X','Y','Z',' ']"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)"
      />
    </div>
  </div>
</template>

<style>
#binary-grid-container {
  display: flex;
  justify-content: center;
}
#binary-column {
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BinaryButtonComponent from "./BinaryButton.vue";

@Component({
  components: {
    BinaryButtonComponent,
  },
})
export default class BinaryPicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
