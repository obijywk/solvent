<template>
  <div class="pigpen-button-container">
    <v-btn class="pigpen-button" flat @click="click">
      <v-flex>{{ letter }}</v-flex>
    </v-btn>
    <svg class="pigpen-button-dot" width="3" height="3" v-if="isDotted">
      <circle cx="1" cy="1" r="3" fill="black" />
    </svg>
  </div>
</template>

<style>
  .pigpen-button-container {
    display: inline-block;
    position: relative;
    margin: 2px;
  }
  .pigpen-button {
    margin: 0;
    min-width: 24px;
    max-width: 24px;
  }
  .pigpen-button-dot {
    position: absolute;
    left: 10px;
    top: 28px;
  }
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class PigpenButton extends Vue {
  @Prop()
  private letter: string;

  @Prop()
  private isDotted: boolean;

  private click() {
    this.$emit("addLetter", this.letter);
  }
}
</script>
