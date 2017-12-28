<template>
  <div id="clues-tab-container">
    <p class="credits">
      <a href="https://github.com/donohoe/nyt-crossword" target="_blank">
      New York Times crossword puzzle data</a> archived by Michael Donohoe.
    </p>

    <div id="clues-tab-text-container">
      <v-text-field
        id="clues-tab-text"
        label="Query"
        hide-details
        v-model="query"
        v-on:keyup.enter="search()"
      />
    </div>

    <div id="clues-tab-answer-pattern-container">
      <v-text-field
        id="clues-tab-answer-pattern"
        label="Answer Letters (use '_' for any letter, and '%' for any number of letters)"
        hide-details
        v-model="answerPattern"
        v-on:keyup.enter="search()"
      />
    </div>

    <div id="clues-tab-buttons">
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clear">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Clear query</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clearResults">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Clear results</span>
      </v-tooltip>
      <div class="clues-slider-container">
        <div class="clues-slider-label">
          Max<br>results
        </div>
        <v-slider
          class="clues-slider"
          v-model="maxResults"
          min="10"
          max="500"
          thumb-label
        />
      </div>
      <v-btn @click="search()">
        Search
      </v-btn>
    </div>

    <div id="clues-results">
      <div id="clues-progress" v-if="state === State.RUNNING">
        <v-progress-circular indeterminate v-bind:size="64" color="primary" />
      </div>
      <v-data-table
        :items="results"
        hide-actions
        hide-headers
        id="clues-tab-table"
        v-if="state === State.RESULTS"
      >
        <template slot="items" slot-scope="props">
          <td class="hidden-sm-and-down">{{ props.item.source }}</td>
          <td class="hidden-sm-and-down">
            {{ formatDate(props.item.puzzleDate) }}
          </td>
          <td class="hidden-sm-and-down">{{ props.item.clueLabel }}</td>
          <td>{{ props.item.question }}</td>
          <td>{{ props.item.answer }}</td>
        </template>
      </v-data-table>
      <div
        id="clues-instructions"
        v-if="state === State.INSTRUCTIONS"
      >
        <p>
          The clue database may be queried using
          <a href="https://sqlite.org/fts5.html#full_text_query_syntax" target="_blank">
          SQLite FTS5 query syntax</a>.

          The field containing the clue is named <i>question</i> and the field
          containing the answer to the clue is named <i>answer</i>.
        </p>
        <p>
          A few example queries:
        </p>
        <p>
          <ul>
            <li>pepsi</li>
            <li>cola</li>
            <li>question: pepsi</li>
            <li>question: pepsi OR coca</li>
            <li>answer: cola</li>
          </ul>
        </p>
        <p>
          Additionally, answer letters may be restricted by providing a
          <a href="https://www.w3schools.com/sql/sql_like.asp" target="_blank">
          SQL LIKE pattern</a> (where '_' matches any letter, and '%' matches any number of letters).
        </p>
      </div>
    </div>
  </div>
</template>

<style>
#clues-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
}
#clues-tab-text-container {
  flex: none;
}
#clues-tab-buttons {
  flex: none;
  display: flex;
  align-items: center;
}
.clues-slider-container {
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.clues-slider-label {
  text-align: center;
}
.clues-slider {
  flex: 1;
  margin-left: 16px;
  max-width: 200px;
}
#clues-results {
  display: flex;
  justify-content: center;
}
#clues-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
}
#clues-instructions {
  width: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import {
  SEARCH_CLUES_URL,
  SearchCluesRequest,
  SearchCluesResponse,
  SearchCluesResult,
} from "../api/search_clues";

enum State {
  INSTRUCTIONS,
  RUNNING,
  RESULTS,
}

@Component
export default class CluesTab extends Vue {
  private maxResults: number = 100;
  private query: string = "";
  private answerPattern: string = "";
  private results: SearchCluesResult[] = [];

  private State = State;
  private state: State = State.INSTRUCTIONS;

  private formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  private clear() {
    this.query = "";
    this.answerPattern = "";
    this.clearResults();
  }

  private clearResults() {
    this.results = [];
    this.state = State.INSTRUCTIONS;
  }

  private search() {
    const request: Partial<SearchCluesRequest> = {
      maxResults: this.maxResults,
      query: this.query,
    };
    if (this.answerPattern) {
      request.answerPattern = this.answerPattern;
    }
    this.state = State.RUNNING;
    fetch(SEARCH_CLUES_URL, {
      body: JSON.stringify(request),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    }).then((response) => response.json())
    .then((response: SearchCluesResponse) => {
      this.results = response.results;
      this.state = State.RESULTS;
    }).catch((error) => {
      this.results = [];
      this.state = State.INSTRUCTIONS;
    });
  }
}
</script>
