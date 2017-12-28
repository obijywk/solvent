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
      id="cipher-solver-table"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.cost }}</td>
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
#cipher-solver-table {
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { SOLVE_CIPHER_URL, SolveCipherRequest, SolveCipherResponse, SolveCipherResult } from "../api/solve_cipher";
import { apiFetch } from "../client/api_fetch";

@Component
export default class CipherSolver extends Vue {
  @Prop()
  public inputString: string;

  private solving: boolean = false;
  private results: SolveCipherResult[] = [];

  private headers = [
    { text: "Cost", value: "cost", align: "left", sortable: false },
    { text: "Plaintext", value: "plaintext", align: "left", sortable: false },
    { text: "Key", value: "key", align: "left", sortable: false },
  ];

  public update() {
    this.solving = true;
    const request: SolveCipherRequest = {
      ciphertext: this.inputString,
      iterations: 2000,
    };
    apiFetch<SolveCipherResponse>(SOLVE_CIPHER_URL, request).then((response) => {
      this.results = response.results;
      this.solving = false;
    }).catch((err: Error) => {
      this.results = [];
      this.solving = false;
      this.$emit("error", err.message);
    });
  }
}
</script>
