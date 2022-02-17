import React from 'react'
import { Form, Icon, Input, Button, Card, message  } from 'antd';
import './index.less'
import api from '../../../api'
import Particles from "react-tsparticles";
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
          localStorage.setItem('adminName', rel.data.admin_name)
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
        <Particles
              id="tsparticles"
              options={{
                background: {
                  color: {
                    value: "#0d47a1",
                  },
                },
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: "push",
                    },
                    onHover: {
                      enable: true,
                      mode: "repulse",
                    },
                    resize: true,
                  },
                  modes: {
                    bubble: {
                      distance: 400,
                      duration: 2,
                      opacity: 0.8,
                      size: 40,
                    },
                    push: {
                      quantity: 4,
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4,
                    },
                  },
                },
                particles: {
                  color: {
                    value: "#ffffff",
                  },
                  links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                  },
                  collisions: {
                    enable: true,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outMode: "bounce",
                    random: false,
                    speed: 6,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                    },
                    value: 80,
                  },
                  opacity: {
                    value: 0.5,
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    random: true,
                    value: 5,
                  },
                },
                detectRetina: true,
              }}
          />
        <Card className="login-form" style={{width: 300, borderRadius: 4, textAlign: 'center'}}>
          <h3 style={{marginBottom: 20, fontSize: 20, fontWeight: 600}}>qxzx后台管理系统</h3>
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