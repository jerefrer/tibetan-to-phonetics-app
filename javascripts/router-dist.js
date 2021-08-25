"use strict";

var routes = [{
  path: '/',
  component: ConvertPage
}, {
  path: '/compare',
  component: ComparePage
}, {
  path: '/settings/:tab',
  name: 'settings',
  component: SettingsPage
}, {
  path: '/settings/:rulesetId/:tab',
  name: 'edit-setting',
  component: EditSettingPage
}, {
  path: '/settings',
  redirect: '/settings/rules'
}, {
  path: '*',
  redirect: '/'
}];
var router = new VueRouter({
  routes: routes,
  linkExactActiveClass: 'active',
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (savedPosition) resolve(savedPosition);else resolve({
          x: 0,
          y: 0
        });
      }, 500);
    });
  }
});