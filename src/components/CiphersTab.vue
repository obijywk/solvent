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
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear text</span>
      </v-tooltip>
      <v-btn @click="caesarShift()">
        Caesar Shift
      </v-btn>
      <v-btn @click="substitution()">
        Solve Substitution
      </v-btn>
    </div>

    <div id="ciphers-tab-outputs">
      <caesar-shifter-component ref="caesar-shifter"
        v-show="activeComponent === ActiveComponent.CAESAR_SHIFTER"
        :inputString="text"
      />
      <cipher-solver-component ref="cipher-solver"
        v-show="activeComponent === ActiveComponent.CIPHER_SOLVER"
        :inputString="text"
      />
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
  align-items: center;
}
#ciphers-tab-outputs {
  height: 100%;
  overflow: hidden;
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
import CipherSolverComponent from "./CipherSolver.vue";

enum ActiveComponent {
  CAESAR_SHIFTER,
  CIPHER_SOLVER,
}

@Component({
  components: {
    CaesarShifterComponent,
    CipherSolverComponent,
  },
})
export default class CiphersTab extends Vue {
  private text: string = "";

  private ActiveComponent = ActiveComponent;
  private activeComponent: ActiveComponent = ActiveComponent.CAESAR_SHIFTER;

  private clear() {
    this.text = "";
  }

  private caesarShift() {
    this.activeComponent = ActiveComponent.CAESAR_SHIFTER;
    (this.$refs["caesar-shifter"] as CaesarShifterComponent).update();
  }

  private substitution() {
    this.activeComponent = ActiveComponent.CIPHER_SOLVER;
    (this.$refs["cipher-solver"] as CipherSolverComponent).update();
  }
}
</script>
