const routes = [
  { path: '/', component: ConvertPage },
  { path: '/compare', component: ComparePage },
  {
    path: '/settings/:tab',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/settings/:languageId/:tab',
    name: 'edit-setting',
    component: EditSettingPage
  },
  { path: '/settings', redirect: '/settings/rules' },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({ routes, linkExactActiveClass: 'active' })
