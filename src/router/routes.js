
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/author/:authorId', component: () => import('pages/Articles.vue') },
      { path: '/article/:articleId', component: () => import('pages/Article.vue') },
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('components/Error404.vue')
  })
}

export default routes
