<template>
  <div class="glossary">
    <div v-if="loading" class="loading">
      <div class="loading__spinner"></div>
    </div>

    <template v-if="!loading">
      <ul class="glossary__letters">
        <li
          v-for="letter in letters"
          :key="letter.letter"
          class="glossary__letter"
          :class="{
            'glossary__letter--active': activeLetter === letter.letter,
            'glossary__letter--disabled': letter.terms.length === 0
          }"
        >
          <router-link :to="{name: 'letter', params: {letter: letter.letter}}">
            {{ letter.letter }}
          </router-link>
        </li>
      </ul>

      <div v-if="letter" class="glossary__terms">
        <div class="glossary__terms-title">
          <h2>{{ letter.letter }}</h2>
          <a href="#" class="glossary__print" @click.prevent="print()">Print</a>
        </div>
        <div
          v-for="term in letter.terms"
          :key="term.id"
          :ref="'term-' + term.id"
          class="glossary__term"
          :class="{'glossary__term--active': activeTerm === term.id}"
        >
          <router-link class="glossary__term-link" :to="{name: 'single', params: {letter: letter.letter, id: term.id}}">#</router-link>
          <div class="glossary__term-description" v-html="term.description"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loading: true,
      activeLetter: /^([A-Z]|All)$/.test(this.$route.params.letter)
        ? this.$route.params.letter
        : 'A',
      activeTerm: this.$route.params.id,
      terms: []
    }
  },
  watch: {
    $route (newValue) {
      if (/^([A-Z]|All)$/.test(this.$route.params.letter)) {
        this.activeLetter = newValue.params.letter
      }

      this.activeTerm = newValue.params.id
      this.scrollTo(newValue.params.id)
    }
  },
  computed: {
    letters () {
      // return this.terms
      //   .map(t => t.term.charAt(0).toUpperCase())
      //   .filter((el, pos, arr) => arr.indexOf(el) === pos)
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['All'])
        .map(l => ({
          letter: l,
          terms: this.terms.filter(t => l === 'All' || t.term.charAt(0).toUpperCase() === l)
        }))
    },
    letter () {
      return this.letters.find(l => l.letter === this.activeLetter)
    }
  },
  mounted () {
    this.loading = true

    this
      .loadTerms()
      .then(() => {
        this.loading = false

        this.$nextTick(() => {
          this.scrollTo(this.$route.params.id)
        })
      })
  },
  methods: {
    loadTerms () {
      return new Promise((resolve) => {
        axios
          .get('https://oc.hotsauceatl.com/api/v1/glossary')
          .then((response) => {
            this.terms = []

            for (const term of response.data) {
              this.terms.push({
                id: term.id,
                term: term.term,
                description: term.description
              })
            }

            resolve()
          })
      })
    },
    scrollTo (id) {
      if (!id) return

      this.$refs['term-' + id][0].scrollIntoView({
        behavior: 'smooth'
      })
    },
    print () {
      const styles = {
        letters: `
          -webkit-print-color-adjust: exact;
          background: #f6f5fa;
          border-bottom: 5px solid #00a7e1;
          padding: 25px 5px 10px 5px;
          text-align: center;
          margin-bottom: 30px;
        `,
        letter: `
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 12px;
          padding: 0 6px;
          color: #231f20;
          text-decoration: none;
          font-weight: 700;
        `,
        term: `
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 12px;
        `
      }

      const html = `
        <html>
          <head><title>Glossary</title></head>
          <body>
            <div style="${styles.letters}">
              ${
                this.letters.map((l, i) => {
                  const style = styles.letter + (i !== 0 ? 'border-left: 2px solid #006f94;' : '')
                  const href = window.location.origin + window.location.pathname + '#/' + l.letter
                  return `
                    <a style="${style}" href="${href}" target="_blank">
                      ${l.letter}
                    </a>`
                }).join('')
              }
            </div>
            ${
              this.letter.terms.map(term => {
                return `
                  <div style="${styles.term}">
                    ${term.description}
                  </div>
                `
              }).join('')
            }
          </body>
        </html>`

      const print = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150')
      print.document.write(html)

      print.document.close()
      print.focus()

      print.print()
      print.close()
    }
  }
}
</script>

<style lang="scss" scoped>
  .glossary {
    &__letters{
      background-color: #fff;
      border-bottom: 5px solid $color-secondary;
      padding: 25px 5px 10px 5px !important; // Override Salesforce
      list-style: none;
      margin: 0 0 40px 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    &__letter {
      padding: 0 10px !important; // Override Salesforce
      margin-bottom: 15px;
      white-space: nowrap;

      &:not(:last-child) {
        border-right: 2px solid $color-primary;
      }

      &:hover {
        text-decoration: none !important; // Override Salesforce
      }

      &::before {
        display: none; // Override Salesforce
      }

      > a {
        display: block;
        position: relative;
        color: inherit !important; // Override Salesforce
        text-decoration: none;
        text-transform: uppercase;
        font-weight: 700;
        padding: 0 3px;

        &::before {
          content: "" !important; // Override Salesforce
          display: block !important; // Override Salesforce
          position: absolute;
          bottom: 0;
          left: 0px;
          right: 0px;
          width: auto !important; // Override Salesforce
          height: 2px;
          background-color: $color-primary;
          opacity: 0;
          margin: 0 !important; // Override Salesforce
        }

        &:hover,
        &:focus {
          text-decoration: none !important; // Override Salesforce
        }
      }

      &--disabled > a {
        opacity: 0.5;
        cursor: default;
      }

      &--active > a::before {
        opacity: 1;
      }
    }

    &__terms-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > h2 {
        font-family: inherit !important; // Override Salesforce
        font-size: 30px !important; // Override Salesforce
        font-weight: 300 !important; // Override Salesforce
        margin: 0;
      }
    }

    &__print {
      position: relative;
      color: $color-primary !important; // Override Salesforce
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 0;
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

    &__term {
      position: relative;
      margin: 0 -18px;
      padding: 12px 18px;
      transition: background-color 150ms ease;

      &--active {
        background-color: #fff;
      }

      &:hover .glossary__term-link {
        opacity: 1;
      }
    }

    &__term-link {
      position: absolute;
      top: 12px;
      left: 4px;
      color: $color-primary !important; // Override Salesforce
      text-decoration: none;
      font-weight: 700;
      opacity: 0;
      transition: opacity 150ms ease;
    }

    &__term-description {
      & > :first-child { margin-top: 0; }
      & > :last-child { margin-bottom: 0; }
    }
  }
</style>
