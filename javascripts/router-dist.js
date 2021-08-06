"use strict";

var routes = [{
  path: '/',
  component: Homepage
}, {
  path: '/tests',
  component: TestsPage
}, {
  path: '/compare',
  component: ComparePage
}];
var router = new VueRouter({
  routes: routes
});
var app = new Vue({
  router: router
}).$mount('#app');
setTimeout(function () {
  app.$router.afterEach(function (to, from) {
    return $('.sidebar').sidebar('hide');
  });
}, 1000);