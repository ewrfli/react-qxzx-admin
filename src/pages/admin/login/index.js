import React from 'react'
import { Form, Icon, Input, Button, Card, message  } from 'antd';

import './index.less'
import api from '../../../api'

class login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const rel= await api.post('/admin/login', values)
        console.log('rel',rel)
        if (rel.code === 200) {
          message.success(rel.msg)
          localStorage.setItem('adminToken', rel.token)
          sessionStorage.setItem('menuItmeKey', '0')
          this.props.history.push('/admin/home')
        } else {
          message.error(err)
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <Card className="login-form" style={{width: 300,borderRadius: 4}}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('admin_name', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('admin_password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block>Log in</Button>
          </Form>
        </Card>
      </div>
    )
  }
}

const Login = Form.create({ name: 'normal_login' })(login)

export default Login