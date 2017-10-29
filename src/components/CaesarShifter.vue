<template>
  <div id="caesar-shifter">
    <ul>
      <li v-for="(s, index) in outputStrings" :key="index">
        {{ s }}
      </li>
    </ul>
  </div>
</template>

<style>
#caesar-shifter ul {
  list-style-type: none;
  padding-left: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class CaesarShifter extends Vue {
  @Prop()
  public inputString: string;

  private outputStrings: string[] = [];

  public update() {
    const strippedInputString = this.inputString.toUpperCase().replace(/[^A-Z ]/g, "");
    this.outputStrings = [];
    for (let shift = 0; shift < 26; shift++) {
      let outputString = "";
      for (let i = 0; i < strippedInputString.length; i++) {
        if (strippedInputString[i] === " ") {
          outputString += " ";
          continue;
        }
        const inputCode = strippedInputString.charCodeAt(i);
        const outputCode = (((inputCode - 65) + shift) % 26) + 65;
        outputString += String.fromCharCode(outputCode);
      }
      this.outputStrings.push(outputString);
    }
  }
}
</script>
