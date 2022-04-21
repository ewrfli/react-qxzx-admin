import React from 'react'
import { color } from '../../../utils'
import { Table, Form, Button, Input, message, Modal, Tag } from 'antd';
import api from '../../../api'

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      commentItemData: {},
      commentAddData: {
        article_id: null,
        user_id: null,
        user_name: null,
        comment_content: null,
        comment_like_count: null,
        comment_father_id: null,
      },
      isEdit: false,
      search_user_name: '',//
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '评论ID',
          dataIndex: 'comment_id',
          key: 'comment_id',
          width: 80,
          align: 'center'
        },
        // {
        //   title: '用户名',
        //   width: 100,
        //   key: 'user_name',
        //   dataIndex: 'user_name',
        //   render: name => (
        //     <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
        //   )
        // },
        {
          title: '用户ID',
          dataIndex: 'user_id',
          key: 'user_id',
          width: 100,
          align: 'center'
        },
        {
          title: '资讯ID',
          key: 'article_id',
          dataIndex: 'article_id',
          width: 100,
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '评论内容',
          key: 'comment_content',
          dataIndex: 'comment_content',
          width: 100,
          align: 'center'
        },
        {
          title: '  点赞量',
          key: 'comment_like_count',
          dataIndex: 'comment_like_count',
          width: 100,
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
    const {data, total } = await api.get('comment/list', params)
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
      this.setState( {commentAddData: {}, addModalvisible: false, isEdit: false} )
    }
    //新增弹窗确认
    async handleAddOk() {
      console.log('新增弹窗确认')
      let params = { ...this.state.commentAddData }

      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('comment/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false }) }
        else {message.error(data)}
      }else{
        const {code, data} = await api.post('comment/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(data)
      }
      this.getList()
      this.setState( {commentAddData: {}, addModalvisible: false} )
    }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey, objvalue) {
    let value = null
    event ? value = event.target.value : value = objvalue
    // let value = event.target.value || objvalue;
    let commentAddData = this.state.commentAddData;
    this.setState({
      commentAddData: {
        ...commentAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
    console.log('this.state.commentAddData;',this.state.commentAddData)
  }

  //编辑弹窗显示
  async editClick (record) {
    console.log('update',record)
    await this.setState( {commentAddData: {...record}, addModalvisible: true, isEdit: true} )
  }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {commentItemData: record, delModalvisible: true} )
    console.log(record,this.state.commentItemData)
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {commentItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    console.log(this.state.commentItemData)
    await api.post('user/del', {user_id: this.state.commentItemData.user_id})
    message.success('删除成功')
    this.getList()
    this.setState( {commentItemData: {}, delModalvisible: false} )
  }


  // 查询
  async handdleSearchChange (e) {
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
    const { commentItemData, isEdit } = this.state;
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
            <p>确认删除标签：{commentItemData ? commentItemData.comment_name : ''}</p>
        </Modal>
        {/* 添加弹窗 */}
        <Modal
          title={isEdit ? "编辑标签" : "添加标签"}
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
              <Form.Item label='资讯ID'>
                <Input placeholder="请输入资讯ID" allowClear value={ this.state.commentAddData.article_id } onChange={(e) => this.inputDataChange(e, 'article_id')}/>
              </Form.Item>
              <Form.Item label='用户ID'>
                <Input placeholder="请输入用户ID" allowClear value={ this.state.commentAddData.user_id } onChange={(e) => this.inputDataChange(e, 'user_id')}/>
              </Form.Item>
              <Form.Item label='用户名'>
                <Input placeholder="请输入用户名" allowClear value={ this.state.commentAddData.user_name } onChange={(e) => this.inputDataChange(e, 'user_name')}/>
              </Form.Item>
              <Form.Item label='评论内容'>
                <Input placeholder="请输入评论内容" allowClear value={ this.state.commentAddData.comment_content } onChange={(e) => this.inputDataChange(e, 'comment_content')}/>
              </Form.Item>
              <Form.Item label='评论点赞量'>
                <Input placeholder="请输入点赞量" allowClear value={ this.state.commentAddData.comment_like_count } onChange={(e) => this.inputDataChange(e, 'comment_like_count')}/>
              </Form.Item>
              <Form.Item label='评论父ID'>
                <Input placeholder="请输入评论父ID" allowClear value={ this.state.commentAddData.comment_father_id } onChange={(e) => this.inputDataChange(e, 'comment_father_id')}/>
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
        rowKey={record => record.comment_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(comments)

export default article