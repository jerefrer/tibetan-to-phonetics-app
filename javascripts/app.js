var app;

var initializeStorage = function(callback) {
  var nbReady = 0;
  var callbackIfReady = function() {
    nbReady++;
    if (nbReady >= 2)
      callback();
  }
  Settings.initializeFromStorage(callbackIfReady);
  Storage.get('ignoreGeneralExceptionsStorage', false, (value) => {
    ignoreGeneralExceptionsStorage = value;
    if (ignoreGeneralExceptionsStorage) {
      Exceptions.initializeFromDefaults();
      callbackIfReady();
    } else
      Exceptions.initializeFromStorage(callbackIfReady);
  });
}

$(function() {
  if (Storage.localStorageSupported()) {
    var colorMode = Storage.localStorageGet('colorMode');
    $('body').addClass(colorMode);
  }
})

initializeStorage(() => {

  app = new Vue({
    router,
    store,
    data () {
      return {
        colorMode: undefined
      }
    },
    watch: {
      colorMode (value) {
        if (value == 'day') {
          $('body').addClass('day');
          $('body').removeClass('night');
        } else {
          $('body').addClass('night');
          $('body').removeClass('day');
        }
        localforage.setItem('colorMode', value)
        if (Storage.localStorageSupported())
          Storage.localStorageSet('colorMode', value)
      }
    },
    methods: {
      toggleColorMode () {
        this.colorMode = this.colorMode == 'night' ? 'day' : 'night';
      },
      toggleSidebar () {
        $('.sidebar').sidebar('toggle');
      }
    },
    created () {
      var defaultColorMode = 'day';
      localforage.getItem('colorMode')
        .then ((value) => this.colorMode = value || defaultColorMode)
        .catch((error) => this.colorMode = defaultColorMode)
    },
    mounted () {
      $('.sidebar').sidebar('setting', 'transition', 'overlay');
      $('.sidebar .item').click(() => $('.sidebar').sidebar('hide'));
      setTimeout(() => $('#loading-overlay').fadeOut(), 500);
    },
    template: `
      <div id="app">

        <div
          class="ui left vertical sidebar labeled icon menu"
          :class="{inverted: colorMode == 'night'}"
        >
          <div class="item logo">
            <img src="favicon.png" />
          </div>
          <router-link class="item" to="/">
            <i class="arrow right icon"></i>
            Convert
          </router-link>
          <router-link class="item" to="/compare">
            <i class="fa fa-not-equal icon"></i>
            Compare
          </router-link>
          <router-link
            class="item" to="/settings"
            :class="{active: $route.name && ($route.name.match(/setting/) || $route.name.match(/exceptions/))}"
          >
            <i class="cogs icon"></i>
            Settings
          </router-link>
        </div>

        <div class="pusher">

          <button
            id="menu-button"
            class="circular ui icon button"
            @click="toggleSidebar"
          >
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
  }).$mount('#app');

});
