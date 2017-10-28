<template>
  <div id="semaphore-picker-container">
    <svg width="256" height="256" id="semaphore-picker-svg">
      <circle
        cx="128" cy="32" r="24" stroke="black"
        v-for="flagPosition in flagPositions"
        :key="flagPosition.index"
        :transform="`rotate(${flagPosition.angle}, 128, 128)`"
        :class="flagPosition.cssClass()"
        @click="pickPosition(flagPosition)"
      />
      <g @click="pickSpace()">
        <circle
          cx="128" cy="128" r="24" stroke="black"
          :class="{ 'unpicked': !spaceLastSelected, 'last-picked': spaceLastSelected }"
        />
        <text
          x="128" y="140"
          font-family="Roboto" font-size="14"
          text-anchor="middle"
          cursor="pointer"
        >
          _
        </text>
      </g>
    </svg>
  </div>
</template>

<style>
#semaphore-picker-container {
  width: 100%;
}
#semaphore-picker-svg {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
#semaphore-picker-svg circle {
  cursor: pointer;
  transition: fill 0.25s;
}
#semaphore-picker-svg circle.unpicked {
  fill: white;
}
#semaphore-picker-svg circle.picked {
  fill: gold;
}
#semaphore-picker-svg circle.last-picked {
  fill: #ccc;
}
@media(hover:hover) {
  #semaphore-picker-svg circle.unpicked:hover,
  #semaphore-picker-svg g:hover circle.unpicked {
    fill: #ccc;
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Provide } from "vue-property-decorator";

class FlagPosition {
  public selected: boolean = false;
  public previouslySelected: boolean = false;

  constructor(public index: number, public angle: number) {
  }

  public cssClass() {
    if (this.selected) {
      return "picked";
    } else if (this.previouslySelected) {
      return "last-picked";
    } else {
      return "unpicked";
    }
  }
}

class FlagPositionPair {
  constructor(private a: FlagPosition, private b: FlagPosition) {
    if (a.index > b.index) {
      const temp = a;
      a = b;
      b = temp;
    }
  }

  public key(): string {
    return `${this.a.index}${this.b.index}`;
  }
}

const FLAG_POSITIONS: FlagPosition[] = [];
for (let i = 0; i < 8; i++) {
  const angle = i * 45;
  FLAG_POSITIONS.push(new FlagPosition(i, angle));
}

/* tslint:disable:object-literal-sort-keys */
const SEMAPHORE_TABLE: { [key: string]: string; } = {
  "45": "A",
  "46": "B",
  "47": "C",
  "04": "D",
  "14": "E",
  "24": "F",
  "34": "G",
  "56": "H",
  "57": "I",
  "02": "J",
  "05": "K",
  "15": "L",
  "25": "M",
  "35": "N",
  "67": "O",
  "06": "P",
  "16": "Q",
  "26": "R",
  "36": "S",
  "07": "T",
  "17": "U",
  "03": "V",
  "12": "W",
  "13": "X",
  "27": "Y",
  "23": "Z",
};
/* tslint:enable:object-literal-sort-keys */

@Component
export default class SemaphorePicker extends Vue {
  @Provide()
  private flagPositions: FlagPosition[] = FLAG_POSITIONS;

  private spaceLastSelected: boolean = false;

  private pickPosition(flagPosition: FlagPosition) {
    flagPosition.selected = !flagPosition.selected;
    this.maybeAddLetter();
  }

  private pickSpace() {
    this.$emit("addLetter", " ");
    this.updateSelections();
    this.spaceLastSelected = true;
  }

  private maybeAddLetter() {
    const pickedPositions = this.flagPositions.filter((flagPosition) => flagPosition.selected);
    if (pickedPositions.length !== 2) {
      return;
    }

    const pair = new FlagPositionPair(pickedPositions[0], pickedPositions[1]);
    const letter = SEMAPHORE_TABLE[pair.key()];
    if (letter) {
      this.$emit("addLetter", letter);
    }

    this.updateSelections();
  }

  private updateSelections() {
    this.spaceLastSelected = false;
    for (const flagPosition of this.flagPositions) {
      flagPosition.previouslySelected = false;
      if (flagPosition.selected) {
        flagPosition.selected = false;
        flagPosition.previouslySelected = true;
      }
    }
  }
}
</script>
