const routes = [
  { path: '/', component: ConvertPage },
  { path: '/compare', component: ComparePage },
  {
    path: '/settings/:tab',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/settings/:rulesetId/:tab',
    name: 'edit-setting',
    component: EditSettingPage
  },
  { path: '/settings', redirect: '/settings/rules' },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (savedPosition)
          resolve(savedPosition);
        else
          resolve({ x: 0, y: 0 });
      }, 500)
    })
  }
})
