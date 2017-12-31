import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import "cropperjs/dist/cropper.min.css";

import AppComponent from "./components/App.vue";

Vue.use(Vuetify);

const vue = new Vue({
  components: {
    AppComponent,
  },
  el: "#app",
  template: "<app-component />",
});
