<template>
  <v-container grid-list-xs class="braille-grid-container">
    <v-layout row>
      <v-flex v-for="letter in 'AKDFMGXTQ'" :key="letter">
        <braille-button-component :letter="letter" @addLetter="addLetter($event)" />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex v-for="letter in 'EIJHUPVRY'" :key="letter">
        <braille-button-component :letter="letter" @addLetter="addLetter($event)" />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex v-for="letter in 'BCLSONZW '" :key="letter">
        <braille-button-component :letter="letter" @addLetter="addLetter($event)" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.braille-grid-container .layout .flex {
  padding: 2px !important;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BrailleButtonComponent from "./BrailleButton.vue";

@Component({
  components: {
    BrailleButtonComponent
  }
})
export default class BraillePicker extends Vue {
  addLetter(letter: string) {
    this.$emit("addLetter", letter);
  }
}
</script>
