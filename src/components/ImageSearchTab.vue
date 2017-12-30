<template>
  <div id="image-search-tab-container">
    <input type="file" ref="fileInput" @change="handleFileInputChange()" />
    <div id="image-search-canvas-container">
      <canvas ref="canvas" />
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
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class ImageSearchTab extends Vue {
  private handleFileInputChange() {
    const fileInput = this.$refs.fileInput as HTMLInputElement;
    if (fileInput.files === null || fileInput.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
          return;
        }
        ctx.drawImage(image, 0, 0);
      };
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}
</script>
