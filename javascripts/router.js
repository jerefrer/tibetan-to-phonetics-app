const routes = [
  { path: '/', component: ConvertPage },
  { path: '/compare', component: ComparePage },
  { path: '/settings', component: SettingsPage },
  {
    path: '/settings/:languageId',
    name: 'edit-setting',
    component: EditSettingPage
  },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({ routes, linkExactActiveClass: 'active' })
