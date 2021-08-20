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
  path: '/settings/:languageId/:tab',
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
  linkExactActiveClass: 'active'
});