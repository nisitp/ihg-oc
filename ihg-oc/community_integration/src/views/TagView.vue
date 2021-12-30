<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <div v-else-if="tag === undefined" class="error">
      The requested resource was not found.
    </div>

    <template v-else>
      <router-link class="back" :to="{name: 'index'}">&laquo; Back</router-link>

      <resources
        class="resources"
        :title="'Resources: #' + tag.name"
        :resources="filteredResources"
        :grid="true"
      />
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

import Resources from '../components/Resources.vue'

export default {
  name: 'index',
  components: {
    Resources
  },
  data () {
    return {
      loading: true,
      tags: [],
      resources: []
    }
  },
  computed: {
    tag () {
      return this.tags.find((tag) => tag.id === this.$route.params.id)
    },
    filteredResources () {
      return this.resources.filter(r => r.tags.find(rt => rt.id === this.tag.id))
    }
  },
  mounted () {
    this.loading = true

    Promise
      .all([
        this.loadTags()
      ])
      .then(() => this.loadResources())
      .then(() => {
        this.loading = false
      })
  },
  methods: {
    loadTags () {
      return new Promise((resolve) => {
        axios
          .get('https://oc.hotsauceatl.com/api/v1/tags')
          .then((response) => {
            this.tags = []

            for (const tag of response.data) {
              this.tags.push({
                id: tag.id,
                name: tag.name
              })
            }

            resolve()
          })
      })
    },
    loadResources () {
      return new Promise((resolve) => {
        axios
          .get('https://oc.hotsauceatl.com/api/v1/resources')
          .then((response) => {
            this.resources = []

            for (const resource of response.data) {
              this.resources.push({
                id: resource.id,
                tags: this.tags.filter(t => resource.tags.split(',').includes(t.id)),
                image: `https://oc.hotsauceatl.com${resource.image}`,
                title: _.unescape(resource.title),
                excerpt: _.unescape(resource.summary)
              })
            }

            resolve()
          })
      })
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

  .resources {
    margin-bottom: 80px;

    &:last-child {
      margin-bottom: 30px;
    }
  }
</style>
