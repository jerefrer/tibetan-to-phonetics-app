const app = new Vue({
  router,
  data () {
    return {
      colorMode: Storage.get('colorMode') || 'day'
    }
  },
  watch: {
    colorMode (value) {
      Storage.set('colorMode', value);
    }
  },
  methods: {
    toggleColorMode () {
      this.colorMode = this.colorMode == 'night' ? 'day' : 'night';
    }
  },
  template: `
    <div id="app" :class="colorMode">

      <div
        class="ui left vertical sidebar labeled icon menu"
        :class="{inverted: colorMode == 'night'}"
      >
        <router-link class="item" to="/">
          <i class="arrow right icon"></i>
          Convert
        </router-link>
        <router-link class="item" to="/compare">
          <i class="fa fa-not-equal icon"></i>
          Compare
        </router-link>
        <router-link class="item" to="/settings">
          <i class="cogs icon"></i>
          Settings
        </router-link>
        <router-link class="item" to="/tests">
          <i class="flask icon"></i>
          Tests
        </router-link>
      </div>

      <div class="pusher">

        <button id="menu-button" class="circular ui icon button">
          <i class="bars icon"></i>
        </button>

        <button
          id="color-mode-button"
          class="circular ui icon button"
          @click="toggleColorMode"
        >
          <i class="adjust icon"></i>
        </button>

        <transition name="fade" mode="out-in" appear>
          <router-view></router-view>
        </transition>

      </div>

    </div>
  `
}).$mount('#app')
