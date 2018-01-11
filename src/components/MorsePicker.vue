<template>
  <div id="morse-grid-container">
    <div id="morse-homogenous-column">
      <div id="morse-all-dot-column">
        <morse-button-component letter="E" morse="." @addLetter="addLetter($event)" />
        <morse-button-component letter="I" morse=".." @addLetter="addLetter($event)" />
        <morse-button-component letter="S" morse="..." @addLetter="addLetter($event)" />
        <morse-button-component letter="H" morse="...." @addLetter="addLetter($event)" />
      </div>
      <div id="morse-all-dash-column">
        <morse-button-component letter="T" morse="-" @addLetter="addLetter($event)" />
        <morse-button-component letter="M" morse="--" @addLetter="addLetter($event)" />
        <morse-button-component letter="O" morse="---" @addLetter="addLetter($event)" />
      </div>
    </div>
    <div id="morse-heterogeneous-column">
      <div id="morse-one-dot-row">
        <div id="morse-one-dot-one-dash-column">
          <morse-button-component letter="A" morse=".-" @addLetter="addLetter($event)" />
          <morse-button-component letter="N" morse="-." @addLetter="addLetter($event)" />
          <morse-button-component id="morse-space-button" letter=" " morse="" @addLetter="addLetter($event)" />
        </div>
        <div id="morse-one-dot-two-dash-column">
          <morse-button-component letter="W" morse=".--" @addLetter="addLetter($event)" />
          <morse-button-component letter="K" morse="-.-" @addLetter="addLetter($event)" />
          <morse-button-component letter="G" morse="--." @addLetter="addLetter($event)" />
        </div>
        <div id="morse-one-dot-three-dash-column">
          <morse-button-component letter="J" morse=".---" @addLetter="addLetter($event)" />
          <morse-button-component letter="Y" morse="-.--" @addLetter="addLetter($event)" />
          <morse-button-component letter="Q" morse="--.-" @addLetter="addLetter($event)" />
        </div>
      </div>
      <div id="morse-multiple-dots-row">
        <div id="morse-two-dot-two-dash-column">
          <morse-button-component letter="X" morse="-..-" @addLetter="addLetter($event)" />
          <morse-button-component letter="C" morse="-.-." @addLetter="addLetter($event)" />
          <morse-button-component letter="Z" morse="--.." @addLetter="addLetter($event)" />
          <morse-button-component letter="P" morse=".--." @addLetter="addLetter($event)" />
        </div>
        <div id="morse-two-dot-one-dash-column">
          <morse-button-component letter="U" morse="..-" @addLetter="addLetter($event)" />
          <morse-button-component letter="R" morse=".-." @addLetter="addLetter($event)" />
          <morse-button-component letter="D" morse="-.." @addLetter="addLetter($event)" />
        </div>
        <div id="morse-three-dot-one-dash-column">
          <morse-button-component letter="V" morse="...-" @addLetter="addLetter($event)" />
          <morse-button-component letter="F" morse="..-." @addLetter="addLetter($event)" />
          <morse-button-component letter="L" morse=".-.." @addLetter="addLetter($event)" />
          <morse-button-component letter="B" morse="-..." @addLetter="addLetter($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#morse-grid-container {
  display: flex;
  justify-content: center;
}
#morse-homogeneous-column {
  display: flex;
  flex-direction: column;
}
#morse-all-dot-column {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
}
#morse-all-dash-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
}
#morse-heterogeneous-column {
  display: flex;
  flex-direction: column;
}
#morse-one-dot-row {
  display: flex;
  border-top: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}
#morse-one-dot-one-dash-column {
  display: flex;
  flex-direction: column;
}
#morse-one-dot-two-dash-column {
  display: flex;
  flex-direction: column;
}
#morse-one-dot-three-dash-column {
  display: flex;
  flex-direction: column;
}
#morse-multiple-dots-row {
  display: flex;
  border-bottom: 1px solid black;
}
#morse-two-dot-two-dash-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
}
#morse-two-dot-one-dash-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-right: 1px solid black;
}
#morse-three-dot-one-dash-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
}
#morse-space-button {
  border-top: 1px solid black;
  border-right: 1px solid black;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import MorseButtonComponent from "./MorseButton.vue";

declare const gtag: any;

@Component({
  components: {
    MorseButtonComponent,
  },
})
export default class MorsePicker extends Vue {
  private addLetter(letter: string) {
    this.$emit("addLetter", letter);
    gtag("event", "code_entry_morse");
  }
}
</script>
