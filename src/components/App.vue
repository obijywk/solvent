<template>
  <v-app id="solvent" class="full-height">
    <v-tabs class="full-height tabs-container">
      <v-tabs-bar class="blue-grey lighten-4">
        <v-tabs-item href="#codes-tab">Codes</v-tabs-item>
        <v-tabs-item href="#ciphers-tab">Ciphers</v-tabs-item>
        <v-tabs-item href="#collective-jl-tab">Collective.jl</v-tabs-item>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items class="tabs-items" touchless>
        <v-tabs-content id="codes-tab" class="full-height" lazy>
          <codes-tab-component />
        </v-tabs-content>
        <v-tabs-content id="ciphers-tab" class="full-height" lazy>
          <ciphers-tab-component />
        </v-tabs-content>
        <v-tabs-content id="collective-jl-tab" class="full-height" lazy>
          <collective-jl-tab-component />
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
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
import CodesTabComponent from "./CodesTab.vue";
import CollectiveJlTabComponent from "./CollectiveJlTab.vue";

@Component({
  components: {
    CiphersTabComponent,
    CodesTabComponent,
    CollectiveJlTabComponent,
  },
})
export default class App extends Vue {
}
</script>
