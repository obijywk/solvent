<template>
  <v-btn flat @click="click" class="numbers-button">
    <span>{{ letter }}</span>
    <span>{{ naturalNumber() }}</span>
    <span>{{ asciiNumber() }}</span>
  </v-btn>
</template>

<style>
.numbers-button {
  margin: 0;
  min-width: 28px;
  min-height: 128px;
  flex: 1;
}
.numbers-button .btn__content {
  padding: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NumbersButton extends Vue {
  @Prop()
  private letter: string;

  private naturalNumber(): string {
    return (this.letter.charCodeAt(0) - 64).toString();
  }

  private asciiNumber(): string {
    return this.letter.charCodeAt(0).toString();
  }

  private click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
