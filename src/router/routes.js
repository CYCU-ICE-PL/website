const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'OurScheme', name: 'OurScheme', component: () => import('pages/OurSchemePage.vue') },
      { path: 'OurC', name: 'OurC', component: () => import('pages/OurCPage.vue') },
      { path: 'Tutorial', name: 'Tutorial', component: () => import('pages/TutorialPage.vue') },
      { path: 'About', name: 'About', component: () => import('pages/AboutPage.vue') },
      { path: 'Visualize', name: 'Visualize', component: () => import('pages/VisualizePage.vue') },
      { path: 'cycu-ice-secret', name: 'EasterEgg', component: () => import('pages/EasterEggPage.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes