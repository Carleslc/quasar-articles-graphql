<template>
  <q-page class="flex">
    <q-list class="full-width">
      <q-list-header inset>Articles</q-list-header>
      <q-collapsible v-for="article in articles" :key="article.id" :label="article.title" icon="book" group="articles">
        <div class="with-line-breaks">{{ article.content }}</div>
        <q-btn class="q-mt-md" label="Full mode" icon="fullscreen" :to="`/article/${article.id}`"/>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<style>
</style>

<script>
import gql from 'graphql-tag'
const articleQuery = gql`
  query articleQuery($authorId: Int!) {
    articles(where:{author_id: {_eq: $authorId}}) {
      id
      title
      content
    }
  }`
export default {
  data () {
    return {
      authorId: this.$route.params.authorId
    }
  },
  name: 'Articles',
  apollo: {
    // Simple query that will update the 'articles' vue property
    articles: {
      query: articleQuery,
      prefetch: false,
      variables () {
        return { authorId: this.authorId }
      }
    }
  },
  watch: {
    '$route.params.authorId': {
      handler: function (authorId) {
        if (this.$apollo.queries.articles) { this.$apollo.queries.articles.refetch({ authorId: authorId }) }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
