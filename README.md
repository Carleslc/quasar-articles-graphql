# quasar-articles-graphql

Boilerplate to get started with Quasar Framework, Hasura GraphQL engine as CMS and postgres as database using the [quasar-cli](https://quasar-framework.org/guide/app-installation.html) and [vue-apollo](https://github.com/Akryum/vue-apollo) module.

# Test Live

[Frontend](https://quasar-articles-graphql.netlify.com)
[Backend](https://hasura-blog-test.herokuapp.com/)

# Tutorial

- Deploy Postgres and GraphQL Engine on Heroku with Hasura:
  
  [![Deploy to
  heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku)

  Please checkout our [docs](https://docs.hasura.io/1.0/graphql/manual/deployment/index.html) for other deployment methods

- Get the Heroku app URL (say `hasura-blog-test.herokuapp.com`)

- Create `author` table:
  
  Open Hasura console: visit https://hasura-blog-test.herokuapp.com/ on a browser  
  Navigate to `Data` section in the top nav bar and create a table the following tables:

  - `authors`
    - `id` Integer (auto-increment)
    - `name` Text
  
  - `articles`
    - `id` Integer (auto-increment)
    - `title` Text
    - `content` Text
    - `author_id` Integer (foreign key to `authors.id`)
  
- Insert sample data

- Clone this repo:
  ```bash
  git clone https://github.com/Carleslc/quasar-articles-graphql.git
  ```
  
- Install node modules:
  ```bash
  yarn install
  ```

- Open `src/plugins/apollo.js` and configure Hasura's GraphQL Endpoint as follows: 
```js

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'

const httpLink = createHttpLink({ uri: 'https://hasura-blog-test.herokuapp.com/v1/graphql', fetch: fetch })

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

```

In the `httpLink`, replace `hasura-blog-test.herokuapp.com` with your own Heroku URL of Hasura GraphQL Engine.

- We have defined the graphql query for fetching author list in `src/layouts/MyLayout.vue`. 
    - GraphQL query

    ```graphql
    const authorQuery = gql`
      query {
        authors {
          id
          name
        }
    }`
    ```

    - In `pages/Articles.vue`, we have defined a graphql query for articles
    ```js

    <script>
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
        // Simple query that will update the 'article' vue property
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

    ```

- Run the app:
  ```bash
  quasar dev
  ```
  
- Test the app
  Visit [http://localhost:8080](http://localhost:8080) to view the app
  
- Production mode
  
  ```bash
  quasar build
  ```

For detailed explanation on how things work, checkout [Quasar Framework docs](https://quasar-framework.org/guide/).
