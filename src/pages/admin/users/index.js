import React from 'react'
import { color } from '../../../utils'
import { Table, Form, Button, message, Modal, Tag } from 'antd';
import api from '../../../api'
const { confirm } = Modal;

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      delModalvisible: false,
      tag: '',
      name: '',
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'user_id',
          key: 'user_id',
          width: 80,
          align: 'center'
        },
        {
          title: '用户名',
          width: 100,
          dataIndex: 'user_name',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '手机',
          dataIndex: 'user_phone',
          width: 150,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt'
        },
        {
          title: '操作',
          key: 'action',
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
  async editClick (record) {
    console.log('update',record)
    await api.post('user/update', record)
    message.success('编辑成功')
    this.getList()
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
    this.getList()
  }
  async getList () {
    this.setState({loading: true})
    const params = {
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
  // 查询
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields( async(err, values) => {
      if (!err) {
        await this.setState({
          pageNo: 1,
          name: values.name || ''
        })
        this.getList()
      }
    });
  }
  handdleChange (e) {
    this.setState({tag: e.target.value})
  }

  // 新增
  async handleOk () {
    const {code, data} = await api.post('tag/create', {name: this.state.tag})
    this.setState({
      visible: false,
      tag: ''
    })
    if (code === 1000) message.success('新增成功！')
    else message.error(data)
    this.getList()
  }

  //确认删除弹窗
  // handleDelOk(record) {
  //   await api.post('user/del', {user_id: record.user_id})
  //   message.success('删除成功')
  //   this.getList()
  //   this.setState({delModalvisible: false})
  // }
  // handleDelCancel () {
  //   this.setState({delModalvisible: false})
  // }

  async delClick(record) {
    confirm({
      title: '确认要删除?',
      content: `用户：${record.user_name}`,
      async onOk() {
        console.log('OK',record);
        await api.post('user/del', {user_id: record.user_id})
        await this.getList()
        await Modal.destroyAll();
        message.success('删除成功')


      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // page
  async handleOnChange (page) {
    await this.setState({
      pageNo: page.current,
      pageSize: page.pageSize
    })
    this.getList()
  }
  render() {
    // const { getFieldDecorator } = this.props.form
    return (
      <div>
        {/* <Modal
          title="确认删除"
          visible={ this.state.delModalvisible }
          onOk={this.handleDelOk.bind(this)}
          onCancel={ this.handleDelCancel.bind(this) }>
            <p>是否确认删除？</p>
        </Modal> */}
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item>
          {/* {getFieldDecorator('name')(
            <Input placeholder="请输入标签" allowClear={true} />
          )} */}
          </Form.Item>
          <Form.Item>
          <Button className='mr10' type="primary" htmlType="submit">search</Button>
          <Button type='primary' onClick={ _ => this.setState({delModalvisible: true}) }>create</Button>
        </Form.Item>
      </Form>
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
        rowKey={record => record.id}
        onChange={(page) => this.handleOnChange(page)}
      />
      </div>
    )
  }
}
// const User = Form.create({ name: 'horizontal_login' })(articleList)

export default User