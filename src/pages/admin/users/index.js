import React from 'react'
import { color, deBounce } from '../../../utils'
import { Table, Form, Button, Input, message, Modal, Tag } from 'antd';
import api from '../../../api'

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      userItemData: {},

      user_name: '',
      user_password: '',
      user_avatarimg: '',
      user_desc: '',
      user_power: '',
      user_powerDate: '',
      user_phone: '',
      user_email: '',
      user_birthday: '',
      user_age: '',
      user_ip: '',
      user_company_id: '',
      user_company_name: '',

      search_user_name: '',
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '用户ID',
          dataIndex: 'user_id',
          key: 'user_id',
          width: 80,
          align: 'center'
        },
        {
          title: '用户名',
          width: 100,
          key: 'user_name',
          dataIndex: 'user_name',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '手机',
          key: 'user_phone',
          dataIndex: 'user_phone',
          width: 150,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createdAt',
          dataIndex: 'createdAt'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: record => (
            <span>
              <Button size='small' type='danger' className='mr10' onClick={this.delClick.bind(this, record)}>delete</Button>
              <Button size='small' type="primary" onClick={this.editClick.bind(this, record)}>edit</Button>
            </span>
          ),
        }
      ]
    }
  }

  // 初始化
  componentDidMount() {
    this.props.form.validateFields();
    this.getList()
  }
  // 请求数据
  async getList () {
    this.setState({loading: true})
    const params = {
      user_name: this.state.search_user_name,
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize
    }
    const {data, total } = await api.get('user/list', params)
    // data.forEach((item, index) => {
    //   item.index = this.state.pageSize * (this.state.pageNo - 1) + index + 1
    // })
    this.setState({
      data,
      total,
      loading: false
      })
  }

  // 新增用户
    //取消新增弹窗显示
    handleAddCancel() {
      console.log('取消新增弹窗显示')
      this.setState( {userAddData: {}, addModalvisible: false} )
    }
    //新增弹窗确认
    async handleAddOk(e) {
      e.preventDefault()
      console.log('新增弹窗确认',e)
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('values',values)
          this.setState( {user_name:'', addModalvisible: false} )
        } 
      })
      // const {code, data} = await api.post('user/add', {user_name: this.state.user_name, user_phone: Math.random()*100})
      // this.setState( {userAddData: {}, user_name:'', addModalvisible: false} )
      // if (code) message.success('新增成功！' + code)
      // else message.error(data)
      // this.getList()

    }

    // handleSubmit = (e) => {
    //   e.preventDefault()
    //   this.props.form.validateFields(async (err, values) => {
    //     if (!err) {

    //     } 
    //   })
    // }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {userItemData: record, delModalvisible: true} )
    console.log(record,this.state.userItemData)
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {userItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    console.log(this.state.userItemData)
    await api.post('user/del', {user_id: this.state.userItemData.user_id})
    message.success('删除成功')
    this.getList()
    this.setState( {userItemData: {}, delModalvisible: false} )
  }

  //编辑
  async editClick (record) {
    console.log('update',record)
    await api.post('user/update', record)
    message.success('编辑成功')
    this.getList()
  }

  // 查询
  
  async handdleSearchChange (e) {
    console.log('e.target.value',e.target.value)
    // this.setState({search_user_name: e.target.value})
    await this.setState({
      pageNo: 1,
      search_user_name: e.target.value || ''
    })
    // this.getList()
    deBounce(this.getList(), 1000);
  }



  handdleAddChange (e) {
    this.setState({user_name: e.target.value})
  }

  // 更改page
  async handleOnChange (page) {
    await this.setState({
      pageNo: page.current,
      pageSize: page.pageSize
    })
    this.getList()
  }
  render() {
    const { userItemData } = this.state;
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
        xxl: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 }
      }
    }
    return (
      <div>
        {/* 确认删除弹窗 */}
        <Modal
          title="确认删除"
          visible={ this.state.delModalvisible }
          onOk={this.handleDelOk.bind(this)}
          onCancel={ this.handleDelCancel.bind(this) }>
            <p>确认删除用户：{userItemData ? userItemData.user_name : ''}</p>
        </Modal>
        <Modal
          title="添加用户"
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
            <Input placeholder="请输入用户名" value={ this.state.user_name } onChange={ e => this.handdleAddChange(e) } />
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
              <Form.Item label='用户名'>
                {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input placeholder="请输入用户名" />
                )}
              </Form.Item>
              <Form.Item label='手机号'>
                {getFieldDecorator('user_phone', {
                  rules: [{ required: true, message: '请输入手机号' }],
                })(
                  <Input placeholder="请输入手机号" />
                )}
              </Form.Item>
            </Form>
        </Modal>
        {/* 头部 */}
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="请输入用户名搜索" value={ this.state.search_user_name } onChange={ e => this.handdleSearchChange(e) } />
          </Form.Item>
          <Form.Item>
            {/* <Button className='mr10' type="primary" >search</Button> */}
            <Button type='primary' onClick={ _ => this.setState({addModalvisible: true}) }>create</Button>
        </Form.Item>
      </Form>
      {/* 表格 */}
      <Table
        bordered
        className='mt10'
        pagination={{
          current: this.state.pageNo,
          showSizeChanger: true,
          total: this.state.total,
          pageSize: this.state.pageSize,
          pageSizeOptions: ['10', '20', '30', '40'],
          showTotal (total) { return `Total ${total} `}
        }}
        loading={ this.state.loading }
        columns={ this.state.columns }
        dataSource={ this.state.data }
        rowKey={record => record.user_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(User)

export default article