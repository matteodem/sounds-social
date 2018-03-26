import router from '../routes'

const routeNavigator = {
  openProfile (id, type) {
    router.push({
      name: type === 'alias' ? 'alias-detail' : 'profile-detail',
      params: { id }
    })
  }
}

export const RouteNavigatorPlugin = {
  install (Vue) {
    Vue.prototype.$routeNavigator = routeNavigator
  }
}
