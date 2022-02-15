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
      userAddData: {
        user_name: null,//
        user_password: null,
        user_avatarimg: null,
        user_desc: null,
        user_power: null,
        user_powerDate: null,
        user_phone: null,
        user_email: null,
        user_birthday: null,
        user_age: null,
        user_ip: null,
        user_company_id: null,
        user_company_name: null
      },
      isEdit: false,
      search_user_name: '',//
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
      this.setState( {userAddData: {}, addModalvisible: false, isEdit: false} )
    }
    //新增弹窗确认
    async handleAddOk() {
      console.log('新增弹窗确认')
      let params = { ...this.state.userAddData }

      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('user/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false }) }
        else {message.error(data)}
      }else{
        const {code, data} = await api.post('user/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(data)
      }
      this.getList()
      this.setState( {userAddData: {}, addModalvisible: false} )
    }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey) {
    let value = event.target.value;
    let userAddData = this.state.userAddData;
    this.setState({
      userAddData: {
        ...userAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
    console.log('this.state.userAddData;',this.state.userAddData)
  }



  //编辑弹窗显示
  async editClick (record) {
    console.log('update',record)
    await this.setState( {userAddData: {...record}, addModalvisible: true, isEdit: true} )
  }

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


  // 查询
  async handdleSearchChange (e) {
    // console.log('e.target.value',e.target.value)
    // this.setState({search_user_name: e.target.value})
    await this.setState({
      pageNo: 1,
      search_user_name: e.target.value || ''
    })
    // this.getList()
  }
  async toSearch () {
    console.log('toSearch')
    this.getList()
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
    const { userItemData, isEdit } = this.state;
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
        {/* 添加用户弹窗 */}
        <Modal
          title={isEdit ? "编辑用户" : "添加用户"}
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
            ·<Form.Item label='用户头像'>
                <Input placeholder="用户头像" allowClear value={ this.state.userAddData.user_avatarimg } onChange={(e) => this.inputDataChange(e, 'user_avatarimg')}/>
              </Form.Item>
              <Form.Item label='用户名'>
                <Input placeholder="请输入用户名" allowClear value={ this.state.userAddData.user_name } onChange={(e) => this.inputDataChange(e, 'user_name')}/>
              </Form.Item>
              <Form.Item label='手机号'>
                <Input placeholder="请输入手机号" allowClear value={ this.state.userAddData.user_phone } onChange={(e) => this.inputDataChange(e, 'user_phone')}/>
              </Form.Item>
              <Form.Item label='密码'>
                <Input placeholder="密码" allowClear value={ this.state.userAddData.user_password } onChange={(e) => this.inputDataChange(e, 'user_password')}/>
              </Form.Item>
              <Form.Item label='邮箱'>
                <Input placeholder="邮箱" allowClear value={ this.state.userAddData.user_email } onChange={(e) => this.inputDataChange(e, 'user_email')}/>
              </Form.Item>
              <Form.Item label='用户描述'>
                <Input placeholder="请输入用户描述" allowClear value={ this.state.userAddData.user_desc } onChange={(e) => this.inputDataChange(e, 'user_desc')}/>
              </Form.Item>
              <Form.Item label='生日'>
                <Input placeholder="YYYY-MM-DD" allowClear value={ this.state.userAddData.user_birthday } onChange={(e) => this.inputDataChange(e, 'user_birthday')}/>
              </Form.Item>
              <Form.Item label='年龄'>
                <Input placeholder="年龄" allowClear value={ this.state.userAddData.user_age } onChange={(e) => this.inputDataChange(e, 'user_age')}/>
              </Form.Item>
              <Form.Item label='IP'>
                <Input placeholder="IP" allowClear value={ this.state.userAddData.user_ip } onChange={(e) => this.inputDataChange(e, 'user_ip')}/>
              </Form.Item>
              <Form.Item label='公司ID'>
                <Input placeholder="公司ID" allowClear value={ this.state.userAddData.user_company_id } onChange={(e) => this.inputDataChange(e, 'user_company_id')}/>
              </Form.Item>
              <Form.Item label='公司名称'>
                <Input placeholder="公司名称" allowClear value={ this.state.userAddData.user_company_name } onChange={(e) => this.inputDataChange(e, 'user_company_name')}/>
              </Form.Item>
              <Form.Item label='权限'>
                <Input placeholder="权限" allowClear value={ this.state.userAddData.user_power } onChange={(e) => this.inputDataChange(e, 'user_power')}/>
              </Form.Item>
              <Form.Item label='权限日期'>
                <Input placeholder="权限日期" allowClear value={ this.state.userAddData.user_powerDate } onChange={(e) => this.inputDataChange(e, 'user_powerDate')}/>
              </Form.Item>
            </Form>
        </Modal>
        {/* 头部 */}
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="请输入用户名搜索" value={ this.state.search_user_name } onChange={ e => this.handdleSearchChange(e) } onPressEnter={ e => this.toSearch(e)} />
          </Form.Item>
          <Form.Item>
            <Button className='mr10' type="primary" onClick={ e => this.toSearch(e)}>search</Button>
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