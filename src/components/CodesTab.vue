<template>
  <div id="codes-tab-container">
    <p class="credits">
      Inspired by the
      <a href="http://www.derf.net/encodings/codesheet.pdf" target="_blank">derf.net codesheet</a>.
    </p>

    <div id="codes-tab-text-container">
      <v-text-field
        id="codes-tab-text"
        label="Text"
        textarea
        rows="3"
        hide-details
        v-model="text"
      />
    </div>

    <div id="codes-tab-buttons">
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

      <v-tooltip top style="margin-left: auto">
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
    </div>

    <div id="codes-tab-desktop-pickers" class="hidden-sm-and-down">
      <v-container fluid grid-list-md>
        <div id="codes-tab-picker-cards">
          <v-card>
            <braille-picker-component @addLetter="addLetter($event)" />
          </v-card>
          <v-card>
            <morse-picker-component @addLetter="addLetter($event)" />
          </v-card>
          <v-card>
            <semaphore-picker-component @addLetter="addLetter($event)" />
          </v-card>
          <v-card>
            <binary-picker-component @addLetter="addLetter($event)" />
          </v-card>
          <v-card>
            <numbers-picker-component @addLetter="addLetter($event)" />
          </v-card>
          <v-card>
            <pigpen-picker-component @addLetter="addLetter($event)" />
          </v-card>
        </div>
      </v-container>
    </div>
    <div id="codes-tab-mobile-pickers" class="hidden-md-and-up">
      <v-tabs>
        <v-tabs-bar class="blue-grey lighten-4">
          <v-tabs-item href="#braille-tab">Braille</v-tabs-item>
          <v-tabs-item href="#morse-tab">Morse</v-tabs-item>
          <v-tabs-item href="#semaphore-tab">Semaphore</v-tabs-item>
          <v-tabs-item href="#binary-tab">Binary</v-tabs-item>
          <v-tabs-item href="#numbers-tab">Numbers</v-tabs-item>
          <v-tabs-item href="#pigpen-tab">Pigpen</v-tabs-item>
          <v-tabs-slider></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content id="braille-tab" lazy>
            <braille-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
          <v-tabs-content id="morse-tab" lazy>
            <morse-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
          <v-tabs-content id="semaphore-tab" lazy>
            <semaphore-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
          <v-tabs-content id="binary-tab" lazy>
            <binary-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
          <v-tabs-content id="numbers-tab" lazy>
            <numbers-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
          <v-tabs-content id="pigpen-tab" lazy>
            <pigpen-picker-component @addLetter="addLetter($event)" />
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<style>
#codes-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}
#codes-tab-container .credits {
  margin-left: 16px;
  margin-right: 16px;
}
#codes-tab-text-container {
  flex: 0;
  margin-left: 16px;
  margin-right: 16px;
}
#codes-tab-buttons {
  display: flex;
  justify-content: flex-end;
  margin-left: 16px;
  margin-right: 16px;
}
#codes-tab-desktop-pickers {
  margin-top: 16px;
  margin-bottom: auto;
}
#codes-tab-mobile-pickers {
  margin-top: auto;
  margin-bottom: 16px;
}
#codes-tab-picker-cards {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
#codes-tab-picker-cards > .card {
  flex: 0 0 auto;
  margin: 16px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BinaryPickerComponent from "./BinaryPicker.vue";
import BraillePickerComponent from "./BraillePicker.vue";
import MorsePickerComponent from "./MorsePicker.vue";
import NumbersPickerComponent from "./NumbersPicker.vue";
import PigpenPickerComponent from "./PigpenPicker.vue";
import SemaphorePickerComponent from "./SemaphorePicker.vue";

@Component({
  components: {
    BinaryPickerComponent,
    BraillePickerComponent,
    MorsePickerComponent,
    NumbersPickerComponent,
    PigpenPickerComponent,
    SemaphorePickerComponent,
  },
})
export default class CodesTab extends Vue {
  private text: string = "";

  private addLetter(letter: string) {
    this.text += letter;
  }

  private clear() {
    this.text = "";
  }

  private backspace() {
    this.text = this.text.slice(0, this.text.length - 1);
  }

  private copy() {
    const textArea: HTMLTextAreaElement = document.querySelector("#codes-tab-text") as HTMLTextAreaElement;
    textArea.select();
    document.execCommand("copy");
  }
}
</script>
