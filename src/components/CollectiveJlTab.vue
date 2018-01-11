<template>
  <div id="collective-jl-tab-container">
    <p class="credits">
      Powered by
      <a href="https://github.com/rdeits/Collective.jl" target="_blank">Collective.jl</a>
      by Robin Deits.
    </p>

    <div id="collective-jl-tab-text-container">
      <v-text-field
        id="collective-jl-tab-text"
        label="Words (separated by spaces)"
        hide-details
        v-model="text"
        v-on:keyup.enter="analyze()"
      />
    </div>

    <div id="collective-jl-tab-buttons">
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear text</span>
      </v-tooltip>
      <div id="collective-jl-allowed-misses-slider-container">
        <div id="collective-jl-allowed-misses-slider-label">
          Allowed<br>misses
        </div>
        <v-slider
          id="collective-jl-allowed-misses-slider"
          v-model="allowedMisses"
          v-bind:max="wordCount"
          thumb-label
          step="1"
          ticks
        />
      </div>
      <v-btn @click="analyze()">
        Analyze
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="results"
      hide-actions
      id="collective-jl-tab-table"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.probability }}</td>
        <td>{{ props.item.description }}</td>
        <td>{{ props.item.satisfied.join(" ") }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<style>
#collective-jl-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
}
#collective-jl-tab-text-container {
  flex: none;
}
#collective-jl-tab-buttons {
  flex: none;
  display: flex;
  align-items: center;
}
#collective-jl-allowed-misses-slider-container {
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#collective-jl-allowed-misses-slider-label {
  text-align: center;
}
#collective-jl-allowed-misses-slider {
  flex: 1;
  margin-left: 16px;
  max-width: 200px;
}
#collective-jl-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import {
  ANALYZE_WITH_COLLECTIVE_JL_URL,
  AnalyzeWithCollectiveJlRequest,
  AnalyzeWithCollectiveJlResponse,
  AnalyzeWithCollectiveJlResult,
} from "../api/analyze_with_collective_jl";
import { apiFetch } from "../client/api_fetch";

declare const gtag: any;

@Component
export default class CollectiveJlTab extends Vue {
  private text: string = "";
  private allowedMisses: number = 0;
  private results: AnalyzeWithCollectiveJlResult[] = [];

  private headers = [
    { text: "Probability", value: "probability", align: "left", sortable: false },
    { text: "Feature Description", value: "description", align: "left", sortable: false },
    { text: "Words with Feature", value: "satisfied", align: "left", sortable: false },
  ];

  private clear() {
    this.text = "";
  }

  get words(): string[] {
    return this.text.replace(/\n/g, " ").split(" ");
  }

  get wordCount(): number {
    return this.words.length;
  }

  private analyze() {
    const request: AnalyzeWithCollectiveJlRequest = {
      allowedMisses: this.allowedMisses,
      words: this.words,
    };
    apiFetch<AnalyzeWithCollectiveJlResponse>(ANALYZE_WITH_COLLECTIVE_JL_URL, request).then((response) => {
      this.results = response.results;
    }).catch((err: Error) => {
      this.$emit("error", err.message);
    });
    gtag("event", "analyze_with_collective_jl");
  }
}
</script>
