import React from 'react'
import { color, timetrans } from '../../../utils'
import { Table, Form, Button, Input, message, Modal, Tag, Upload, Icon } from 'antd';
import api from '../../../api'

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upImgApi: 'http://127.0.0.1:3002/upload/img',
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      categoryItemData: {},
      categoryAddData: {
        category_name: null,
        category_coverimg: null,
        category_desc: null,
        category_father_id: null,
      },
      isEdit: false,
      search_category_name: '',//
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '分类ID',
          dataIndex: 'category_id',
          key: 'category_id',
          width: 80,
          align: 'center'
        },
        {
          title: '分类名',
          width: 100,
          key: 'category_name',
          dataIndex: 'category_name',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '分类父ID',
          dataIndex: 'category_father_id',
          key: 'category_father_id',
          width: 80,
          align: 'center'
        },
        {
          title: '分类描述',
          key: 'category_desc',
          dataIndex: 'category_desc',
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
      category_name: this.state.search_category_name,
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize
    }
    const {data, total } = await api.get('category/list', params)
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
      this.setState( {categoryAddData: {}, addModalvisible: false, isEdit: false} )
    }
    //新增弹窗确认
    async handleAddOk() {
      console.log('新增弹窗确认')
      let params = { ...this.state.categoryAddData }

      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('category/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false }) }
        else {message.error(data)}
      }else{
        const {code, data} = await api.post('category/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(data)
      }
      this.getList()
      this.setState( {categoryAddData: {}, addModalvisible: false} )
    }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey, objvalue) {
    let value = null
    event ? value = event.target.value : value = objvalue
    // let value = event.target.value || objvalue;
    let categoryAddData = this.state.categoryAddData;
    this.setState({
      categoryAddData: {
        ...categoryAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
    console.log('this.state.categoryAddData;',this.state.categoryAddData)
  }

  //上传用户头像
  upAvatarimg(file) {
    console.log(file)
    let imgurl = null;
    if(file.file.response){
      imgurl = file.file.response.path
      this.inputDataChange(null,'category_coverimg',imgurl)
    }else{
      console.log("上传失败")
    }

    console.log('this.state.categoryAddData;',this.state.categoryAddData)
    // const {code, data} = await api.post('upload/img', params)
  }
  //日期选择弹窗
  onDateChange(e){ 
    let moent = timetrans(e._d)
    this.inputDataChange(null,'user_birthday',moent)
  }
  //编辑弹窗显示
  async editClick (record) {
    console.log('update',record)
    await this.setState( {categoryAddData: {...record}, addModalvisible: true, isEdit: true} )
  }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {categoryItemData: record, delModalvisible: true} )
    console.log(record,this.state.categoryItemData)
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {categoryItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    console.log(this.state.categoryItemData)
    await api.post('user/del', {user_id: this.state.categoryItemData.user_id})
    message.success('删除成功')
    this.getList()
    this.setState( {categoryItemData: {}, delModalvisible: false} )
  }


  // 查询
  async handdleSearchChange (e) {
    // console.log('e.target.value',e.target.value)
    // this.setState({search_category_name: e.target.value})
    await this.setState({
      pageNo: 1,
      search_category_name: e.target.value || ''
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
    const { categoryItemData, isEdit, upImgApi } = this.state;
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        {/* 确认删除弹窗 */}
        <Modal
          title="确认删除"
          visible={ this.state.delModalvisible }
          onOk={this.handleDelOk.bind(this)}
          onCancel={ this.handleDelCancel.bind(this) }>
            <p>确认删除分类：{categoryItemData ? categoryItemData.category_name : ''}</p>
        </Modal>
        {/* 添加弹窗 */}
        <Modal
          title={isEdit ? "编辑分类" : "添加分类"}
          visible={ this.state.addModalvisible }
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
            · <Form.Item label='分类Logo'>
                <Upload
                  name="myfile"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={upImgApi}
                  onChange={e => this.upAvatarimg(e)}
                >
                  {this.state.categoryAddData.category_coverimg ? <img src={this.state.categoryAddData.category_coverimg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label='分类Logo'>
                <Input placeholder="用户头像" allowClear value={ this.state.categoryAddData.category_coverimg } onChange={(e) => this.inputDataChange(e, 'category_coverimg')}/>
              </Form.Item>
              <Form.Item label='分类名'>
                <Input placeholder="请输入分类名" allowClear value={ this.state.categoryAddData.category_name } onChange={(e) => this.inputDataChange(e, 'category_name')}/>
              </Form.Item>
              <Form.Item label='分类描述'>
                <Input placeholder="请输入分类描述" allowClear value={ this.state.categoryAddData.category_desc } onChange={(e) => this.inputDataChange(e, 'category_desc')}/>
              </Form.Item>
              <Form.Item label='父分类ID'>
                <Input placeholder="请输入父分类ID" allowClear value={ this.state.categoryAddData.category_father_id } onChange={(e) => this.inputDataChange(e, 'category_father_id')}/>
              </Form.Item>

            </Form>
        </Modal>
        {/* 头部 */}
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="请输入分类名搜索" value={ this.state.search_category_name } onChange={ e => this.handdleSearchChange(e) } onPressEnter={ e => this.toSearch(e)} />
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
        rowKey={record => record.category_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(Category)

export default article