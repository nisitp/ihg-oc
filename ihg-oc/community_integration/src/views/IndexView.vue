<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <template v-else>
      <category-nav
        class="category-nav"
        :categories="resourceCategories"
        :activeCategoryId.sync="activeCategoryId"
      />

      <div class="filters">
        <source-filter
          class="filters__source-filter"
          :sources="sources"
          :activeSources.sync="activeSources"
        />
        <a
          class="filters__reset"
          href="#"
          @click.prevent="resetFilters()"
        >Reset</a>
      </div>

      <p v-if="noResources">There are no resources that match your selected filters.</p>

      <transition-group name="list" tag="div">
        <resources
          class="resources"
          v-for="category in resourceCategories"
          :key="category.id"
          v-show="(activeCategoryId === null && category.resources.length > 0) || category.id === activeCategoryId"
          :title="category.name"
          :resources="category.resources"
          :grid="activeCategoryId !== null"
          @viewAll="activeCategoryId = category.id"
        />
      </transition-group>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

import CategoryNav from '../components/CategoryNav.vue'
import Resources from '../components/Resources.vue'
import SourceFilter from '../components/SourceFilter.vue'

export default {
  name: 'index',
  components: {
    CategoryNav,
    Resources,
    SourceFilter
  },
  data () {
    return {
      loading: true,
      activeCategoryId: null,
      activeSources: [],
      categories: [],
      sources: [],
      tags: [],
      resources: []
    }
  },
  computed: {
    filteredResources () {
      return this.activeSources.length === 0
        ? this.resources
        : this.resources.filter(r => r.source && this.activeSources.includes(r.source.id))
    },
    resourceCategories () {
      return this.categories.map(c => ({
        ...c,
        resources: this.filteredResources.filter(r => r.categories.find(rc => rc.id === c.id))
      }))
    },
    activeCategory () {
      return this.activeCategoryId !== null
        ? this.resourceCategories.find(c => c.id === this.activeCategoryId)
        : null
    },
    noResources () {
      return this.activeCategoryId === null &&
        this.resourceCategories.find(c => c.resources.length > 0) === undefined
    }
  },
  mounted () {
    this.loading = true

    Promise
      .all([
        this.loadCategories(),
        this.loadSources(),
        this.loadTags()
      ])
      .then(() => this.loadResources())
      .then(() => {
        this.loading = false
      })
  },
  methods: {
    loadCategories () {
      return new Promise((resolve) => {
        axios
          .get('https://oc.hotsauceatl.com/api/v1/categories')
          .then((response) => {
            this.categories = []

            for (const category of response.data) {
              this.categories.push({
                id: category.id,
                name: category.name
              })
            }

            resolve()
          })
      })
    },
    loadSources () {
      return new Promise((resolve) => {
        axios
          .get('https://oc.hotsauceatl.com/api/v1/sources')
          .then((response) => {
            this.sources = []

            for (const source of response.data) {
              this.sources.push({
                id: source.id,
                name: source.name
              })
            }

            resolve()
          })
      })
    },
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
              const source = this.sources.find(s => s.id === resource.source)

              this.resources.push({
                id: resource.id,
                categories: this.categories.filter(t => resource.categories.split(',').includes(t.id)),
                source: source || null,
                tags: this.tags.filter(t => resource.tags.split(',').includes(t.id)),
                image: `https://oc.hotsauceatl.com${resource.image}`,
                title: _.unescape(resource.title),
                excerpt: _.unescape(resource.summary)
              })
            }

            resolve()
          })
      })
    },
    resetFilters () {
      this.activeSources = []
    }
  }
}
</script>

<style lang="scss" scoped>
  .category-nav {
    margin-bottom: 30px;
  }

  .filters {
    display: flex;
    align-items: center;
    margin-bottom: 80px;

    &__source-filter {
      margin-right: 40px;
    }

    &__reset {
      position: relative;
      color: $color-primary !important; // Override Salesforce
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;

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
  }

  .resources {
    margin-bottom: 80px;

    &:last-child {
      margin-bottom: 30px;
    }
  }

  .list-enter-active, .list-leave-active {
    transition: all 500ms;
    transform-origin: 0 0;
    max-height: 2000px;
    overflow: hidden;
  }

  .list-enter, .list-leave-to {
    max-height: 0;
    margin-bottom: 0;
    opacity: 0.3;
  }
</style>
