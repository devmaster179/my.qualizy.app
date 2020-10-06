import Vue from 'vue'
import {
  AclInstaller,
  AclCreate,
  AclRule
} from 'vue-acl'

import router from '@/router'

Vue.use(AclInstaller)

let initialRole = 'public'
// if(localStorage.getItem('userInfo')) initialRole = localStorage.getItem('userRole')
if (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).role !== undefined) {
  if (JSON.parse(localStorage.getItem('userInfo')).role.key == 0)
    initialRole = 'super admin'
  else if (JSON.parse(localStorage.getItem('userInfo')).role.key == 1)
    initialRole = 'admin'
  else
    initialRole = 'visitor'
}

export default new AclCreate({
  initial: initialRole,
  notfound: '/pages/not-authorized',
  router,
  acceptLocalRules: true,
  globalRules: {
    "super admin": new AclRule('super admin').generate(),
    "admin": new AclRule('admin').or('super admin').generate(),
    'visitor': new AclRule('visitor').or('admin').or('super admin').generate(),
    "public": new AclRule('public').or('admin').or('super admin').or('visitor').generate()
  }
})