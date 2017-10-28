<template>
  <v-app id="solvent" class="full-height">
    <v-tabs class="full-height">
      <v-tabs-bar class="blue-grey lighten-4">
        <v-tabs-item href="#codes-tab">Codes</v-tabs-item>
        <v-tabs-item href="#ciphers-tab">Ciphers</v-tabs-item>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items class="full-height">
        <v-tabs-content id="codes-tab" class="full-height" lazy>
          <codes-tab-component />
        </v-tabs-content>
        <v-tabs-content id="ciphers-tab" class="full-height" lazy>
          <ciphers-tab-component />
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-app>
</template>

<style>
.full-height {
  height: 100%;
}
.credits {
  font-style: italic;
  margin: 16px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import CiphersTabComponent from "./CiphersTab.vue";
import CodesTabComponent from "./CodesTab.vue";

@Component({
  components: {
    CiphersTabComponent,
    CodesTabComponent,
  },
})
export default class App extends Vue {
}
</script>
