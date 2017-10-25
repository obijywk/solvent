<template>
  <v-app id="solvent">
    <v-tabs>
      <v-tabs-bar class="blue-grey lighten-4">
        <v-tabs-item href="#codes">Codes</v-tabs-item>
        <v-tabs-item href="#ciphers">Ciphers</v-tabs-item>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content id="codes">
          <codes-tab-component />
        </v-tabs-content>
        <v-tabs-content id="ciphers">
          <ciphers-tab-component />
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import CiphersTabComponent from "./CiphersTab.vue";
import CodesTabComponent from "./CodesTab.vue";

@Component({
  components: {
    CodesTabComponent,
    CiphersTabComponent,
  }
})
export default class App extends Vue {

}
</script>
