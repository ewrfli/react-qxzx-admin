import React from 'react'
import { color } from '../../../utils'
import { Table, Form, Button, Input, message, Modal, Tag } from 'antd';
import api from '../../../api'

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class Star extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      starItemData: {},
      starAddData: {
        user_id: null,
        user_name: null,
        article_id: null,
        article_title: null,
      },
      isEdit: false,
      search_user_name: '',//
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '收藏ID',
          dataIndex: 'star_id',
          key: 'star_id',
          width: 80,
          align: 'center'
        },
        {
          title: '用户ID',
          width: 100,
          key: 'user_id',
          dataIndex: 'user_id',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
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
          title: '收藏资讯ID',
          dataIndex: 'article_id',
          key: 'article_id',
          width: 100,
          align: 'center'
        },
        {
          title: '收藏资讯标题',
          dataIndex: 'article_title',
          key: 'article_title',
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
    const {data, total } = await api.get('star/list', params)
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
      this.setState( {starAddData: {}, addModalvisible: false, isEdit: false} )
    }
    //新增弹窗确认
    async handleAddOk() {
      console.log('新增弹窗确认')
      let params = { ...this.state.starAddData }

      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('star/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false }) }
        else {message.error(data)}
      }else{
        const {code, data} = await api.post('star/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(data)
      }
      this.getList()
      this.setState( {starAddData: {}, addModalvisible: false} )
    }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey, objvalue) {
    let value = null
    event ? value = event.target.value : value = objvalue
    // let value = event.target.value || objvalue;
    let starAddData = this.state.starAddData;
    this.setState({
      starAddData: {
        ...starAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
    console.log('this.state.starAddData;',this.state.starAddData)
  }


  //编辑弹窗显示
  async editClick (record) {
    console.log('update',record)
    await this.setState( {starAddData: {...record}, addModalvisible: true, isEdit: true} )
  }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {starItemData: record, delModalvisible: true} )
    console.log(record,this.state.starItemData)
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {starItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    console.log(this.state.starItemData)
    await api.post('star/del', {user_id: this.state.starItemData.user_id})
    message.success('删除成功')
    this.getList()
    this.setState( {starItemData: {}, delModalvisible: false} )
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
    const { starItemData, isEdit } = this.state;
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
            <p>确认删除分类：{starItemData ? starItemData.user_name : ''}</p>
        </Modal>
        {/* 添加弹窗 */}
        <Modal
          title={isEdit ? "编辑分类" : "添加分类"}
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
              <Form.Item label='用户ID'>
                <Input placeholder="请输入用户ID" allowClear value={ this.state.starAddData.user_id } onChange={(e) => this.inputDataChange(e, 'user_id')}/>
              </Form.Item>
              <Form.Item label='用户名'>
                <Input placeholder="请输入用户名" allowClear value={ this.state.starAddData.user_name } onChange={(e) => this.inputDataChange(e, 'user_name')}/>
              </Form.Item>
              <Form.Item label='资讯ID'>
                <Input placeholder="请输入资讯ID" allowClear value={ this.state.starAddData.article_id } onChange={(e) => this.inputDataChange(e, 'article_id')}/>
              </Form.Item>
              <Form.Item label='资讯标题'>
                <Input placeholder="请输入资讯标题" allowClear value={ this.state.starAddData.article_title } onChange={(e) => this.inputDataChange(e, 'article_title')}/>
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
        rowKey={record => record.star_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(Star)

export default article