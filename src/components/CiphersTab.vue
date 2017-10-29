<template>
  <div id="ciphers-tab-container">
    <div id="ciphers-tab-text-container">
      <v-text-field
        id="ciphers-tab-text"
        label="Text"
        textarea
        rows="3"
        hide-details
        v-model="text"
      />
    </div>

    <div id="ciphers-tab-buttons">
      <v-btn @click="caesarShift()">
        Caesar Shift
      </v-btn>
    </div>

    <div id="ciphers-tab-outputs">
      <caesar-shifter-component ref="caesar-shifter" :inputString="text" />
    </div>
  </div>
</template>

<style>
#ciphers-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
}
#ciphers-tab-text-container {
  flex: none;
}
#ciphers-tab-buttons {
  flex: none;
  display: flex;
  flex-wrap: wrap;
}
#ciphers-tab-outputs {
  height: 100%;
  overflow: hidden;
  margin-bottom: 48px;
}
#ciphers-tab-outputs > * {
  height: 100%;
  overflow: scroll;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import CaesarShifterComponent from "./CaesarShifter.vue";

@Component({
  components: {
    CaesarShifterComponent,
  },
})
export default class CiphersTab extends Vue {
  private text: string = "";

  private caesarShift() {
    (this.$refs["caesar-shifter"] as CaesarShifterComponent).update();
  }
}
</script>
