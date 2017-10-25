<template>
  <v-container fluid>
    <v-layout row>
      <v-flex>
        <v-text-field label="Text" multi-line v-model="text">
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <braille-card-component @addLetter="addLetter($event)" />
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import BrailleCardComponent from "./BrailleCard.vue";

@Component({
  components: {
    BrailleCardComponent
  }
})
export default class CodesTab extends Vue {
  text: string = "";

  addLetter(letter: string) {
    this.text += letter;
  }
}
</script>
