import router from './router'
import Message from '@/utils/message'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

const whiteList = ['/login', '/register']

const isWhiteList = (path) => {
  return whiteList.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
      return regex.test(path)
    }
    return path === pattern || path.startsWith(pattern + '/')
  })
}

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
    } else if (isWhiteList(to.path)) {
      next()
    } else {
      // 这里可以根据实际需求添加用户信息获取和动态路由生成逻辑
      // if (useUserStore().roles.length === 0) {
      //   isRelogin.show = true
      //   useUserStore().getInfo().then(() => {
      //     isRelogin.show = false
      //     usePermissionStore().generateRoutes().then(accessRoutes => {
      //       accessRoutes.forEach(route => {
      //         if (!isHttp(route.path)) {
      //           router.addRoute(route)
      //         }
      //       })
      //       next({ ...to, replace: true })
      //     })
      //   }).catch(err => {
      //     useUserStore().logOut().then(() => {
      //       Message.error(err)
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   next()
      // }
      next()
    }
  } else {
    // 没有token
    if (isWhiteList(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

