<template>
  <q-page class="flex" v-if="found">
    <div class="q-pa-md">
      <div v-if="$apollo.loading">Loading...</div>
      <h3>{{ article.title }}</h3>
      <div class="with-line-breaks">{{ article.content }}</div>
    </div>
  </q-page>
  <Error404 v-else></Error404>
</template>

<script>
import gql from 'graphql-tag'
const articleQuery = gql`
  query($articleId: Int!) {
    articles(where: { id: { _eq: $articleId } }) {
      title
      content
    }
  }`

export default {
  data () {
    return {
      article: {
        title: '',
        content: ''
      },
      articleId: this.$route.params.articleId,
      found: true
    }
  },
  components: {
    'Error404': require('components/Error404.vue').default
  },
  apollo: {
    // Simple query that will update the 'article' vue property
    article: {
      query: articleQuery,
      prefetch: false,
      variables () {
        return { articleId: this.articleId }
      },
      update (data) {
        if (data.articles.length > 0) {
          console.log(data.articles[0])
          return data.articles[0]
        } else {
          this.found = false
          return {
            title: '',
            content: ''
          }
        }
      }
    }
  },
  watch: {
    '$route.params.articleId': {
      handler: function (articleId) {
        if (this.$apollo.queries.articles) { this.$apollo.queries.articles.refetch({ articleId: articleId }) }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
