import loadable from '../utils/loadable'

const Tags = loadable(()=>import('../pages/admin/tags'))
const Star = loadable(()=>import('../pages/admin/star'))
const Home = loadable(()=>import('../pages/admin/home'))
const Category = loadable(()=>import('../pages/admin/category'))
const Company = loadable(()=>import('../pages/admin/company'))
const Users = loadable(()=>import('../pages/admin/users'))
const Article = loadable(()=>import('../pages/admin/article'))
const ArticleItem = loadable(()=>import('../pages/admin/article/item'))

const routes = [
  {
    menu: true,
    icon: 'home',
    title: '首页',
    path: '/admin/home',
    component: Home
  },
  {
    menu: true,
    icon: 'star',
    title: '用户',
    path: '/admin/users',
    component: Users
  },
  {
    menu: true,
    icon: 'edit',
    title: '文章',
    path: '/admin/article',
    component: Article
  },
  {
    menu: true,
    icon: 'tags',
    title: '标签',
    path: '/admin/tags',
    component: Tags
  },
  {
    menu: true,
    icon: 'folder',
    title: '分类',
    path: '/admin/category',
    component: Category
  },
  {
    menu: true,
    icon: 'tags',
    title: '公司',
    path: '/admin/company',
    component: Company
  },
  {
    menu: true,
    icon: 'star',
    title: '收藏',
    path: '/admin/star',
    component: Star
  },
  {
    icon: 'edit',
    title: '新增文章',
    path: '/admin/article-add',
    component: ArticleItem
  },
  {
    icon: 'edit',
    title: '文章详情',
    path: '/admin/article-edit/:id',
    component: ArticleItem
  }
]

export default routes