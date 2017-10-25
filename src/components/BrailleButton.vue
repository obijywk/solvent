<template>
  <v-btn flat @click="click" class="braille-button">
    <v-container fluid grid-list-xs class="braille-button-container">
      <v-layout row>
        <v-flex>{{ letter != " " ? letter : "_" }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <svg width="20" height="36">
            <circle cx="5" cy="6" r="3" stroke="black" fill="white" />
            <circle cx="15" cy="6" r="3" stroke="black" fill="white" />
            <circle cx="5" cy="18" r="3" stroke="black" fill="white" />
            <circle cx="15" cy="18" r="3" stroke="black" fill="white" />
            <circle cx="5" cy="30" r="3" stroke="black" fill="white" />
            <circle cx="15" cy="30" r="3" stroke="black" fill="white" />
          </svg>
        </v-flex>
      </v-layout>
    </v-container>
  </v-btn>
</template>

<style>
.braille-button {
  width: 28px;
  min-width: 28px;
  height: 72px;
  margin: 0;
}
.braille-button .btn__content {
  min-width: 28px;
  padding: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

const BRAILLE = {
  "A": 0b100000,
  "B": 0b101000,
  "C": 0b110000,
  "D": 0b110100,
  "E": 0b100100,
  "F": 0b111000,
  "G": 0b111100,
};

@Component
export default class BrailleButton extends Vue {
  @Prop()
  letter: string;

  click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
