<template>
  <div class="source-filter">
    <div
      class="source-filter__source"
      v-for="source in sources"
      :key="source.id"
      :class="{'source-filter__source--active': activeSources.includes(source.id)}"
      href="#"
      @click.prevent="toggleSource(source.id)"
    >
      {{ source.name }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    sources: {
      type: Array,
      required: true
    },
    activeSources: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleSource (id) {
      const activeSources = _.clone(this.activeSources)
      const idx = activeSources.indexOf(id)
      if (idx === -1) {
        activeSources.push(id)
      } else {
        activeSources.splice(idx, 1)
      }
      this.$emit('update:activeSources', activeSources)
    }
  }
}
</script>

<style lang="scss">
  .source-filter {
    color: red;
    margin-bottom: -12px;

    &__source {
      display: inline-block;
      line-height: 16px;
      font-weight: 700;
      color: $color-blue !important; // Override Salesforce
      color: var(--source-color) !important; // Override Salesforce
      padding: 10px;
      text-decoration: none;
      background-color: #fff;
      border: 2px solid $color-blue;
      border: 2px solid var(--source-color);
      border-radius: 18px;
      margin-right: 12px;
      margin-bottom: 12px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:nth-child(1) { --source-color: #{$color-blue}; }
      &:nth-child(2) { --source-color: #{$color-orange}; }
      &:nth-child(3) { --source-color: #{$color-teal}; }
      &:nth-child(4) { --source-color: #{$color-purple}; }

      &--active {
        color: #fff !important; // Override Salesforce
        background-color: $color-blue;
        background-color: var(--source-color);
      }
    }
  }
</style>
