import router from '../routes'

const openProfilePage = suffix => (id, type) => {
  return router.push({
    name: type === 'alias' ? `alias-${suffix}` : `profile-${suffix}`,
    params: { id }
  })
}

const routeNavigator = {
  openProfile: openProfilePage('detail'),
  openProfileEdit: openProfilePage('edit')
}

export const RouteNavigatorPlugin = {
  install (Vue) {
    Vue.prototype.$routeNavigator = routeNavigator
  }
}
