import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）也叫常量路由
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'ele-HomeFilled',
      }
    }]
    // 这样写也可以达到我们的效果，但是必须配置hidden
    // {
    //   path:'/',
    //   redirect:'/home',
    //   meta:{
    //     hidden:true
    //   }
    // }

  }
];

// 异步路由（动态路由）
// 这里面放的是所有的动态路由，后期需要根据用户返回的信息
// 和这个数组去过滤用户需要的路由，进行动态注册
export const allAsyncRoutes: RouteRecordRaw[] = [
  // 权限管理
  {
    path: "/acl",
    name: "Acl",
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "ele-Setting",
    },
    children: [
      {
        name: "User",
        path: "/acl/user/list",
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "/acl/role/list",
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "/acl/role/auth",
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: "角色管理",
          hidden: true,
          activeMenu: "/acl/role/list",
        },
      },
      {
        name: "Permission",
        path: "/acl/permission/list",
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'ele-ShoppingBag'
    },
    children: [
      {
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理'
        }
      },
      {
        path: 'attr/list',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '平台属性管理'
        }
      },
      {
        path: 'spu/list',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'Spu管理'
        }
      },
      {
        path: 'sku/list',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'Sku管理'
        }
      },
      {
        path: 'scoped/list',
        component: () => import('@/views/product/scoped/index.vue'),
        name: 'Scoped',
        meta: {
          title: 'ScopedTest'
        }
      }
    ]
  },
  {
    path:'/test',
    component:() => import('@/layout/index.vue'),
    redirect:'/test/test111/list',
    name:'Test',
    meta:{
      icon:'ele-Warning',
      title:'测试管理'
    },
    children:[
      {
        path:"test111/list",
        component: () => import('@/views/test/test111/index.vue'),
        name:'Test111',
        meta:{
          title:'测试01'
        }
      },
      {
        path:"test222/list",
        component: () => import('@/views/test/test222/index.vue'),
        name:'Test222',
        meta:{
          title:'测试02'
        }
      },
    ]
  }
]


// 
/* 匹配任意的路由 必须最后注册 */
// 这个路由是用户随意输入，我们会跳转到404
// 而且这个路由动态注册的时候一定切记  注册在最后一个
export const anyRoute = {
  path: '/:pathMatch(.*)',
  name: 'Any',
  redirect: '/404',
  meta: {
    hidden: true
  }
}



