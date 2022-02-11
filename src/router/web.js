import loadable from '../utils/loadable'

const Home = loadable(()=>import('../pages/web/home'))

const webRoutes = [
    {
      menu: true,
      icon: 'home',
      title: '首页',
      path: '/web',
      component: Home
    }
  ]
  
  export default webRoutes