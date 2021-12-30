import Vue from 'vue'
import VueRouter from 'vue-router'

import IndexView from './views/IndexView.vue'
import ResourcesSingleView from './views/ResourcesSingleView.vue'
import TagView from './views/TagView.vue'
import GlossaryView from './views/GlossaryView.vue'
import GlossarySingleView from './views/GlossarySingleView.vue'
import ResourcesQueueView from './views/ResourcesQueueView.vue'

Vue.use(VueRouter)

const routes = {
  resources: [
    {
      name: 'index',
      path: '/',
      component: IndexView
    }, {
      name: 'tag',
      path: '/tags/:id',
      component: TagView
    }, {
      name: 'single',
      path: '/:id',
      component: ResourcesSingleView
    }
  ],
  glossary: [
    {
      name: 'index',
      path: '/',
      component: GlossaryView
    }, {
      name: 'letter',
      path: '/:letter',
      component: GlossaryView
    }, {
      name: 'single',
      path: '/:letter/:id',
      component: GlossaryView
    }
  ],
  'glossary-single': [
    {
      name: 'index',
      path: '/',
      component: GlossarySingleView
    }
  ],
  'resources-queue': [
    {
      name: 'index',
      path: '/',
      component: ResourcesQueueView
    }, {
      name: 'single',
      path: '/:id',
      component: ResourcesSingleView
    }
  ]
}

const router = (display) => new VueRouter({
  mode: 'hash',
  routes: routes[display]
})

export default router
