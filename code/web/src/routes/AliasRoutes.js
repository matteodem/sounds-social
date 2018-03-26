import { constant } from 'lodash/fp'

import AliasDetailPage from '../components/pages/Alias/TheAliasDetailPage.vue'
import AliasEditPage from '../components/pages/Alias/TheAliasEditPage.vue'

export const aliasRoutes = [
  {
    name: 'alias-detail',
    path: '/alias/:id',
    component: AliasDetailPage,
    meta: { needsAuth: constant(false) }
  },
  {
    name: 'alias-edit',
    path: '/alias/:id/edit',
    component: AliasEditPage,
    meta: { needsAuth: constant(true) }
  }
]
