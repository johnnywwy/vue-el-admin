/*
*规则：
* 一、例如：index/index, shop/index 以index结尾的，path和name默认去除idnex
* 二、例如：shop/list, 默认生成的name为shop_list (如果结尾为index，例如shop/index 则是shop)
* 三、填写后不会自动生成
*/

let routes = [
  {
    path: '/',
    name: 'layout',
    redirect: {name: 'index'},
    // component: () => import('../../views/layout/layout.vue'),
    component: 'layout',
    children: [
      {
        path: '/index',
        name: 'index',
        // component: () => import('../../views/index/index.vue'),
        component: 'index/index',
      },
      {
        path: '/shop/goods/list',
        name: 'shop_goods_list',
        component: 'shop/goods/list',
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('../../views/login/index.vue'),
    component: 'login/index',
  },
  {
    path: '*',
    redirect: {name: 'index'}
  }
]

//获取路由信息方法
const getRoutes = function () {
  //生成路由详细信息
  createRoute(routes)
  return routes
}

//自动生成路由方法
function createRoute(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].component) return

    //生成name
    let val = getValue(arr[i].name)
    arr[i].name = arr[i].name || val.replace(/\//g, '_')

    //生成path
    arr[i].path = arr[i].path || `/${val}`

    //自动生成component
    let componentFn = import(`../../views/${arr[i].component}.vue`)
    arr[i].component = () => componentFn

    //  遍历下面的children层
    if (arr[i].children && arr[i].children.length > 0) {
      createRoute(arr[i].children)
    }
  }
}

//去除index
function getValue(str) {
  // str = 'login/index'
  //获取最后一个/ 的索引
  let index = str.lastIndexOf('/')
  // console.log(str, index)

  //获取最后一个/ 到末尾的字符串
  let val = str.substring(index + 1, str.length)
  // console.log(val, val)
  //判断是不是index结尾
  if (val === 'index') {
    return str.substring(index, -1)
  }
  return str
}

export default getRoutes()