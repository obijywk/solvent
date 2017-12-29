<template>
  <v-btn flat @click="click" class="binary-button">
    <span class="binary-letter">{{ displayLetter() }}</span>
    <span class="binary-code">{{ code() }}</span>
  </v-btn>
</template>

<style>
.binary-button {
  margin: 0;
  min-height: 32px;
  height: 32px;
  min-width: 72px;
}
.binary-button .btn__content {
  padding: 2px;
  min-height: 32px;
  height: 32px;
  min-width: 72px;
  justify-content: left;
  font-family: 'Roboto Mono', monospace;
}
.binary-letter {
  min-width: 20px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class BinaryButton extends Vue {
  @Prop()
  private letter: string;

  private displayLetter(): string {
    if (this.letter === " ") {
      return "_";
    }
    return this.letter;
  }

  private code(): string {
    if (this.letter === " ") {
      return "";
    }
    let code = (this.letter.charCodeAt(0) - 64).toString(2);
    while (code.length < 5) {
      code = "0" + code;
    }
    return code;
  }

  private click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
