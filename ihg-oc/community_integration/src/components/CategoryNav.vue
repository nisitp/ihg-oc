<template>
  <div class="category-nav">
    <ul class="category-nav__categories">
      <li
        class="category-nav__category"
        :class="{'category-nav__category--active': activeCategoryId === null}"
      >
        <a
          class="category-nav__category-link"
          href="#"
          @click.prevent="switchCategory(null)"
        >
          Highlights
        </a>
      </li>
      <li
        class="category-nav__category"
        :class="{
          'category-nav__category--active': activeCategoryId == category.id,
          'category-nav__category--disabled': category.resources.length === 0
        }"
        v-for="category in categories"
        :key="category.id"
      >
        <a
          class="category-nav__category-link"
          href="#"
          @click.prevent="switchCategory(category)"
        >
          {{ category.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    activeCategoryId: {
      required: true
    }
  },
  methods: {
    switchCategory (category) {
      if (category && category.resources.length === 0) return

      this.$emit('update:activeCategoryId', category ? category.id : null)
    }
  }
}
</script>

<style lang="scss">
  .category-nav {
    background-color: #fff;
    border-bottom: 5px solid $color-secondary;
    padding: 55px 30px;

    &__categories {
      list-style: none;
      padding: 0 !important; // Override Salesforce
      margin: 0 0 -15px 0;
      display: flex;
      flex-wrap: wrap;
    }

    &__category {
      margin-right: 30px;
      position: relative;
      padding: 0 !important; // Override Salesforce
      margin-bottom: 15px;
      white-space: nowrap;

      &:hover {
        text-decoration: none !important; // Override Salesforce
      }

      &::before {
        content: "" !important; // Override Salesforce
        display: block !important; // Override Salesforce
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: auto !important; // Override Salesforce
        height: 2px;
        background-color: $color-primary;
        opacity: 0;
        margin: 0 !important; // Override Salesforce
      }

      &--active::before {
        opacity: 1;
      }

      &--disabled {
        opacity: 0.5;

        .category-nav__category-link {
          cursor: default;
        }
      }
    }

    &__category-link {
      color: inherit !important; // Override Salesforce
      text-decoration: none;
      text-transform: uppercase;
      font-weight: 700;

      &:hover,
      &:focus {
        text-decoration: none !important; // Override Salesforce
      }
    }
  }
</style>
