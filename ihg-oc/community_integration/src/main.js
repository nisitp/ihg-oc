import Vue from 'vue'
import router from './router'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false

try {
  const init = (el, token, display, args) => {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token

    new Vue({
      router: router(display),
      render: h => h(App, { props: { args: args } })
    }).$mount(el)
  }

  if (process.env.NODE_ENV === 'development') {
    init(
      document.querySelector('#owners-community-integration'),
      process.env.VUE_APP_TOKEN,
      process.env.VUE_APP_DISPLAY,
      process.env.VUE_APP_ARGS
    )
  } else {
    window.setInterval(() => {
      const element = document.querySelector('lightning-formatted-rich-text')

      if (element && /data-token="/.test(element.value)) {
        const newElement = document.createElement('div')
        newElement.innerHTML = element.value
        element.parentNode.insertBefore(newElement, element)
        element.value = ''
      }
    }, 500)

    window.setInterval(() => {
      const elements = document.querySelectorAll('#owners-community-integration:not([data-initialized])')
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        init(
          element,
          element.dataset.token,
          typeof element.dataset.display !== 'undefined'
            ? element.dataset.display
            : 'resources',
          typeof element.dataset.args !== 'undefined'
            ? element.dataset.args
            : ''
        )
      }
    }, 100)
  }
} catch (e) {
  if (process.env.NODE_ENV === 'development') {
    console.error(e)
  }
}
