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
      <v-tooltip top>
        <v-btn slot="activator" fab small color="error" @click="clearResults">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Clear results</span>
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
      <div id="nutrimatic-progress" v-if="state === State.RUNNING">
        <v-progress-circular indeterminate v-bind:size="64" color="primary" />
      </div>
      <v-data-table
        :headers="headers"
        :items="results"
        hide-actions
        id="nutrimatic-tab-table"
        v-if="state === State.RESULTS"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.score }}</td>
          <td>{{ props.item.text }}</td>
        </template>
      </v-data-table>
      <div
        id="nutrimatic-instructions"
        v-if="state === State.INSTRUCTIONS"
      >
        <div class="g">
          <div class="c">a-z 0-9 space</div>
          <div class="d">literal character</div>
        </div>
        <div class="g">
          <div class="c">.</div>
          <div class="d">any character</div>
        </div>
        <div class="g">
          <div class="c">-</div>
          <div class="d">optional space</div>
        </div>
        <div class="g">
          <div class="c">A</div>
          <div class="d">any letter</div>
        </div>
        <div class="g">
          <div class="c">#</div>
          <div class="d">any digit</div>
        </div>
        <div class="g">
          <div class="c">_</div>
          <div class="d">any letter or digit</div>
        </div>
        <div class="g">
          <div class="c">C</div>
          <div class="d">any consonant</div>
        </div>
        <div class="g">
          <div class="c">V</div>
          <div class="d">any vowel</div>
        </div>
        <div class="g">
          <div class="c">[ ]</div>
          <div class="d">
            <a href="https://www.regular-expressions.info/charclass.html" target="_blank">
              character class
            </a>
          </div>
        </div>
        <div class="g">
          <div class="c">( )</div>
          <div class="d">
            <a href="https://www.regular-expressions.info/brackets.html" target="_blank">
              group
            </a>
          </div>
        </div>
        <div class="g">
          <div class="c">|</div>
          <div class="d">
            <a href="https://www.regular-expressions.info/alternation.html" target="_blank">
              alternation
            </a>
          </div>
        </div>
        <div class="g">
          <div class="c">? * + {<span class="nb">min</span>,<span class="nb">max</span>}</div>
          <div class="d">
            <a href="https://www.regular-expressions.info/repeat.html" target="_blank">
              repetition
            </a>
          </div>
        </div>
        <div class="g">
          <div class="c">"<span class="nb">expr</span>"</div>
          <div class="d">no word breaks</div>
        </div>
        <div class="g">
          <div class="c"><span class="nb">expr</span>&amp;<span class="nb">expr</span></div>
          <div class="d">both must match</div>
        </div>
        <div class="g">
          <div class="c">&lt; &gt;</div>
          <div class="d">anagram</div>
        </div>
      </div>
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
  overflow-y: auto;
}
#nutrimatic-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
}
#nutrimatic-instructions {
  display: flex;
  flex-wrap: wrap;
}
#nutrimatic-instructions .g {
  border: 1px solid black;
  padding: 4px;
  margin: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#nutrimatic-instructions .g .c {
  font-size: 1.25em;
  font-weight: bold;
}
#nutrimatic-instructions .g .c .nb {
  font-weight: normal;
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
import { apiFetch } from "../client/api_fetch";

declare const gtag: any;

enum State {
  INSTRUCTIONS,
  RUNNING,
  RESULTS,
}

@Component
export default class NutrimaticTab extends Vue {
  private maxResults: number = 50;
  private maxSeconds: number = 2;
  private pattern: string = "";
  private results: SearchNutrimaticResult[] = [];

  private State = State;
  private state: State = State.INSTRUCTIONS;

  private headers = [
    { text: "Score", value: "score", align: "left", sortable: false },
    { text: "Text", value: "text", align: "left", sortable: false },
  ];

  private clear() {
    this.pattern = "";
    this.clearResults();
  }

  private clearResults() {
    this.results = [];
    this.state = State.INSTRUCTIONS;
  }

  private search() {
    const request: SearchNutrimaticRequest = {
      maxResults: this.maxResults,
      maxSeconds: this.maxSeconds,
      pattern: this.pattern,
    };
    this.state = State.RUNNING;
    apiFetch<SearchNutrimaticResponse>(SEARCH_NUTRIMATIC_URL, request).then((response) => {
      this.results = response.results;
      this.state = State.RESULTS;
    }).catch((err: Error) => {
      this.results = [];
      this.state = State.INSTRUCTIONS;
      this.$emit("error", err.message);
    });
    gtag("event", "search_nutrimatic");
  }
}
</script>
