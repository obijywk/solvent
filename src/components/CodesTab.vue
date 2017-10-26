<template>
  <v-container fluid id="codes-tab-container">
    <v-layout row>
      <v-flex>
        <v-text-field id="text" label="Text" textarea rows="3" v-model="text">
        </v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row wrap align-center>
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear text</span>
      </v-tooltip>

      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="backspace">
          <v-icon>backspace</v-icon>
        </v-btn>
        <span>Backspace</span>
      </v-tooltip>

      <v-tooltip top>
        <v-btn slot="activator" fab small color="primary" @click="addLetter(' ')">
          <v-icon>forward</v-icon>
        </v-btn>
        <span>Insert space</span>
      </v-tooltip>

      <v-tooltip top>
        <v-btn slot="activator" fab small color="primary" @click="copy">
          <v-icon>content_copy</v-icon>
        </v-btn>
        <span>Copy to clipboard</span>
      </v-tooltip>
    </v-layout>

    <v-layout row>
      <v-flex>
        <v-container class="hidden-sm-and-down" fluid grid-list-md>
          <v-layout row wrap>
            <v-card>
              <braille-picker-component @addLetter="addLetter($event)" />
            </v-card>
          </v-layout>
        </v-container>
        <v-tabs class="hidden-md-and-up">
          <v-tabs-bar class="blue-grey lighten-4">
            <v-tabs-item href="#braille-tab">Braille</v-tabs-item>
            <v-tabs-slider></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content id="braille-tab" lazy>
              <braille-picker-component @addLetter="addLetter($event)" />
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
#codes-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BraillePickerComponent from "./BraillePicker.vue";

@Component({
  components: {
    BraillePickerComponent
  }
})
export default class CodesTab extends Vue {
  text: string = "";

  addLetter(letter: string) {
    this.text += letter;
  }

  clear() {
    this.text = "";
  }

  backspace() {
    this.text = this.text.slice(0, this.text.length - 1);
  }

  copy() {
    const textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.querySelector("#text");
    textArea.select();
    document.execCommand("copy");
  }
}
</script>
