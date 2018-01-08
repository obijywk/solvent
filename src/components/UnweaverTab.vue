<template>
  <div id="unweaver-tab-container">
    <div id="unweaver-tab-text-container">
      <v-text-field
        label="Text"
        hide-details
        v-model="text"
        v-on:keyup.enter="unweave()"
      />
    </div>

    <div id="unweaver-tab-text-container">
      <v-text-field
        label="Number of words"
        hide-details
        v-model="numWords"
        :rules="[isNumeric]"
        v-on:keyup.enter="unweave()"
      />
    </div>

    <div id="unweaver-tab-buttons">
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear text</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clearResults">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Clear results</span>
      </v-tooltip>
      <div class="unweaver-slider-container">
        <div class="unweaver-slider-label">
          State space<br>limit
        </div>
        <v-slider
          class="unweaver-slider"
          v-model="stateSpaceLimit"
          min="1000"
          max="25000"
          step="1000"
          thumb-label
        />
      </div>
      <div class="unweaver-slider-container">
        <div class="unweaver-slider-label">
          Max<br>results
        </div>
        <v-slider
          class="unweaver-slider"
          v-model="maxResults"
          min="10"
          max="500"
          thumb-label
        />
      </div>
      <v-btn @click="unweave()">
        Unweave
      </v-btn>
    </div>

    <div id="unweaver-results">
      <div id="unweaver-progress" v-if="state === State.RUNNING">
        <v-progress-circular indeterminate v-bind:size="64" color="primary" />
      </div>
      <v-data-table
        :headers="headers"
        :items="results"
        hide-actions
        id="unweaver-tab-table"
        v-if="state === State.RESULTS"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.cost }}</td>
          <td>{{ props.item.words.join(" ") }}</td>
        </template>
      </v-data-table>
      <div
        id="unweaver-instructions"
        v-if="state === State.INSTRUCTIONS"
      >
        <p>
          The unweaver can be used to separate words that have been "interwoven" into a single
          ordered sequence of letters. For example, TFMTHUREUOSDRISNDDDAAAYAYYY can be separated
          into the words THURSDAY, FRIDAY, MONDAY and TUESDAY.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
#unweaver-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
}
#unweaver-tab-text-container {
  flex: none;
}
#unweaver-tab-buttons {
  flex: none;
  display: flex;
  align-items: center;
}
.unweaver-slider-container {
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.unweaver-slider-label {
  text-align: center;
}
.unweaver-slider {
  flex: 1;
  margin-left: 16px;
  max-width: 200px;
}
#unweaver-results {
  display: flex;
  justify-content: center;
}
#unweaver-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
}
#unweaver-instructions {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import {
  UNWEAVE_URL,
  UnweaveRequest,
  UnweaveResponse,
  UnweaveResult,
} from "../api/unweave";
import { apiFetch } from "../client/api_fetch";

enum State {
  INSTRUCTIONS,
  RUNNING,
  RESULTS,
}

@Component
export default class UnweaverTab extends Vue {
  private text: string = "";
  private numWords: string = "10";
  private stateSpaceLimit: number = 10000;
  private maxResults: number = 100;
  private results: UnweaveResult[] = [];

  private State = State;
  private state: State = State.INSTRUCTIONS;

  private headers = [
    { text: "Cost", value: "cost", align: "left", sortable: false },
    { text: "Words", value: "words", align: "left", sortable: false },
  ];

  private clear() {
    this.text = "";
    this.clearResults();
  }

  private clearResults() {
    this.results = [];
    this.state = State.INSTRUCTIONS;
  }

  private isNumeric(input: string): boolean | string {
    if (/^\d+$/.test(input)) {
      return true;
    }
    return "Must be a number.";
  }

  private unweave() {
    const request: Partial<UnweaveRequest> = {
      maxResults: this.maxResults,
      numWords: parseInt(this.numWords, 10),
      stateSpaceLimit: this.stateSpaceLimit,
      text: this.text,
    };
    this.state = State.RUNNING;
    apiFetch<UnweaveResponse>(UNWEAVE_URL, request).then((response) => {
      this.results = response.results;
      this.state = State.RESULTS;
    }).catch((err: Error) => {
      this.results = [];
      this.state = State.INSTRUCTIONS;
      this.$emit("error", err.message);
    });
  }
}
</script>
