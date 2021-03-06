// import api from './api'
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Icon, Avatar, Dropdown, message } from 'antd'
import routes from '../../../router/admin'
import './index.less'

const { Header, Sider, Content, Footer } = Layout

class App extends Component {
  constructor(props) {
    // es6继承必须用super调用父类的constructor
    super(props)
    this.state = {
      collapsed: false,
      data: 'hello',
      person: '',
      adminName: localStorage.getItem('adminName') || ''
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentDidMount () {
    document.title = 'qxzx-admin'
  }
  handleClickMenuItem (item) { //设置侧边菜单栏初始选项与记录
    sessionStorage.setItem('menuItmeKey', String(item.key))
  }
  handleClickDrop () {
    message.success('退出登录')
    this.props.history.push('/login')
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
  }
  menuItem = () => {
    return routes.filter(item => item.menu).map((item, index) => {
      return (
      <Menu.Item key={ index } onClick={ item => this.handleClickMenuItem(item) }>
        <Link to={item.path}>
          <Icon type={ item.icon } />
          <span>{ item.title }</span>
        </Link>
      </Menu.Item>)
    })
  }
  render() {
    const logoClass = this.state.collapsed ? 'logoMin' : 'logoMax'
    const menu = (
      <Menu onClick={ this.handleClickDrop.bind(this) }>
        <Menu.Item key="1">login out</Menu.Item>
      </Menu>
    )
    return (
        <div>
          <Layout style={{minHeight: '100vh'}}>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}>
              {/* <div className={logoClass} /> */}
              <div className={logoClass}>企险资讯后台管理系统</div>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={ [sessionStorage.getItem('menuItmeKey') || '0'] }>
                { this.menuItem() }
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                <span className='user'>
                  <Avatar style={{ backgroundColor: '#f56a00' }}>{this.state.adminName}</Avatar>
                  <Dropdown overlay={menu} className='ml10'>
                      <Icon type="down" />
                  </Dropdown>
                </span>
              </Header>
              <div className='wrap-content'>
                <Content className='content'>
                  {routes.map((route, i) => (
                    <Route
                    key={i}
                    excat={route.excat}
                    path={route.path}
                    component={route.component}
                  />
                  ))}
                </Content>
              </div>
              <Footer style={{ textAlign: 'center'}}>
                Created by qxzx
              </Footer>
            </Layout>
          </Layout>
        </div>
    )
  }
}

export default App;
