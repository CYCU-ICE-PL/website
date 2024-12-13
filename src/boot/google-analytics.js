import { defineRouter } from '#q-app/wrappers'
import ga from 'analytics.js'

export default defineRouter(({ router }) => {
  router.afterEach((to, from) => {
    ga.logPage({
      toPath: to.path,
      toName: to.name,
      fromPath: from.path,
      fromName: from.name
    })
  })
})