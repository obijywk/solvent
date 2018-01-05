<template>
  <div
    id="image-search-tab-container"
    @drop="handleFileDrop($event)"
    @dragover="handleFileDragOver($event)"
    @dragend="handleFileDragEnd($event)"
  >
    <div id="image-search-tab-buttons">
      <input
        type="file"
        id="image-search-tab-file-input"
        ref="fileInput"
        @change="handleFileInputChange()"
      />
      <v-btn @click="search()">Search</v-btn>
    </div>
    <div id="image-search-image-container">
      <img ref="image" @load="handleImageLoad()" />
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
}
#image-search-tab-buttons {
  display: flex;
  align-items: center;
}
#image-search-tab-file-input {
  flex: 1;
}
#image-search-image-container {
  max-width: 100%;
  max-height: 50%;
}
#image-search-image-container img {
  max-width: 100%;
}
#image-search-results {
  display: flex;
  justify-content: center;
}
#image-search-tab-table {
  overflow-y: auto;
  margin-bottom: 32px;
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

import { ErrorResponse } from "../api/error_response";

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
    this.loadFile(fileInput.files[0]);
  }

  private handleFileDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !dataTransfer.items || dataTransfer.items.length === 0) {
      return;
    }
    dataTransfer.items[0].getAsString((uri) => {
      fetch("/api/http_fetch/" + window.btoa(uri)).then((response) => {
        if (!response.ok) {
          response.json().then((errorResponse: ErrorResponse) => {
            const errorDetails = [];
            for (const error of errorResponse.errors) {
              errorDetails.push(error.detail);
            }
            this.$emit("error", errorDetails.join(", "));
          });
        } else {
          response.blob().then(this.loadFile);
        }
      });
    });
  }

  private handleFileDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private handleFileDragEnd(event: DragEvent) {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.items) {
      for (let i = 0; i < dataTransfer.items.length; i++) {
        dataTransfer.items.remove(i);
      }
    }
  }

  private loadFile(file: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      this.setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }

  private setImageSrc(imageSrc: string) {
    if (this.cropper === null) {
      const image = this.$refs.image as HTMLImageElement;
      image.src = imageSrc;
    } else {
      this.cropper.replace(imageSrc);
    }
    this.results = [];
  }

  private handleImageLoad() {
    if (this.cropper === null) {
      const image = this.$refs.image as HTMLImageElement;
      this.cropper = new Cropper(image, {
        autoCrop: false,
        viewMode: 1,
        zoomable: false,
      });
    } else {
      this.cropper.reset();
      this.cropper.clear();
    }
  }

  private search() {
    if (this.cropper === null) {
      return;
    }
    const canvas = this.cropper.getCroppedCanvas({
      maxHeight: 800,
      maxWidth: 800,
    });
    const croppedImage = this.$refs.croppedImage as HTMLImageElement;
    const dataUrl = canvas.toDataURL();
    const matches = dataUrl.match(/^data:image\/[^;]+;base64,(.*)$/);
    if (matches === null || matches.length < 2) {
      this.$emit("error", "Failed to generate cropped image.");
      return;
    }
    const base64image = matches[1];

    const request: RunWebDetectionRequest = {
      imageContent: base64image,
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
