import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import AppComponent from "./components/App.vue";

Vue.use(Vuetify);

new Vue({
  el: "#app",
  template: "<app-component />",
  components: {
    AppComponent
  }
});
