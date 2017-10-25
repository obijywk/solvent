<template>
  <v-btn flat @click="click" class="braille-button">
    <v-container fluid grid-list-xs class="braille-button-container">
      <v-layout row>
        <v-flex>{{ letter != " " ? letter : "_" }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex>
          <svg width="20" height="36">
            <circle cx="5" cy="6" r="3" stroke="black" :fill="fillColor(0b100000)" />
            <circle cx="15" cy="6" r="3" stroke="black" :fill="fillColor(0b010000)" />
            <circle cx="5" cy="18" r="3" stroke="black" :fill="fillColor(0b001000)" />
            <circle cx="15" cy="18" r="3" stroke="black" :fill="fillColor(0b000100)" />
            <circle cx="5" cy="30" r="3" stroke="black" :fill="fillColor(0b000010)" />
            <circle cx="15" cy="30" r="3" stroke="black" :fill="fillColor(0b000001)" />
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

const BRAILLE: { [letter: string]: number; } = {
  "A": 0b100000,
  "B": 0b101000,
  "C": 0b110000,
  "D": 0b110100,
  "E": 0b100100,
  "F": 0b111000,
  "G": 0b111100,
  "H": 0b101100,
  "I": 0b011000,
  "J": 0b011100,
  "K": 0b100010,
  "L": 0b101010,
  "M": 0b110010,
  "N": 0b110110,
  "O": 0b100110,
  "P": 0b111010,
  "Q": 0b111110,
  "R": 0b101110,
  "S": 0b011010,
  "T": 0b011110,
  "U": 0b100011,
  "V": 0b101011,
  "W": 0b011101,
  "X": 0b110011,
  "Y": 0b110111,
  "Z": 0b100111,
};

@Component
export default class BrailleButton extends Vue {
  @Prop()
  letter: string;

  fillColor(bit: number) {
    if (bit & BRAILLE[this.letter]) {
      return "black";
    }
    return "white";
  }

  click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
