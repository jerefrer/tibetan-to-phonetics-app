const routes = [
  { path: '/', component: ConvertPage },
  { path: '/tests', component: TestsPage },
  { path: '/compare', component: ComparePage },
  { path: '/settings', component: SettingsPage },
  {
    path: '/settings/:languageId',
    name: 'edit-setting',
    component: EditSettingPage
  }
]

const router = new VueRouter({ routes, linkExactActiveClass: 'active' })
