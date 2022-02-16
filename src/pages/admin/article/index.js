import React from 'react'
import { color, timetrans } from '../../../utils'
import { Select, Table, Form, Button, Input, message, Modal, Tag, Upload, Icon, Row, Col} from 'antd';
import api from '../../../api'
import ReactWEditor from 'wangeditor-for-react';
const { Option } = Select
// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
class Article extends React.Component {

  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.state = {
      upImgApi: 'http://127.0.0.1:3002/upload/img',
      loading: false,
      delModalvisible: false, //显示弹弹窗
      addModalvisible: false,
      articleItemData: {},
      articleAddData: {
        article_visible_power: null,
        article_title: null,
        article_coverimg: null,
        article_desc: null,
        article_content: null,
        user_name: null,
        user_id: null,
        article_tag: null,
        article_tag_id: null,
        article_category: null,
        article_category_id: null,
        article_company: null,
        article_company_id: null,
        article_comment_count: null,
        article_like_count: null,
        article_read_count: null,
        article_repost_count: null,
      },
      article_tag: [],
      article_category: [],
      article_company: [],
      isEdit: false,
      search_article_title: '',//
      pageNo: 1,
      pageSize: 10,
      total: null,
      data: [],
      columns: [
        {
          title: '文章ID',
          dataIndex: 'article_id',
          key: 'article_id',
          width: 80,
          align: 'center'
        },
        {
          title: '发布用户',
          width: 100,
          key: 'user_name',
          dataIndex: 'user_name',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '标题',
          width: 100,
          key: 'article_title',
          dataIndex: 'article_title',
          render: name => (
            <Tag color={color[Math.floor(Math.random()*color.length)]}>{ name }</Tag>
          )
        },
        {
          title: '描述',
          key: 'article_desc',
          dataIndex: 'article_desc',
          width: 150,
          align: 'center'
        },
        {
          title: '阅读量',
          width: 100,
          key: 'article_like_count',
          dataIndex: 'article_like_count',
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
    this.getTagsList()
  }
  // 请求数据
  async getList () {
    this.setState({loading: true})
    const params = {
      article_title: this.state.search_article_title,
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize
    }
    const {data, total } = await api.get('article/list', params)
    // data.forEach((item, index) => {
    //   item.index = this.state.pageSize * (this.state.pageNo - 1) + index + 1
    // })
    this.setState({
      data,
      total,
      loading: false
      })
  }

  async getTagsList () {
    const {data, code} = await api.get('tag/findall')
    if (code === 200) this.setState({article_tag: data})
    const category = await api.get('category/findall')
    if (category.code === 200) this.setState({article_category: category.data})
    const company = await api.get('company/findall')
    if (company.code === 200) this.setState({article_company: company.data})
  }

  // 新增
    //取消新增弹窗显示
    handleAddCancel() {
      this.setState( {articleAddData: {}, addModalvisible: false, isEdit: false} )
      //重新设置编辑器内容
      this.editorRef.current.editor.txt.html('') // 重新设置编辑器内容
      //销毁 this.editorRef.current.destroy()
    }
    //新增弹窗确认
    async handleAddOk() {
      let params = { ...this.state.articleAddData }
      if(this.state.isEdit){ //如果是编辑
        const {code, data} = await api.post('article/update', params)
        if (code) { message.success('编辑成功！' + code); this.setState( {isEdit: false}) }
        else {message.error(data)}
      }else{
        const {code, msg} = await api.post('article/add', params)
        if (code) message.success('新增成功！' + code)
        else message.error(msg)
      }
      this.getList()
      this.setState( {articleAddData: {}, addModalvisible: false} )
      //重新设置编辑器内容
      this.editorRef.current.editor.txt.html('') // 重新设置编辑器内容
    }


  //article.content 改变
  toWEditorChange(html) {
    this.inputDataChange(null,'article_content',html)
  }

  /**
  * 双向绑定 input 修改方法
  */
  inputDataChange(event, objkey, objvalue) {
    let value = null
    event ? value = event.target.value : value = objvalue
    // let value = event.target.value || objvalue;
    let articleAddData = this.state.articleAddData;
    this.setState({
      articleAddData: {
        ...articleAddData, //拷贝当前对象
        [objkey]: value,//修改你要改的当前对象的那个属性值
      }
    });
  }

  //上传文章封面
  upAvatarimg(file) {
    let imgurl = null;
    if(file.file.response){
      imgurl = file.file.response.path
      this.inputDataChange(null,'article_coverimg',imgurl)
    }else{
      console.log("上传失败")
    }

    // const {code, data} = await api.post('upload/img', params)
  }
  //日期选择弹窗
  onDateChange(e){ 
    let moent = timetrans(e._d)
    this.inputDataChange(null,'user_birthday',moent)
  }
  //编辑弹窗显示
  async editClick (record) {
    await this.setState( {articleAddData: {...record}, addModalvisible: true, isEdit: true} )
    this.editorRef.current.editor.txt.html(record.article_content) // 重新设置编辑器内容
  }

  //删除
  //删除弹窗显示
  async delClick(record) {
    await this.setState( {articleItemData: record, delModalvisible: true} )
  }
  //取消删除弹窗显示
  handleDelCancel() {
    this.setState( {articleItemData: {}, delModalvisible: false} )
  }
  //删除弹窗确认删除
  async handleDelOk() {
    await api.post('article/del', {article_id: this.state.articleItemData.article_id})
    message.success('删除成功')
    this.getList()
    this.setState( {articleItemData: {}, delModalvisible: false} )
  }


  // 查询
  async handdleSearchChange (e) {
    // console.log('e.target.value',e.target.value)
    // this.setState({search_user_name: e.target.value})
    await this.setState({
      pageNo: 1,
      search_article_title: e.target.value || ''
    })
    // this.getList()
  }
  async toSearch () {
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

  //选择标签
  handlChangTag (val) {
    let insertVal = val.join()
    this.inputDataChange(null,'article_tag',insertVal)
  }
  handlChangCategory (val) {
    let insertVal = val.join()
    this.inputDataChange(null,'article_category',insertVal)
  }
  handlChangCompany (val) {
    let insertVal = val.join()
    this.inputDataChange(null,'article_company',insertVal)
  }
  
  render() {
    const { articleItemData, isEdit, upImgApi } = this.state;
    const { article_tag, article_category, article_company } = this.state.articleAddData;
    let categoryOption = this.state.article_category.map(item => {
      return <Option value={item.category_name} key={item.category_name}>{item.category_name}</Option>
    })
    let tagOption = this.state.article_tag.map(item => {
      return <Option value={item.tag_name} key={item.tag_name}>{item.tag_name}</Option>
    })
    let companyOption = this.state.article_company.map(item => {
      return <Option value={item.company_name} key={item.company_name}>{item.company_name}</Option>
    })
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
        xxl: { span: 8 },
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
    )
    return (
      <div>
        {/* 确认删除弹窗 */}
        <Modal
          title="确认删除"
          visible={ this.state.delModalvisible }
          onOk={this.handleDelOk.bind(this)}
          onCancel={ this.handleDelCancel.bind(this) }>
            <p>确认删除文章：{articleItemData ? articleItemData.article_title : ''}</p>
        </Modal>
        {/* 添加用户弹窗 */}
        <Modal
          title={isEdit ? "编辑用户" : "添加用户"}
          visible={ this.state.addModalvisible }
          width={800}
          onOk={this.handleAddOk.bind(this)}
          onCancel={ this.handleAddCancel.bind(this) }>
           
            <Form onSubmit={this.handleAddOk} {...formItemLayout}>
            · <Form.Item label='文章封面'>
                <Upload
                  name="myfile"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={upImgApi}
                  onChange={e => this.upAvatarimg(e)}
                >
                  {this.state.articleAddData.article_coverimg ? <img src={this.state.articleAddData.article_coverimg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label='标题'>
                <Input placeholder="标题" allowClear value={ this.state.articleAddData.article_title } onChange={(e) => this.inputDataChange(e, 'article_title')}/>
              </Form.Item>
              <Form.Item label='描述'>
                <Input placeholder="描述" allowClear value={ this.state.articleAddData.article_desc } onChange={(e) => this.inputDataChange(e, 'article_desc')}/>
              </Form.Item>
              <Row>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='发布用户名'>
                    <Input placeholder="发布用户名" allowClear value={ this.state.articleAddData.user_name } onChange={(e) => this.inputDataChange(e, 'user_name')}/>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='查看权限'>
                    <Input placeholder="article_visible_power" allowClear value={ this.state.articleAddData.article_visible_power } onChange={(e) => this.inputDataChange(e, 'article_visible_power')}/>
                  </Form.Item>
                </Col>
              </Row>  

              <Form.Item label='话题标签'>
                {/* <Input placeholder="tag" allowClear value={ this.state.articleAddData.article_tag } onChange={(e) => this.inputDataChange(e, 'article_tag')}/> */}
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder={article_tag}
                  addonBefore='tag'
                  onChange={this.handlChangTag.bind(this)}>
                  { tagOption }
                </Select>
              </Form.Item>
              <Form.Item label='分类标签'>
                {/* <Input placeholder="category" allowClear value={ this.state.articleAddData.article_category } onChange={(e) => this.inputDataChange(e, 'article_category')}/> */}
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder={article_category}
                  addonBefore='category'
                  onChange={this.handlChangCategory.bind(this)}>
                  { categoryOption }
                </Select>
              </Form.Item>
              <Form.Item label='公司标签'>
                {/* <Input placeholder="company" allowClear value={ this.state.articleAddData.article_company } onChange={(e) => this.inputDataChange(e, 'article_company')}/> */}
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder={article_company}
                  addonBefore='company'
                  onChange={this.handlChangCompany.bind(this)}>
                  { companyOption }
                </Select>
              </Form.Item>
              <Row>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='评论量'>
                    <Input placeholder="comment_count" allowClear value={ this.state.articleAddData.article_comment_count } onChange={(e) => this.inputDataChange(e, 'article_comment_count')}/>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='点赞量'>
                    <Input placeholder="like_count" allowClear value={ this.state.articleAddData.article_like_count } onChange={(e) => this.inputDataChange(e, 'article_like_count')}/>
                  </Form.Item>
                </Col>
                </Row>
                <Row>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='阅读量'>
                    <Input placeholder="read_count" allowClear value={ this.state.articleAddData.article_read_count } onChange={(e) => this.inputDataChange(e, 'article_read_count')}/>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label='转发量'>
                    <Input placeholder="repost_count" allowClear value={ this.state.articleAddData.article_repost_count } onChange={(e) => this.inputDataChange(e, 'article_repost_count')}/>
                  </Form.Item>
                </Col>
              </Row>


              {/* <Form.Item label='内容'> */}
                {/* <Input placeholder="article_content" allowClear value={ this.state.articleAddData.article_content } onChange={(e) => this.inputDataChange(e, 'article_content')}/> */}
                <ReactWEditor
                    ref={this.editorRef}
                    config={{
                      height: 400,
                      onchangeTimeout: 1000,
                      uploadImgServer: 'http://127.0.0.1:3002/upload/img',
                      uploadFileName: 'myfile'
                    }}
                    defaultValue={ '请输入' }
                    linkImgCallback={(src, alt, href) => {
                        // 插入网络图片的回调事件
                        console.log('图片 src ', src);
                        console.log('图片文字说明', alt);
                        console.log('跳转链接', href);
                    }}
                    onlineVideoCallback={(video) => {
                        // 插入网络视频的回调事件
                        console.log('插入视频内容', video);
                    }}
                    onChange={(html) => this.toWEditorChange(html)}
                    onBlur={(html) => {
                        console.log('onBlur html:', html);
                    }}
                    onFocus={(html) => {
                        console.log('onFocus html:', html);
                    }}
                />
              {/* </Form.Item> */}
            </Form>
        </Modal>
        {/* 头部 */}
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="请输入标题搜索" value={ this.state.search_article_title } onChange={ e => this.handdleSearchChange(e) } onPressEnter={ e => this.toSearch(e)} />
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
        rowKey={record => record.article_id}
        onChange={(page) => this.handleOnChange(page)}
      />

      </div>
    )
  }
}
const article = Form.create({ name: 'horizontal_login' })(Article)

export default article