<template>
  <v-btn flat @click="click" class="morse-button">
    <span class="morse-letter">{{ letter }}</span>
    <span class="morse-code">{{ morse }}</span>
  </v-btn>
</template>

<style>
.morse-button {
  margin: 0;
  min-height: 36px;
  height: 36px;
  min-width: 60px;
}
.morse-button .btn__content {
  padding: 2px;
  min-height: 36px;
  height: 36px;
  min-width: 60px;
  justify-content: left;
}
.morse-letter {
  min-width: 20px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class MorseButton extends Vue {
  @Prop()
  letter: string;

  @Prop()
  morse: string;

  click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
