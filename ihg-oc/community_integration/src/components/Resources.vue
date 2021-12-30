<template>
  <div
    ref="container"
    class="resources"
    :class="{'resources--slider': !grid, 'resources--grid': grid}"
  >
    <div v-if="title !== null" class="resources__header">
      <h2 class="resources__title">{{ title }}</h2>
      <a href="#" class="resources__view-all" @click.prevent="viewAll()">View all</a>
    </div>

    <p v-if="resources.length <= 0">There are no resources that match your selected filters.</p>

    <div
      v-if="resources.length > 0"
      class="resources__container"
      :class="`resources__container--split-${split}`"
      ref="track"
    >
      <resource
        ref="resource"
        class="resources__resource"
        :class="`resources__resource--split-${split}`"
        v-for="resource in resources"
        :key="resource.id"
        :resource="resource"
        :permalink="permalink"
      />
    </div>

    <nav v-if="resources.length > 0" class="resources__nav">
      <a href="#" class="resources__nav-item" :class="{'resources__nav-item--inactive': !prevEnabled}" @click.prevent="prev()">
        <svg width="12" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M9.704 19.625c.176 0 .342-.078.498-.234l1.172-1.114a.857.857 0 00.176-.527.634.634 0 00-.176-.469L4.4 10.25l6.973-7.031a.634.634 0 00.176-.469.857.857 0 00-.176-.527L10.202 1.05a.816.816 0 00-.498-.176.816.816 0 00-.498.176L.593 9.723a.857.857 0 00-.176.527c0 .195.058.352.176.469l8.613 8.73a.816.816 0 00.498.176z" fill="currentColor" fill-rule="nonzero"/></g></svg>
      </a>
      <a href="#" class="resources__nav-item" :class="{'resources__nav-item--inactive': !nextEnabled}" @click.prevent="next()">
        <svg width="12" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M1.82 19.625c.176 0 .342-.078.498-.234l8.613-8.672v.058a.857.857 0 00.176-.527.857.857 0 00-.176-.527L2.318 1.05A.816.816 0 001.82.875a.816.816 0 00-.498.176L.15 2.223a.857.857 0 00-.176.527c0 .195.06.352.176.469l6.973 7.031L.15 17.281a.634.634 0 00-.176.469c0 .195.06.371.176.527l1.172 1.172a.816.816 0 00.498.176z" fill="currentColor" fill-rule="nonzero"/></g></svg>
      </a>
    </nav>
  </div>
</template>

<script>
import Resource from './Resource.vue'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'

export default {
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    resources: {
      type: Array,
      required: true
    },
    grid: {
      type: Boolean,
      default: false
    },
    permalink: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Resource
  },
  data () {
    return {
      prevEnabled: false,
      nextEnabled: false,
      resizeSensor: null,
      split: '1'
    }
  },
  mounted () {
    this.$refs.track.addEventListener('scroll', this.handleScroll)
    this.handleScroll()

    this.resizeSensor = new ResizeSensor(this.$refs.container, () => {
      const w = this.$refs.container.clientWidth

      if (w > 1000) {
        this.split = '3'
      } else if (w > 700) {
        this.split = '2'
      } else {
        this.split = '1'
      }
    })
  },
  beforeDestroy () {
    this.$refs.track.removeEventListener('scroll', this.handleScroll)

    if (this.resizeSensor) {
      this.resizeSensor.detach()
      this.resizeSensor = null
    }
  },
  methods: {
    viewAll () {
      this.$emit('viewAll')
    },
    getElementWidth () {
      return this.$refs.resource.length
        ? this.$refs.resource[0].$el.clientWidth
        : 0
    },
    prev () {
      this.scrollBy(-this.getElementWidth())
    },
    next () {
      this.scrollBy(this.getElementWidth())
    },
    scrollBy (y) {
      this.$refs.track.scrollBy({
        top: 0,
        left: y,
        behavior: 'smooth'
      })
    },
    handleScroll (e) {
      window.requestAnimationFrame(() => {
        const el = this.$refs.track
        this.prevEnabled = el.scrollLeft > 0
        this.nextEnabled = el.scrollLeft < el.scrollWidth - el.clientWidth
      })
    }
  }
}
</script>

<style lang="scss">
  .resources {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;
    }

    &__title {
      font-family: inherit !important; // Override Salesforce
      font-size: 30px !important; // Override Salesforce
      font-weight: 300 !important; // Override Salesforce
      margin: 0;
    }

    &--grid {
      .resources {
        &__view-all {
          display: none;
        }

        &__container {
          display: grid;
          grid-gap: 30px;
          grid-template-columns: 1fr;

          &--split-2 {
            grid-template-columns: 1fr 1fr;
          }

          &--split-3 {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        &__nav {
          display: none;
        }
      }
    }

    &--slider {
      .resources {
        &__view-all {
          position: relative;
          color: $color-primary !important; // Override Salesforce
          text-decoration: none;
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;

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

        &__container {
          display: flex;
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        &__resource {
          margin: 0 15px;
          min-width: 100%;
          scroll-snap-align: start;

          &--split-2 {
            min-width: calc(50% - 15px);
            max-width: calc(50% - 15px);
          }

          &--split-3 {
            min-width: calc(33.333% - 20px);
            max-width: calc(33.333% - 20px);
          }

          &:first-child {
            margin-left: 0;
          }

          &:last-child {
            margin-right: 0;
          }
        }

        &__nav-item {
          color: $color-primary !important; // Override Salesforce
          cursor: pointer;
          margin-right: 15px;

          &--inactive {
            opacity: 0.3;
            cursor: default;
          }
        }
      }
    }
  }
</style>
