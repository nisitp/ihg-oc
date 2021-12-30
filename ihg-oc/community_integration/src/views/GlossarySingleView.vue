<template>
  <div class="glossary">
    <div v-if="!term" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <template v-if="term">
      <div class="glossary__term" v-html="term.description"></div>
      <a class="glossary__more" :href="link">More &raquo;</a>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      term: null
    }
  },
  computed: {
    link () {
      return this.term
        ? `/communityhub/s/glossary#/${this.term.letter}/${this.term.id}`
        : ''
    }
  },
  mounted () {
    this.loadTerm()
  },
  methods: {
    loadTerm () {
      axios
        .get('https://oc.hotsauceatl.com/api/v1/glossary/random')
        .then((response) => {
          this.terms = []

          for (const term of response.data) {
            this.term = {
              id: term.id,
              letter: term.term.charAt(0).toUpperCase(),
              term: term.term,
              description: term.description
            }
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .glossary {
    &__term {
      position: relative;
      margin: 0 0 15px 0;

      & > :first-child { margin-top: 0; }
      & > :last-child { margin-bottom: 0; }
    }

    &__more {
      position: relative;
      color: $color-primary !important; // Override Salesforce
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;
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
  }
</style>
