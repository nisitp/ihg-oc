<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <div v-else-if="error" class="error">
      The requested resource was not found.
    </div>

    <template v-else>
      <router-link class="back" :to="{name: 'index'}">&laquo; Back</router-link>

      <resource
        class="resource"
        :resource="resource"
        :single="true"
      />
    </template>
  </div>
</template>

<script>
import Resource from '../components/Resource.vue'
import { getResource } from '../api'

export default {
  name: 'single',
  components: {
    Resource
  },
  data () {
    return {
      loading: true,
      error: false,
      resource: null
    }
  },
  watch: {
    $route () {
      this.loadResource()
    }
  },
  mounted () {
    this.loadResource()
  },
  methods: {
    async loadResource () {
      this.loading = true
      this.error = false

      this.resource = await getResource(this.$route.params.id)

      if (this.resource === null) {
        this.error = true
      }

      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    position: relative;
    color: $color-primary !important; // Override Salesforce
    text-decoration: none;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 30px;
    display: inline-block;

    &:hover {
      color: darken($color-primary, 10%) !important; // Override Salesforce
      text-decoration: none !important; // Override Salesforce

      &:after {
        background-color: darken($color-green, 5%);
      }
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: $color-green;
    }
  }
</style>
