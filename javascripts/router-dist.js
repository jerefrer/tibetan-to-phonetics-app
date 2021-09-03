"use strict";

var routes = [{
  path: '/',
  component: ConvertPage
}, {
  path: '/compare',
  component: ComparePage
}, {
  path: '/settings',
  name: 'settings',
  component: SettingsPage
}, {
  path: '/exceptions',
  name: 'general-exceptions',
  component: SettingsPage
}, {
  path: '/settings/:settingId/:tab',
  name: 'edit-setting',
  component: EditSettingPage
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