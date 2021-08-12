"use strict";

var routes = [{
  path: '/',
  component: ConvertPage
}, {
  path: '/compare',
  component: ComparePage
}, {
  path: '/settings',
  component: SettingsPage
}, {
  path: '/settings/:languageId',
  name: 'edit-setting',
  component: EditSettingPage
}, {
  path: '*',
  redirect: '/'
}];
var router = new VueRouter({
  routes: routes,
  linkExactActiveClass: 'active'
});