<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <resources
      v-else
      class="resources"
      :resources="resources"
      :grid="grid"
      :permalink="true"
    />
  </div>
</template>

<script>
import { getResourcesQueue } from '../api'

import Resources from '../components/Resources.vue'

export default {
  args: {
    type: String,
    default: ''
  },
  components: {
    Resources
  },
  data () {
    return {
      loading: true,
      resources: []
    }
  },
  computed: {
    queueName () {
      return this.$attrs.args.split('/')[0]
    },
    grid () {
      const args = this.$attrs.args.split('/')
      return args.length >= 2 && args[1] === 'grid'
    }
  },
  async mounted () {
    this.loading = true

    await this.loadResources()

    this.loading = false
  },
  methods: {
    async loadResources () {
      this.resources = await getResourcesQueue(this.queueName)
    }
  }
}
</script>
