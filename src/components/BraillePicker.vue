<template>
  <div id="braille-picker-container">
    <div class="braille-picker-row">
      <braille-button-component
        v-for="letter in 'AKDFMGXTQ'"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)" />
    </div>
    <div class="braille-picker-row">
      <braille-button-component
        v-for="letter in 'EIJHUPVRY'"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)" />
    </div>
    <div class="braille-picker-row">
      <braille-button-component
        v-for="letter in 'BCLSONZW '"
        :key="letter"
        :letter="letter"
        @addLetter="addLetter($event)" />
    </div>
  </div>
</template>

<style>
#braille-picker-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.braille-picker-row {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.braille-picker-row button {
  flex: 1;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BrailleButtonComponent from "./BrailleButton.vue";

@Component({
  components: {
    BrailleButtonComponent,
  },
})
export default class BraillePicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
