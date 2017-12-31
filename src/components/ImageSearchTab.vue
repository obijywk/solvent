<template>
  <div id="image-search-tab-container">
    <div>
      <input type="file" ref="fileInput" @change="handleFileInputChange()" />
      <v-btn @click="search()">Search</v-btn>
    </div>
    <div id="image-search-image-container">
      <img ref="image" />
    </div>
    <div>
      <img ref="croppedImage" />
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

@Component
export default class ImageSearchTab extends Vue {
  private cropper: Cropper | null = null;

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
    croppedImage.src = canvas.toDataURL();
  }
}
</script>
