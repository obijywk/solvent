import Vue from "vue";

let v = new Vue({
  el: "#app",
  template: `
  <div>
    Hello {{ name }}!
  </div>
  `,
  data: {
    name: "World"
  }
});
