<template>
  <div id="nutrimatic-tab-container">
    <p class="credits">
      Powered by
      <a href="https://nutrimatic.org" target="_blank">Nutrimatic</a>
      by Dan Egnor.
    </p>

    <div id="nutrimatic-tab-text-container">
      <v-text-field
        id="nutrimatic-tab-text"
        label="Pattern"
        hide-details
        v-model="pattern"
        v-on:keyup.enter="search()"
      />
    </div>

    <div id="nutrimatic-tab-buttons">
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear pattern</span>
      </v-tooltip>
      <div class="nutrimatic-slider-container hidden-sm-and-down">
        <div class="nutrimatic-slider-label">
          Max<br>results
        </div>
        <v-slider
          class="nutrimatic-slider"
          v-model="maxResults"
          min="10"
          max="500"
          thumb-label
        />
      </div>
      <div class="nutrimatic-slider-container">
        <div class="nutrimatic-slider-label">
          Max<br>seconds
        </div>
        <v-slider
          class="nutrimatic-slider"
          v-model="maxSeconds"
          min="1"
          max="15"
          thumb-label
        />
      </div>
      <v-btn @click="search()">
        Search
      </v-btn>
    </div>

    <div id="nutrimatic-results">
      <div id="nutrimatic-progress" v-if="running">
        <v-progress-circular indeterminate v-bind:size="64" color="primary" />
      </div>
      <v-data-table
        :headers="headers"
        :items="results"
        hide-actions
        id="nutrimatic-tab-table"
        v-if="!running"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.score }}</td>
          <td>{{ props.item.text }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<style>
#nutrimatic-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
}
#nutrimatic-tab-text-container {
  flex: none;
}
#nutrimatic-tab-buttons {
  flex: none;
  display: flex;
  align-items: center;
}
.nutrimatic-slider-container {
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.nutrimatic-slider-label {
  text-align: center;
}
.nutrimatic-slider {
  flex: 1;
  margin-left: 16px;
  max-width: 200px;
}
#nutrimatic-results {
  display: flex;
  justify-content: center;
}
#nutrimatic-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import {
  SEARCH_NUTRIMATIC_URL,
  SearchNutrimaticRequest,
  SearchNutrimaticResponse,
  SearchNutrimaticResult,
} from "../api/search_nutrimatic";

@Component
export default class NutrimaticTab extends Vue {
  private maxResults: number = 50;
  private maxSeconds: number = 2;
  private pattern: string = "";
  private results: SearchNutrimaticResult[] = [];
  private running: boolean = false;

  private headers = [
    { text: "Score", value: "score", align: "left", sortable: false },
    { text: "Text", value: "text", align: "left", sortable: false },
  ];

  private clear() {
    this.pattern = "";
  }

  private search() {
    const request: SearchNutrimaticRequest = {
      maxResults: this.maxResults,
      maxSeconds: this.maxSeconds,
      pattern: this.pattern,
    };
    this.running = true;
    fetch(SEARCH_NUTRIMATIC_URL, {
      body: JSON.stringify(request),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    }).then((response) => response.json())
    .then((response: SearchNutrimaticResponse) => {
      this.results = response.results;
      this.running = false;
    }).catch((error) => {
      this.results = [];
      this.running = false;
    });
  }
}
</script>
