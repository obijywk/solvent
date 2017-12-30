<template>
  <v-app id="solvent" class="full-height">
    <v-tabs class="full-height tabs-container">
      <v-tabs-bar class="blue-grey lighten-4">
        <v-tabs-item href="#codes-tab">Codes</v-tabs-item>
        <v-tabs-item href="#ciphers-tab">Ciphers</v-tabs-item>
        <v-tabs-item href="#clues-tab">Clues</v-tabs-item>
        <v-tabs-item href="#collective-jl-tab">Collective.jl</v-tabs-item>
        <v-tabs-item href="#nutrimatic-tab">Nutrimatic</v-tabs-item>
        <v-tabs-item href="#image-search-tab">Image Search</v-tabs-item>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items class="tabs-items" touchless>
        <v-tabs-content id="codes-tab" class="full-height" lazy>
          <codes-tab-component @error="handleError($event)" />
        </v-tabs-content>
        <v-tabs-content id="ciphers-tab" class="full-height" lazy>
          <ciphers-tab-component @error="handleError($event)" />
        </v-tabs-content>
        <v-tabs-content id="clues-tab" class="full-height" lazy>
          <clues-tab-component @error="handleError($event)" />
        </v-tabs-content>
        <v-tabs-content id="collective-jl-tab" class="full-height" lazy>
          <collective-jl-tab-component @error="handleError($event)" />
        </v-tabs-content>
        <v-tabs-content id="nutrimatic-tab" class="full-height" lazy>
          <nutrimatic-tab-component @error="handleError($event)" />
        </v-tabs-content>
        <v-tabs-content id="image-search-tab" class="full-height" lazy>
          <image-search-tab-component @error="handleError($event)" />
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
    <v-snackbar
      id="error-snackbar"
      color="error"
      v-model="showErrorSnackbar"
    >
      {{ errorMessage }}
      <v-btn dark flat @click.native="showErrorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<style>
.full-height {
  height: 100%;
}
.tabs-container {
  display: flex;
  flex-direction: column;
}
.tabs-items {
  flex: 1;
}
.credits {
  font-style: italic;
  margin: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import CiphersTabComponent from "./CiphersTab.vue";
import CluesTabComponent from "./CluesTab.vue";
import CodesTabComponent from "./CodesTab.vue";
import CollectiveJlTabComponent from "./CollectiveJlTab.vue";
import ImageSearchTabComponent from "./ImageSearchTab.vue";
import NutrimaticTabComponent from "./NutrimaticTab.vue";

@Component({
  components: {
    CiphersTabComponent,
    CluesTabComponent,
    CodesTabComponent,
    CollectiveJlTabComponent,
    ImageSearchTabComponent,
    NutrimaticTabComponent,
  },
})
export default class App extends Vue {
  private showErrorSnackbar: boolean = false;
  private errorMessage: string = "";

  private handleError(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.showErrorSnackbar = true;
  }
}
</script>
