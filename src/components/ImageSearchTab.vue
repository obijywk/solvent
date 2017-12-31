<template>
  <div id="image-search-tab-container">
    <div>
      <input type="file" ref="fileInput" @change="handleFileInputChange()" />
      <v-btn @click="search()">Search</v-btn>
    </div>
    <div id="image-search-image-container">
      <img ref="image" />
    </div>
    <div id="image-search-results">
      <div id="image-search-progress" v-if="state === State.RUNNING">
        <v-progress-circular indeterminate v-bind:size="64" color="primary" />
      </div>
      <v-data-table
        :headers="headers"
        :items="results"
        hide-actions
        id="image-search-tab-table"
        v-if="state === State.RESULTS"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.score }}</td>
          <td>{{ props.item.description }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<style>
#image-search-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  overflow-y: scroll;
}
#image-search-image-container img {
  max-width: 100%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import * as Cropper from "cropperjs";

import {
  RUN_WEB_DETECTION_URL,
  RunWebDetectionRequest,
  RunWebDetectionResponse,
  RunWebDetectionResult,
} from "../api/run_web_detection";
import { apiFetch } from "../client/api_fetch";

enum State {
  RUNNING,
  RESULTS,
}

@Component
export default class ImageSearchTab extends Vue {
  private cropper: Cropper | null = null;
  private results: RunWebDetectionResult[] = [];

  private State = State;
  private state: State = State.RESULTS;

  private headers = [
    { text: "Score", value: "score", align: "left", sortable: false },
    { text: "Description", value: "description", align: "left", sortable: false },
  ];

  private handleFileInputChange() {
    const fileInput = this.$refs.fileInput as HTMLInputElement;
    if (fileInput.files === null || fileInput.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = this.$refs.image as HTMLImageElement;
      image.src = reader.result;
      image.onload = () => {
        this.cropper = new Cropper(image, {
          autoCrop: false,
          viewMode: 1,
          zoomable: false,
        });
      };
    };
    reader.readAsDataURL(fileInput.files[0]);
  }

  private search() {
    if (this.cropper === null) {
      return;
    }
    const canvas = this.cropper.getCroppedCanvas();
    const croppedImage = this.$refs.croppedImage as HTMLImageElement;
    const dataUrl = canvas.toDataURL();

    const request: RunWebDetectionRequest = {
      imageContent: dataUrl,
    };
    this.state = State.RUNNING;
    apiFetch<RunWebDetectionResponse>(RUN_WEB_DETECTION_URL, request).then((response) => {
      this.results = response.results;
      this.state = State.RESULTS;
    }).catch((err: Error) => {
      this.results = [];
      this.state = State.RESULTS;
      this.$emit("error", err.message);
    });
  }
}
</script>
