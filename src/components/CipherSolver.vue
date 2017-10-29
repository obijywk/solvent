<template>
  <div id="cipher-solver">
    <div id="cipher-solver-progress" v-if="solving">
      <v-progress-circular indeterminate v-bind:size="64" color="primary" />
    </div>
    <v-data-table
      :headers="headers"
      :items="results"
      hide-actions
      v-if="!solving"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.score }}</td>
        <td>{{ props.item.plaintext }}</td>
        <td>{{ props.item.key }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<style>
#cipher-solver {
  display: flex;
  justify-content: center;
}
#cipher-solver-progress {
  margin-top: 32px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { SOLVE_CIPHER_URL, SolveCipherRequest, SolveCipherResponse, SolveCipherResult } from "../api/solve_cipher";

@Component
export default class CipherSolver extends Vue {
  @Prop()
  public inputString: string;

  private solving: boolean = false;
  private results: SolveCipherResult[] = [];

  private headers = [
    { text: "Score", value: "score", align: "left", sortable: false },
    { text: "Plaintext", value: "plaintext", align: "left", sortable: false },
    { text: "Key", value: "key", align: "left", sortable: false },
  ];

  public update() {
    this.solving = true;
    const request: SolveCipherRequest = {
      ciphertext: this.inputString,
      iterations: 2000,
    };
    fetch(SOLVE_CIPHER_URL, {
      body: JSON.stringify(request),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    }).then((response) => response.json())
    .then((response: SolveCipherResponse) => {
      this.results = response.results;
      this.solving = false;
    });
  }
}
</script>
