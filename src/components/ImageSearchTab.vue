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
      <div class="hidden-sm-and-down">
        Or drag an image here from another tab.
      </div>
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
        :items="entityResults"
        hide-actions
        id="image-search-entity-table"
        v-if="state === State.RESULTS"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.score }}</td>
          <td>{{ props.item.description }}</td>
        </template>
      </v-data-table>
      <v-data-table
        :items="pageResults"
        hide-headers
        hide-actions
        id="image-search-page-table"
        v-if="state === State.RESULTS"
        class="hidden-sm-and-down"
      >
        <template slot="items" slot-scope="props">
          <td><a :href="props.item" target="_blank">{{ props.item }}</a></td>
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
  margin-bottom: 32px;
}
#image-search-entity-table {
  overflow-y: auto;
}
#image-search-page-table {
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

const Cropper = require("cropperjs");

import {
  EntityResult,
  RUN_WEB_DETECTION_URL,
  RunWebDetectionRequest,
  RunWebDetectionResponse,
} from "../api/run_web_detection";
import { apiFetch } from "../client/api_fetch";

import { ErrorResponse } from "../api/error_response";

declare const gtag: any;

enum State {
  RUNNING,
  RESULTS,
}

const MAX_IMAGE_SIZE = 800;

@Component
export default class ImageSearchTab extends Vue {
  private cropper: Cropper | null = null;
  private entityResults: EntityResult[] = [];
  private pageResults: string[] = [];

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
    gtag("event", "image_search_file_input");
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
          gtag("event", "image_search_drag");
        }
      });
    });
  }

  private handleFileDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private handleFileDragEnd(event: DragEvent) {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer != null &&
        dataTransfer.items != null &&
        dataTransfer.items) {
      for (let i = 0; i < dataTransfer.items.length; i++) {
        dataTransfer.items.remove(i);
      }
    }
  }

  private loadFile(file: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      this.setImageSrc(<string>(reader.result));
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
    this.entityResults = [];
    this.pageResults = [];
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
    let canvas = this.cropper.getCroppedCanvas();

    if (canvas.width > MAX_IMAGE_SIZE || canvas.height > MAX_IMAGE_SIZE) {
      const smallCanvas = document.createElement("canvas");
      const smallCtx = smallCanvas.getContext("2d");
      if (smallCtx === null) {
        return;
      }
      let ratio: number;
      if (canvas.width > canvas.height) {
        ratio = MAX_IMAGE_SIZE / canvas.width;
      } else {
        ratio = MAX_IMAGE_SIZE / canvas.height;
      }
      smallCanvas.width = canvas.width * ratio;
      smallCanvas.height = canvas.height * ratio;
      smallCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, smallCanvas.width, smallCanvas.height);
      canvas = smallCanvas;
    }

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
      this.entityResults = response.entityResults;
      this.pageResults = response.pageResults;
      this.state = State.RESULTS;
    }).catch((err: Error) => {
      this.entityResults = [];
      this.pageResults = [];
      this.state = State.RESULTS;
      this.$emit("error", err.message);
    });
    gtag("event", "image_search");
  }
}
</script>
