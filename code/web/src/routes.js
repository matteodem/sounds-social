import Vue from 'vue'

import Router from 'vue-router'
import Meta from 'vue-meta'
import { constant } from 'lodash'

import { isAuthenticated } from './api/AuthApi'
import store from './store'
import { RouteNavigatorPlugin } from './plugins/RouteNavigatorPlugin'

import HomePage from './components/pages/TheHomePage.vue'
import DiscoverPage from './components/pages/sounds/TheDiscoverPage.vue'
import UploadPage from './components/pages/TheUploadPage.vue'
import SearchPage from './components/pages/TheSearchPage.vue'

import { soundRoutes } from './routes/SoundRoutes'
import { profileRoutes } from './routes/ProfileRoutes'
import { playlistRoutes } from './routes/PlaylistRoutes'
import { aliasRoutes } from './routes/AliasRoutes'
import { authRoutes } from './routes/AuthRoutes'

Vue.use(Router)
Vue.use(Meta)
Vue.use(RouteNavigatorPlugin)

const closePlayerListIfVisible = () => {
  if (store.state.soundPlayer.playerPlayingNowVisible) {
    store.dispatch('closePlayerPlayingNowList')
  }
}

const router = new Router({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomePage,
      meta: { needsAuth: constant(false) }
    },
    {
      name: 'discover',
      path: '/discover',
      component: DiscoverPage,
      meta: { needsAuth: constant(false) }
    },
    {
      name: 'upload',
      path: '/upload',
      component: UploadPage,
      meta: { needsAuth: constant(true) }
    },
    {
      name: 'search',
      path: '/search',
      component: SearchPage,
      meta: { needsAuth: constant(false) }
    },
    ...soundRoutes,
    ...profileRoutes,
    ...playlistRoutes,
    ...aliasRoutes,
    ...authRoutes
  ]
})

router.beforeEach(async (to, from, next) => {
  if (process && process.env && process.env.VUE_ENV === 'server') {
    return next()
  }

  const authenticated = await isAuthenticated()
  Vue.prototype.userIsAuthenticated = authenticated

  if (!authenticated && to.meta.needsAuth(to)) {
    router.push({ name: 'home' })
  } else {
    closePlayerListIfVisible()
    next()
  }
})

export default router
