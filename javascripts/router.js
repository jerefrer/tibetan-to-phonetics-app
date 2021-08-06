const routes = [
  { path: '/', component: Homepage },
  { path: '/tests', component: Tests },
  { path: '/compare', component: Compare },
]

const router = new VueRouter({ routes })

const app = new Vue({
  router
}).$mount('#app')

setTimeout(() => {
  app.$router.afterEach((to, from) => $('.sidebar').sidebar('hide'))
}, 1000)