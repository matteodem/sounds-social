import { constant } from 'lodash/fp'

import ProfilePage from '../components/pages/TheProfilePage.vue'
import ProfileEditPage from '../components/pages/profile/TheProfileEditPage.vue'
import ProfileEditUserDataPage from '../components/pages/profile/TheProfileEditUserDataPage.vue'

export const profileRoutes = [
  {
    name: 'profile-detail',
    path: '/profile/:id',
    component: ProfilePage,
    meta: { needsAuth: ({ params }) => params.id === 'me' }
  },
  {
    name: 'profile-edit',
    path: '/profile/:id/edit',
    component: ProfileEditPage,
    meta: { needsAuth: constant(true) }
  },
  {
    name: 'profile-edit-user-data',
    path: '/profile/:id/edit/user-data',
    component: ProfileEditUserDataPage,
    meta: { needsAuth: constant(true) }
  }
]
