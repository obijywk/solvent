<template>
  <div id="caesar-shifter">
    <ul>
      <li
        v-for="(s, index) in outputStrings"
        :key="index"
        :class="{ 'highlight': index === bestOutputStringIndex }"
      >
        <span class="shiftAmount">{{ index }}</span>{{ s }}
      </li>
    </ul>
  </div>
</template>

<style>
#caesar-shifter ul {
  list-style-type: none;
  padding-left: 0;
}
#caesar-shifter ul li.highlight {
  font-weight: bold;
}
.shiftAmount {
  display: inline-block;
  min-width: 24px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { SCORE_ENGLISH_URL, ScoreEnglishRequest, ScoreEnglishResponse } from "../api/score_english";

@Component
export default class CaesarShifter extends Vue {
  @Prop()
  public inputString: string;

  private outputStrings: string[] = [];
  private bestOutputStringIndex: number = -1;

  public update() {
    const strippedInputString = this.inputString.toUpperCase().replace(/[^A-Z ]/g, "");
    this.outputStrings = [];
    this.bestOutputStringIndex = -1;
    for (let shift = 0; shift < 26; shift++) {
      let outputString = "";
      for (let i = 0; i < strippedInputString.length; i++) {
        if (strippedInputString[i] === " ") {
          outputString += " ";
          continue;
        }
        const inputCode = strippedInputString.charCodeAt(i);
        const outputCode = (((inputCode - 65) + shift) % 26) + 65;
        outputString += String.fromCharCode(outputCode);
      }
      this.outputStrings.push(outputString);
    }
    this.getScores();
  }

  private getScores() {
    const request: ScoreEnglishRequest = {
      texts: this.outputStrings,
    };
    fetch(SCORE_ENGLISH_URL, {
      body: JSON.stringify(request),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    }).then((response) => response.json())
    .then((response: ScoreEnglishResponse) => {
      const maxScore = Math.max(...response.scores);
      this.bestOutputStringIndex = response.scores.indexOf(maxScore);
    });
  }
}
</script>
