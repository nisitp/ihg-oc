<template>
  <div class="resource" :class="{'resource--single': single}">
    <!-- Image -->
    <template v-if="single">
      <div class="resource__image-container">
        <img class="resource__image" :src="resource.image" :alt="resource.title">
      </div>
    </template>
    <template v-else>
      <router-link class="resource__image-container" :to="{name: 'single', params: { id: resource.id }}">
        <img class="resource__image" :src="resource.image" :alt="resource.title">
      </router-link>
    </template>

    <!-- Tags -->
    <div v-if="resource.tags.length && linkTags" class="resource__tags">
      <router-link
        v-for="tag in resource.tags"
        :key="tag.id"
        class="resource__tag"
        :to="{name: 'tag', params: { id: tag.id }}"
      >#{{ tag.name }}</router-link>
    </div>
    <div v-if="resource.tags.length && !linkTags" class="resource__tags">
      <span
        v-for="tag in resource.tags"
        :key="tag.id"
        class="resource__tag"
      >#{{ tag.name }}</span>
    </div>

    <!-- Title -->
    <template v-if="single">
      <h3 class="resource__title">{{ resource.title }}</h3>
    </template>
    <template v-else>
          <router-link v-if="!single" class="resource__title-link" :to="{name: 'single', params: { id: resource.id }}">
            <h3 class="resource__title">{{ resource.title }}</h3>
          </router-link>
    </template>

    <!-- Excerpt / Content -->
    <div v-if="single" class="resource__content" v-html="resource.content"></div>
    <div v-else class="resource__excerpt" v-html="resource.excerpt"></div>

    <!-- Attachments -->
    <div v-if="single" class="resource__attachments" v-html="resource.attachments"></div>

    <!-- Read more -->
    <template v-if="!single">
      <a v-if="permalink" class="resource__more" :href="link">Read More</a>
      <router-link v-else class="resource__more" :to="{name: 'single', params: { id: resource.id }}">Read More</router-link>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    resource: {
      type: Object,
      required: true
    },
    single: {
      type: Boolean,
      default: false
    },
    permalink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    linkTags () {
      return this.$router.resolve({ name: 'tag' }).route.matched.length > 0
    },
    link () {
      return `/communityhub/s/resources#/${this.resource ? this.resource.id : ''}`
    }
  }
}
</script>

<style lang="scss">
  .resource {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 15px;

    &--single {
      @include media(">=tablet") {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
          "image tags"
          "image title"
          "image content"
          ". attachments"
          ". attachments";
        column-gap: 30px;
      }

      @include media(">=desktop") {
        grid-template-columns: 1fr 1.5fr;
      }

      .resource__image-container {
        @include media(">=tablet") {
          width: auto;
          margin: 0;
          grid-area: image;

          &:after {
            display: none;
          }
        }
      }

      .resource__image {
        @include media(">=tablet") {
          position: static;
          left: auto;
          top: auto;
          height: auto;
          object-fit: fill;
        }
      }

      .resource__title {
        font-size: 28.8px;
        line-height: 40.8px;

        @include media(">=tablet") {
          grid-area: title;
          margin-bottom: 15px;
        }
      }

      .resource__tags {
        @include media(">=tablet") {
          grid-area: tags;
          margin-bottom: 0;
        }
      }

      .resource__content {
        @include media(">=tablet") {
          grid-area: content;
        }
      }

      .resource__attachments {
        @include media(">=tablet") {
          grid-area: attachments;
        }
      }
    }

    &__image-container {
      position: relative;
      width: calc(100% + #{15px * 2});
      margin: -15px -15px 15px -15px;

      &::after {
        content: "";
        display: block;
        width: 100%;
        padding-top: 60%;
      }
    }

    &__image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__tags {
      font-size: 14px;
      margin-bottom: 15px;
    }

    &__tag {
      display: inline-block;
      margin-right: 5px;
      color: var(--tag-color) !important; // Override Salesforce
      text-decoration: none !important; // Override Salesforce

      &:nth-child(4n+0) { --tag-color: #{$color-blue}; }
      &:nth-child(4n+1) { --tag-color: #{$color-orange}; }
      &:nth-child(4n+2) { --tag-color: #{$color-teal}; }
      &:nth-child(4n+3) { --tag-color: #{$color-purple}; }
    }

    &__title-link {
      text-decoration: none !important; // Override Salesforce
    }

    &__title {
      margin: 0;
      font-size: 19.2px;
      color: #000000;
      line-height: 27.2px;
    }

    &__excerpt,
    &__content {
      flex: 1;
      margin: 0 0 15px 0;
      font-size: 17.6px;
      color: #000000;
      line-height: 27.2px;

      > *:first-child {
        margin-top: 0;
      }

      > *:last-child {
        margin-bottom: 0;
      }

      a {
        color: $color-primary !important; // Override Salesforce
        text-decoration: none;

        &:hover {
          color: darken($color-primary, 5%) !important; // Override Salesforce
          text-decoration: none !important; // Override Salesforce;
        }
      }
    }

    &__attachments {
      font-size: 17.6px;
      color: #000000;
      line-height: 27.2px;

      table {
        width: 100%;
        border-collapse: collapse;

        & > thead > tr > th {
          text-align: left;
        }

        th, td {
          border: 1px solid $color-primary;
          padding: 3px 7px;
        }
      }

      a {
        color: $color-primary !important; // Override Salesforce
        text-decoration: none;

        &:hover {
          color: darken($color-primary, 5%) !important; // Override Salesforce
          text-decoration: none !important; // Override Salesforce;
        }
      }
    }

    &__more {
      display: block;
      width: calc(100% + #{15px * 2});
      color: #fff !important; // Override Salesforce
      text-decoration: none;
      font-size: 19px;
      line-height: 19px;
      font-weight: 700;
      text-align: center;
      background-color: $color-primary;
      margin: 0 -15px -15px -15px;
      padding: 28px;

      &:hover {
        background-color: darken($color-primary, 5%);
        text-decoration: none !important; // Override Salesforce
      }
    }
  }
</style>
