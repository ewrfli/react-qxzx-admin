import loadable from '../utils/loadable'


const Home = loadable(()=>import('../pages/admin/home'))
const Users = loadable(()=>import('../pages/admin/users'))
const Article = loadable(()=>import('../pages/admin/article'))
// const ArticleItem = loadable(()=>import('../pages/admin/article/item'))
const Tags = loadable(()=>import('../pages/admin/tags'))
const Category = loadable(()=>import('../pages/admin/category'))
const Company = loadable(()=>import('../pages/admin/company'))
const Star = loadable(()=>import('../pages/admin/star'))

const Comment = loadable(()=>import('../pages/admin/comment'))
const Fans = loadable(()=>import('../pages/admin/fans'))
const Banner = loadable(()=>import('../pages/admin/banner'))

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
    menu: true,
    icon: 'star',
    title: '评论',
    path: '/admin/comment',
    component: Comment
  },
  {
    menu: true,
    icon: 'star',
    title: '粉丝',
    path: '/admin/fans',
    component: Fans
  },
  {
    menu: true,
    icon: 'star',
    title: 'Banner',
    path: '/admin/banner',
    component: Banner
  }
  // {
  //   icon: 'edit',
  //   title: '文章详情',
  //   path: '/admin/article-edit/:id',
  //   component: ArticleItem
  // }
]

export default routes